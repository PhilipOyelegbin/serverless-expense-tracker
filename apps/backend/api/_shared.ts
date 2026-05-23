import type { APIGatewayEvent } from "aws-lambda";
import type { IncomingMessage, ServerResponse } from "node:http";
import {
  addExpense,
  authUser,
  createUser,
  deleteExpense,
  getExpenses,
  getExpensesById,
  spendingByCategory,
  totalSpendingByMonth,
  updateExpense,
} from "../handler";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
};

type RouteTarget =
  | typeof createUser
  | typeof authUser
  | typeof getExpenses
  | typeof getExpensesById
  | typeof addExpense
  | typeof updateExpense
  | typeof deleteExpense
  | typeof totalSpendingByMonth
  | typeof spendingByCategory;

function normalizeHeaders(
  headers: IncomingMessage["headers"],
): Record<string, string> {
  const normalizedHeaders: Record<string, string> = {};

  for (const [key, value] of Object.entries(headers)) {
    if (typeof value === "string") {
      normalizedHeaders[key] = value;
    } else if (Array.isArray(value)) {
      normalizedHeaders[key] = value.join(",");
    }
  }

  if (normalizedHeaders.authorization && !normalizedHeaders.Authorization) {
    normalizedHeaders.Authorization = normalizedHeaders.authorization;
  }

  if (normalizedHeaders.Authorization && !normalizedHeaders.authorization) {
    normalizedHeaders.authorization = normalizedHeaders.Authorization;
  }

  return normalizedHeaders;
}

function normalizePath(pathname: string) {
  const withoutApiPrefix = pathname.replace(/^\/api(?=\/|$)/, "");
  const withoutTrailingSlash = withoutApiPrefix.replace(/\/+$/, "");

  return withoutTrailingSlash === "" ? "/" : withoutTrailingSlash;
}

async function readBody(request: IncomingMessage) {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString("utf8");
}

function createEvent(
  request: IncomingMessage,
  pathname: string,
  body: string,
  pathParameters?: Record<string, string>,
): APIGatewayEvent {
  const url = new URL(request.url ?? "/", "http://localhost");

  return {
    body: body.length > 0 ? body : null,
    headers: normalizeHeaders(request.headers),
    httpMethod: (request.method ?? "GET").toUpperCase(),
    isBase64Encoded: false,
    multiValueHeaders: {},
    multiValueQueryStringParameters: null,
    path: pathname,
    pathParameters: pathParameters ?? null,
    queryStringParameters: Object.fromEntries(url.searchParams.entries()),
    requestContext: {} as APIGatewayEvent["requestContext"],
    resource: pathname,
    stageVariables: null,
  };
}

function routeRequest(
  method: string,
  pathname: string,
): { handler?: RouteTarget; pathParameters?: Record<string, string> } {
  if (method === "POST" && pathname === "/users/signup") {
    return { handler: createUser };
  }

  if (method === "POST" && pathname === "/users/signin") {
    return { handler: authUser };
  }

  if (method === "GET" && pathname === "/expenses/total-spending-by-month") {
    return { handler: totalSpendingByMonth };
  }

  if (method === "GET" && pathname === "/expenses/spending-by-category") {
    return { handler: spendingByCategory };
  }

  if (method === "GET" && pathname === "/expenses") {
    return { handler: getExpenses };
  }

  if (method === "POST" && pathname === "/expenses") {
    return { handler: addExpense };
  }

  const expenseIdMatch = pathname.match(/^\/expenses\/([^/]+)$/);
  if (expenseIdMatch) {
    const pathParameters = { id: decodeURIComponent(expenseIdMatch[1]) };

    if (method === "GET") {
      return { handler: getExpensesById, pathParameters };
    }

    if (method === "PUT") {
      return { handler: updateExpense, pathParameters };
    }

    if (method === "DELETE") {
      return { handler: deleteExpense, pathParameters };
    }
  }

  return {};
}

function writeResponse(
  response: ServerResponse,
  statusCode: number,
  body: unknown,
) {
  response.statusCode = statusCode;

  for (const [header, value] of Object.entries(corsHeaders)) {
    response.setHeader(header, value);
  }

  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(typeof body === "string" ? body : JSON.stringify(body));
}

export default async function handler(
  request: IncomingMessage,
  response: ServerResponse,
) {
  if ((request.method ?? "GET").toUpperCase() === "OPTIONS") {
    writeResponse(response, 204, "");
    return;
  }

  const url = new URL(request.url ?? "/", "http://localhost");
  const pathname = normalizePath(url.pathname);
  const { handler: routeHandler, pathParameters } = routeRequest(
    (request.method ?? "GET").toUpperCase(),
    pathname,
  );

  if (!routeHandler) {
    writeResponse(response, 404, { message: "Route not found" });
    return;
  }

  const body = await readBody(request);
  const event = createEvent(request, pathname, body, pathParameters);
  const result = await routeHandler(event);

  const responseHeaders = {
    ...corsHeaders,
    ...(result.headers ?? {}),
  };

  response.statusCode = result.statusCode ?? 200;
  for (const [header, value] of Object.entries(responseHeaders)) {
    response.setHeader(header, String(value));
  }
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(result.body ?? "");
}
