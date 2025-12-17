import { connectToDatabase } from "../config/dbConfig";
import { decodeToken } from "../helper";

// Function to get total spending by month within a date range
export const totalSpendingByMonthService = async (
  token: string,
  startDate: string,
  endDate: string
) => {
  const decoded = await decodeToken(token);
  const userId = decoded.id;
  const { db } = await connectToDatabase();

  // Format the date to group by year-month (YYYY-MM)
  const pipeline = [
    {
      $match: {
        userId,
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $project: {
        amount: 1,
        month: { $dateToString: { format: "%Y-%m", date: "$date" } },
      },
    },
    {
      $group: {
        _id: "$month",
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ];

  const result = await db.collection("expenses").aggregate(pipeline).toArray();
  return { result };
};

// Function to get spending by category
export const spendingByCategoryService = async (token: string) => {
  const decoded = await decodeToken(token);
  const userId = decoded.id;
  const { db } = await connectToDatabase();

  // MongoDB aggregation pipeline
  const pipeline = [
    {
      $match: {
        userId,
      },
    },
    {
      $group: {
        _id: "$category",
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $sort: { totalAmount: -1 },
    },
  ];

  const result = await db.collection("expenses").aggregate(pipeline).toArray();
  return { result };
};
