import { connectToDatabase } from "../config/dbConfig";
import { decodeToken } from "../helper";
import { ObjectId } from "mongodb";
import {
  predefinedCategories,
  type ExpenseInput,
  type ListExpensesParams,
} from "./../../../../packages/types/src/index";

// Function to fetch all expenses
export const getExpensesService = async (token: string) => {
  const decodedToken = await decodeToken(token);
  const { db } = await connectToDatabase();
  const expenses = await db
    .collection("expenses")
    .find({ userId: decodedToken.id })
    .toArray();

  return { expenses };
};

// Function to fetch a single expense by ID
export const getExpenseByIdService = async (
  expenseId: string,
  token: string
) => {
  const decodedToken = await decodeToken(token);
  const { db } = await connectToDatabase();
  const expenses = await db
    .collection("expenses")
    .findOne({ _id: new ObjectId(expenseId), userId: decodedToken.id });

  return { expenses };
};

// Function to list expenses with optional date range and category filters
export const listExpensesService = async (
  filters: ListExpensesParams,
  token: string
) => {
  const { db } = await connectToDatabase();
  const decodedToken = await decodeToken(token);
  const query: any = {
    userId: decodedToken.id,
    date: {
      $gte: new Date(filters.startDate),
      $lte: new Date(filters.endDate),
    },
  };

  if (filters.category) {
    query.category = filters.category;
  }

  const expenses = await db.collection("expenses").find(query).toArray();
  return { expenses };
};

// Function to add a new expense
export const addExpenseService = async (
  expense: ExpenseInput,
  token: string
) => {
  const { db } = await connectToDatabase();
  const decodedToken = await decodeToken(token);

  const isPredefinedCategories = predefinedCategories.includes(
    expense.category
  );
  if (!isPredefinedCategories) {
    const existingCategory = await db
      .collection("categories")
      .findOne({ userId: decodedToken.id, category: expense.category });
    if (!existingCategory) {
      await db
        .collection("categories")
        .insertOne({ userId: decodedToken.id, category: expense.category });
    }
  }
  const formatDate = new Date(expense.date);
  expense.date = formatDate;
  const newExpense = await db
    .collection("expenses")
    .insertOne({ ...expense, userId: decodedToken.id });
  return { newExpense };
};

// Function to update an expense
export const updateExpenseService = async (
  expenseId: string,
  expense: ExpenseInput,
  token: string
) => {
  const decodedToken = await decodeToken(token);
  const { db } = await connectToDatabase();
  const formatDate = new Date(expense.date);
  expense.date = formatDate;
  const result = await db
    .collection("expenses")
    .updateOne(
      { _id: new ObjectId(expenseId), userId: decodedToken.id },
      { $set: { ...expense } }
    );

  if (result.matchedCount === 0) {
    throw new Error("Expense not found");
  }

  return { result };
};

// Function to delete an expense
export const deleteExpenseService = async (
  expenseId: string,
  token: string
) => {
  const decodedToken = await decodeToken(token);
  const { db } = await connectToDatabase();
  const result = await db
    .collection("expenses")
    .deleteOne({ _id: new ObjectId(expenseId), userId: decodedToken.id });

  if (result.deletedCount === 0) {
    throw new Error("Expense not found");
  }

  return { result };
};
