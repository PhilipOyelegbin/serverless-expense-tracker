import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Filter, X } from "lucide-react";
import {
  type ListExpensesParams,
  type Expense,
  predefinedCategories,
} from "../../../../../../packages/types/src/index";

interface Props {
  readonly expenses: ReadonlyArray<Expense>;
  readonly filters: ListExpensesParams;
  readonly onFilterChange: (filters: ListExpensesParams) => void;
  readonly onDelete: (id: string) => void;
}

export const ExpenseTable: React.FC<Props> = ({
  expenses,
  filters,
  onFilterChange,
  onDelete,
}) => {
  const navigate = useNavigate();

  const handleUpdateFilter = (updates: Partial<ListExpensesParams>) => {
    onFilterChange({ ...filters, ...updates });
  };

  const clearFilters = () => {
    onFilterChange({ startDate: "", endDate: "", category: "" });
  };

  return (
    <div className="space-y-4">
      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap items-end gap-4">
        <div className="flex items-center gap-2 text-gray-500 mb-7 md:mb-0 mr-2">
          <Filter size={18} />
          <span className="text-sm font-semibold uppercase tracking-wider">
            Filters
          </span>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase mb-1">
              Start Date
            </label>
            <input
              type="date"
              className="w-full text-sm border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 border outline-none"
              value={filters.startDate}
              onChange={(e) =>
                handleUpdateFilter({ startDate: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase mb-1">
              End Date
            </label>
            <input
              type="date"
              className="w-full text-sm border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 border outline-none"
              value={filters.endDate}
              onChange={(e) => handleUpdateFilter({ endDate: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase mb-1">
              Category
            </label>
            <select
              className="w-full text-sm border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 border outline-none bg-white"
              value={filters.category || ""}
              onChange={(e) =>
                handleUpdateFilter({ category: e.target.value || "" })
              }
            >
              <option value="">All Categories</option>
              {predefinedCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={clearFilters}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1 text-sm font-medium mb-1"
          title="Clear Filters"
        >
          <X size={16} />
          Clear
        </button>
      </div>

      {/* TABLE VIEW */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Date", "Description", "Category", "Amount"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase"
                >
                  {h}
                </th>
              ))}
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {expenses.map((exp) => (
              <tr
                key={exp._id}
                className="hover:bg-gray-50 transition-colors group"
              >
                <td className="px-6 py-4 text-sm text-gray-600">{exp.date}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {exp.description}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 bg-gray-100 rounded text-gray-600 text-xs">
                    {exp.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-red-600">
                  -${exp.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() =>
                        navigate(`/dashboard/expenses/edit/${exp._id}`)
                      }
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                      title="Edit Expense"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this expense?"
                          )
                        ) {
                          onDelete(exp._id);
                        }
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete Expense"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {expenses.length === 0 && (
          <div className="p-12 text-center text-gray-400 italic">
            No expenses found matching these filters.
          </div>
        )}
      </div>
    </div>
  );
};
