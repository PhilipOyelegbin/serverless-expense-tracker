import { connectToDatabase } from "../config/dbConfig";
import { decodeToken } from "../helper";
import { ObjectId } from "mongodb";

interface Expense {
  amount: number;
  description: string;
  category: string;
  date: string;
}

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

// Function to add a new expense
export const addExpenseService = async (expense: Expense, token: string) => {
  const decodedToken = await decodeToken(token);
  const { db } = await connectToDatabase();
  const newExpense = await db
    .collection("expenses")
    .insertOne({ ...expense, userId: decodedToken.id });
  return { newExpense };
};

// Function to update an expense
export const updateExpenseService = async (
  expenseId: string,
  expense: Expense,
  token: string
) => {
  const decodedToken = await decodeToken(token);
  const { db } = await connectToDatabase();
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
