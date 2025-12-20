import { create } from "zustand";
import type { Expense } from "../../../../packages/types/src";

interface ExpenseState {
  readonly expenses: ReadonlyArray<Expense>;
  readonly setExpenses: (expenses: ReadonlyArray<Expense>) => void;
}

export const useExpenseStore = create<ExpenseState>((set) => ({
  expenses: [],
  setExpenses: (expenses) => set({ expenses }),
}));
