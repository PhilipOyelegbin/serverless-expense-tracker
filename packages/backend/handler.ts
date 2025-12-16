import { APIGatewayEvent } from "aws-lambda";
import { createUserService, loginUserService } from "./services/authService";
import {
  getExpensesService,
  addExpenseService,
  updateExpenseService,
  deleteExpenseService,
  getExpenseByIdService,
} from "./services/expenseService";

// Lambda function to create a new user
export const createUser = async (event: APIGatewayEvent) => {
  try {
    const { email, password } = JSON.parse(event.body!);
    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Email and password are required" }),
      };
    }

    const user = { email, password };
    const result = await createUserService(user);
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "User registered successfully",
        user: result,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to register user",
      }),
    };
  }
};

// Lambda function to authenticate a user
export const authUser = async (event: APIGatewayEvent) => {
  try {
    const { email, password } = JSON.parse(event.body!);
    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Email and password are required" }),
      };
    }

    const user = { email, password };
    const result = await loginUserService(user);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Login successful",
        token: result.token,
      }),
    };
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: "Failed to login",
      }),
    };
  }
};

// Lambda function to fetch all expenses
export const getExpenses = async (event: APIGatewayEvent) => {
  try {
    const token = event.headers?.Authorization?.split(" ")[1];
    if (!token) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Authorization token missing" }),
      };
    }
    const result = await getExpensesService(token);
    if (result.expenses.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "No expenses found",
          expenses: [],
        }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "All expenses found",
        expenses: result.expenses,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to fetch expenses",
        error: error,
      }),
    };
  }
};

// Lambda function to fetch one expense by ID
export const getExpensesById = async (event: APIGatewayEvent) => {
  try {
    const token = event.headers?.Authorization?.split(" ")[1];
    if (!token) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Authorization token missing" }),
      };
    }
    const expenseId = event.pathParameters!.id;
    const result = await getExpenseByIdService(expenseId, token);
    if (!result.expenses || result.expenses.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "No expenses found",
          expenses: [],
        }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Expense found",
        expenses: result.expenses,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to fetch expenses",
        error: error,
      }),
    };
  }
};

// Lambda function to add a new expense
export const addExpense = async (event: APIGatewayEvent) => {
  const token = event.headers?.Authorization?.split(" ")[1];
  if (!token) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Authorization token missing" }),
    };
  }

  const { amount, description, category, date, userId } = JSON.parse(
    event.body!
  );
  try {
    const result = await addExpenseService(
      {
        amount,
        description,
        category,
        date,
      },
      token
    );
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "New expense created",
        expense: result.newExpense,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to add expense", error: error }),
    };
  }
};

// Lambda function to update an existing expense
export const updateExpense = async (event: APIGatewayEvent) => {
  const token = event.headers?.Authorization?.split(" ")[1];
  if (!token) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Authorization token missing" }),
    };
  }
  const expenseId = event.pathParameters!.id;
  const { amount, description, category, date } = JSON.parse(event.body!);
  try {
    const result = await updateExpenseService(
      expenseId,
      {
        amount,
        description,
        category,
        date,
      },
      token
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Expense updated", expense: result }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to update expense",
        error: error,
      }),
    };
  }
};

// Lambda function to delete an expense
export const deleteExpense = async (event: APIGatewayEvent) => {
  const token = event.headers?.Authorization?.split(" ")[1];
  if (!token) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Authorization token missing" }),
    };
  }
  const expenseId = event.pathParameters!.id;

  try {
    await deleteExpenseService(expenseId, token);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Expense deleted" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to delete expense",
        error: error,
      }),
    };
  }
};
