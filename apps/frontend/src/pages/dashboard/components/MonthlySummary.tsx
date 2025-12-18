interface MonthlyData {
  readonly _id: string;
  readonly totalAmount: number;
}

export const MonthlySummary: React.FC<{
  readonly data: ReadonlyArray<MonthlyData>;
}> = ({ data }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <ul className="divide-y divide-gray-100">
      {[...data]
        .sort((a, b) => b._id.localeCompare(a._id))
        .map((item) => (
          <li
            key={item._id}
            className="px-6 py-4 flex justify-between items-center hover:bg-gray-50"
          >
            <span className="text-sm font-medium text-gray-600">
              {new Date(item._id + "-02").toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="text-lg font-bold text-gray-900">
              ${item.totalAmount.toLocaleString()}
            </span>
          </li>
        ))}
    </ul>
  </div>
);
