import apiClient from "./client";
import type {
  Expense,
  ExpenseInput,
  ListExpensesParams,
} from "../../../../packages/types/src";

// API Functions
export const fetchExpenses = async (params?: ListExpensesParams) => {
  const { data } = await apiClient.get("/expenses", { params });
  return data;
};

export const getExpenseById = async (id: string): Promise<Expense> => {
  const { data } = await apiClient.get(`/expenses/${id}`);
  return data;
};

export const spendExpenses = async () => {
  const { data } = await apiClient.get("/expenses/spending-by-category");
  return data;
};

export const totalExpenses = async (params: ListExpensesParams) => {
  const { data } = await apiClient.get("/expenses/total-spending-by-month", {
    params,
  });
  return data;
};

export const createExpense = async (
  payload: ExpenseInput
): Promise<Expense> => {
  const { data } = await apiClient.post("/expenses", payload);
  return data;
};

export const updateExpense = async ({
  id,
  payload,
}: {
  id: string;
  payload: ExpenseInput;
}): Promise<Expense> => {
  const { data } = await apiClient.put(`/expenses/${id}`, payload);
  return data;
};

export const deleteExpense = async (id: string): Promise<Expense> => {
  const { data } = await apiClient.delete(`/expenses/${id}`);
  return data;
};
