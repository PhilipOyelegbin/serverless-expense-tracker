import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { ExpenseForm } from "./components/ExpenseForm";
import { CategorySpendingChart } from "./components/CategorySpendingChart";
import { ExpenseTable } from "./components/ExpenseTable";
import { MonthlySummary } from "./components/MonthlySummary";
import type { ListExpensesParams } from "../../../../../packages/types/src/index";
import {
  fetchExpenses,
  createExpense,
  totalExpenses,
  spendExpenses,
  deleteExpense,
} from "../../api/expenseApi";

export const Dashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const setToken = useAuthStore((state) => state.setToken);

  const [filters, setFilters] = React.useState<ListExpensesParams>({
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    category: undefined,
  });

  // --- Handlers ---
  const handleLogout = () => {
    setToken(null);
  };

  // --- Queries ---
  const { data: expenseData } = useQuery({
    queryKey: ["expenses", filters],
    queryFn: () => fetchExpenses(filters),
  });
  const { data: spendData } = useQuery({
    queryKey: ["expenses", "spending"],
    queryFn: spendExpenses,
  });
  const { data: totalData } = useQuery({
    queryKey: ["expenses", "total", filters],
    queryFn: () => totalExpenses(filters),
  });

  // --- Mutations ---
  const mutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["expenses"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteExpense(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["expenses"] }),
  });

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Expense Tracker
            </h1>
            <p className="text-gray-500 text-sm">
              Manage your personal finances with ease.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-100 rounded-lg cursor-pointer hover:bg-red-50 transition-all shadow-sm"
          >
            <LogOut size={18} />
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-xl font-bold text-gray-800">New Expense</h2>
            <ExpenseForm
              onSubmit={mutation.mutate}
              isLoading={mutation.isPending}
            />
          </div>

          <div className="lg:col-span-2">
            <CategorySpendingChart
              data={spendData?.spendingByCategory?.result || []}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              All Expenses
            </h2>
            <ExpenseTable
              expenses={expenseData?.expenses || []}
              filters={filters}
              onFilterChange={setFilters}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          </div>

          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Monthly Summary
            </h2>
            <MonthlySummary data={totalData?.spendingByMonth?.result || []} />
          </div>
        </div>
      </div>
    </main>
  );
};
