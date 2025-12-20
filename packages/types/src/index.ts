export interface User {
  readonly _id: string;
  readonly email: string;
  readonly password: string;
  readonly createdAt: string;
}

export interface Expense {
  readonly _id: string;
  readonly userId: string;
  readonly amount: number;
  readonly description: string;
  readonly category: string;
  readonly date: string;
  readonly createdAt: string;
}

export interface UserInput {
  readonly email: string;
  readonly password: string;
}

export interface ExpenseInput {
  readonly amount: number;
  readonly description: string;
  readonly category: string;
  date: string;
}

export interface ListExpensesParams {
  readonly startDate?: string;
  readonly endDate?: string;
  readonly category?: string;
}

export const predefinedCategories = [
  "Food",
  "Transport",
  "Entertainment",
  "Utilities",
  "Health",
  "Education",
  "Other",
];
