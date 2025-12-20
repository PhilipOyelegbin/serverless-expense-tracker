import { describe, it, expect, vi, beforeEach } from "vitest";
import { connectToDatabase } from "../../config/dbConfig";
import { decodeToken } from "../../helper";
import { getExpensesService } from "../expenseService";

vi.mock("../../config/dbConfig", () => ({
  connectToDatabase: vi.fn(),
}));

vi.mock("../../helper", () => ({
  decodeToken: vi.fn(),
}));

const mockFind = vi.fn();
const mockToArray = vi.fn();

const mockedConnectToDatabase = connectToDatabase as unknown as vi.Mock;
const mockedDecodeToken = decodeToken as unknown as vi.Mock;

mockedConnectToDatabase.mockResolvedValue({
  db: {
    collection: () => ({
      find: mockFind.mockReturnValue({
        toArray: mockToArray,
      }),
    }),
  },
} as any);

mockedDecodeToken.mockResolvedValue({
  id: "user-123",
} as any);

describe("getExpensesService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns all expenses for user when no filters are provided", async () => {
    mockToArray.mockResolvedValue([{ id: "1" }]);

    const result = await getExpensesService("token");

    expect(mockFind).toHaveBeenCalledWith({
      userId: "user-123",
    });

    expect(result.expenses).toHaveLength(1);
  });

  it("applies date filters", async () => {
    mockToArray.mockResolvedValue([]);

    await getExpensesService("token", {
      startDate: "2025-01-01",
      endDate: "2025-01-31",
    });

    expect(mockFind).toHaveBeenCalledWith({
      userId: "user-123",
      date: {
        $gte: new Date("2025-01-01"),
        $lte: new Date("2025-01-31"),
      },
    });
  });

  it("applies category filter", async () => {
    mockToArray.mockResolvedValue([]);

    await getExpensesService("token", {
      startDate: "2025-01-01",
      endDate: "2025-01-31",
      category: "Food",
    });

    expect(mockFind).toHaveBeenCalledWith({
      userId: "user-123",
      date: {
        $gte: new Date("2025-01-01"),
        $lte: new Date("2025-01-31"),
      },
      category: "Food",
    });
  });
});
