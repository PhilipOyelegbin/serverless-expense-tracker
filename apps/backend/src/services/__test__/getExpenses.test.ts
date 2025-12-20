import { describe, it, expect, vi, beforeEach } from "vitest";
import type { APIGatewayEvent } from "aws-lambda";
import { getExpenses } from "../../../handler";
import { getExpensesService } from "../expenseService";

vi.mock("../expenseService", () => ({
  getExpensesService: vi.fn(),
}));

const mockedGetExpensesService = getExpensesService as unknown as vi.Mock;

const baseEvent = {
  headers: {
    Authorization: "Bearer token",
  },
  queryStringParameters: null,
} as unknown as APIGatewayEvent;

describe("getExpenses handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 if token is missing", async () => {
    const response = await getExpenses({
      ...baseEvent,
      headers: {},
    } as APIGatewayEvent);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body).message).toBe(
      "Authorization token missing"
    );
  });

  it("returns expenses successfully", async () => {
    mockedGetExpensesService.mockResolvedValue({
      expenses: [],
    });

    const response = await getExpenses(baseEvent);

    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body).expenses).toEqual([]);
  });

  it("passes filters to service", async () => {
    mockedGetExpensesService.mockResolvedValue({
      expenses: [],
    });

    const eventWithFilters = {
      ...baseEvent,
      queryStringParameters: {
        startDate: "2025-01-01",
        endDate: "2025-01-31",
        category: "Food",
      },
    } as APIGatewayEvent;

    await getExpenses(eventWithFilters);

    expect(mockedGetExpensesService).toHaveBeenCalledWith("token", {
      startDate: "2025-01-01",
      endDate: "2025-01-31",
      category: "Food",
    });
  });

  it("returns 404 if no expenses found", async () => {
    mockedGetExpensesService.mockResolvedValue({
      expenses: [],
    });

    const response = await getExpenses(baseEvent);

    expect(response.statusCode).toBe(404);
  });
});
