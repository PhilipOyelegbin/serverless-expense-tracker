export interface Expense {
  readonly id: string;
  readonly userId: string;
  readonly amount: number;
  readonly description: string;
  readonly category: string;
  readonly date: string;
  readonly createdAt: string;
}

export interface ExpenseInput {
  readonly amount: number;
  readonly description: string;
  readonly category: string;
  readonly date: string;
}
