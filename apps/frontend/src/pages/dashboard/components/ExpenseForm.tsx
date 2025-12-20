import { useState } from "react";
import {
  type ExpenseInput,
  predefinedCategories,
} from "../../../../../../packages/types/src";

interface Props {
  readonly onSubmit: (data: ExpenseInput) => void;
  readonly isLoading: boolean;
}

export const ExpenseForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [form, setForm] = useState<ExpenseInput>({
    amount: 0,
    description: "",
    category: predefinedCategories[0],
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 space-y-4"
    >
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <input
          type="text"
          id="description"
          required
          className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>
      <div>
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700"
        >
          Amount
        </label>
        <input
          type="number"
          id="amount"
          required
          className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          value={form.amount}
          onChange={(e) =>
            setForm({ ...form, amount: parseFloat(e.target.value) })
          }
        />
      </div>
      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700"
        >
          Date
        </label>
        <input
          type="date"
          id="date"
          required
          className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
      </div>
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <select
          className="w-full mt-1 p-2 border rounded-md"
          id="category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          {predefinedCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="cursor-pointer w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {isLoading ? "Saving..." : "Add Expense"}
      </button>
    </form>
  );
};
