import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import { getExpenseById, updateExpense } from "../../api/expenseApi";
import {
  type ExpenseInput,
  predefinedCategories,
} from "../../../../../packages/types/src/index";

export const EditExpensePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<ExpenseInput>({
    amount: 0,
    description: "",
    category: "Other",
    date: "",
  });

  const {
    data: expense,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["expense", id],
    queryFn: () => getExpenseById(id!),
    enabled: !!id,
  });

  function setFormData(data: ExpenseInput | { expenses?: ExpenseInput }): void {
    const expenseData: ExpenseInput =
      "expenses" in data && data.expenses
        ? data.expenses
        : (data as ExpenseInput);

    setForm({
      amount: expenseData.amount,
      description: expenseData.description,
      category: expenseData.category,
      date: expenseData.date,
    });
  }

  useEffect(() => {
    if (expense) {
      setFormData(expense);
    }
  }, [expense]);

  const mutation = useMutation({
    mutationFn: (payload: ExpenseInput) => updateExpense({ id: id!, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      navigate("/dashboard");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  if (isLoading)
    return (
      <div className="p-8 text-center text-gray-500">
        Loading expense details...
      </div>
    );
  if (isError)
    return (
      <div className="p-8 text-center text-red-500">Error loading expense.</div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            Edit Expense
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <input
                type="text"
                id="description"
                required
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Amount ($)
                </label>
                <input
                  type="number"
                  id="amount"
                  step="0.01"
                  required
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({ ...form, amount: parseFloat(e.target.value) })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <select
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  id="category"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  {predefinedCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date
              </label>
              <input
                type="date"
                id="date"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Save size={20} />
              {mutation.isPending ? "Saving Changes..." : "Update Expense"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
