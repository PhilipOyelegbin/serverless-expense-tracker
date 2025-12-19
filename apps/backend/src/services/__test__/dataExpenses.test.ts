import { describe, it, expect, vi, beforeEach } from "vitest";
import { connectToDatabase } from "../../config/dbConfig";
import { decodeToken } from "../../helper";
import {
  addExpenseService,
  updateExpenseService,
  deleteExpenseService,
} from "../expenseService";

vi.mock("../../config/dbConfig", () => ({
  connectToDatabase: vi.fn(),
}));

vi.mock("../../helper", () => ({
  decodeToken: vi.fn(),
}));

const insertOne = vi.fn();
const updateOne = vi.fn();
const deleteOne = vi.fn();

vi.mocked(connectToDatabase).mockResolvedValue({
  db: {
    collection: () => ({
      insertOne,
      updateOne,
      deleteOne,
    }),
  },
} as any);

vi.mocked(decodeToken).mockResolvedValue({
  id: "9943ea9cfe3926a959f53465",
} as any);

describe("Expense Services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ----------------------
  // Add Expense
  // ----------------------
  it("adds a new expense successfully", async () => {
    insertOne.mockResolvedValue({
      insertedId: "6943ea9cfe3926a959f53474",
    });

    const expenseData = {
      amount: 100,
      description: "Lunch",
      category: "Food",
      date: "2025-12-19",
    };

    const result = await addExpenseService(expenseData, "token");

    expect(insertOne).toHaveBeenCalledWith({
      ...expenseData,
      userId: "9943ea9cfe3926a959f53465",
      date: new Date(expenseData.date),
    });
    expect(result?.newExpense).toStrictEqual({
      insertedId: "6943ea9cfe3926a959f53474",
    });
  });

  // ----------------------
  // Update Expense
  // ----------------------
  it("throws error if expense to update does not exist", async () => {
    updateOne.mockResolvedValue({ matchedCount: 0 });

    const updatedData = {
      amount: 500,
      description: "Transport fare to airport.",
      category: "Transportation",
      date: "2025-10-01",
    };

    await expect(
      updateExpenseService("6953da9cfe3926a959f53474", updatedData, "token")
    ).rejects.toThrow("Expense not found");
  });

  // ----------------------
  // Delete Expense
  // ----------------------
  it("throws error if expense to delete does not exist", async () => {
    deleteOne.mockResolvedValue({ deletedCount: 0 });

    await expect(
      deleteExpenseService("6953da9cfe3926a959f53474", "token")
    ).rejects.toThrow("Expense not found");
  });
});
