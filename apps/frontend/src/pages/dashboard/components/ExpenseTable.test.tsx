import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { ExpenseTable } from "./ExpenseTable";

const mockExpenses = [
  {
    _id: "1",
    date: "2025-08-05",
    description: "Coffee",
    category: "Food",
    amount: 5.5,
    userId: "u1",
    createdAt: "",
  },
];

describe("ExpenseTable", () => {
  it("renders expense rows correctly", () => {
    render(
      <BrowserRouter>
        <ExpenseTable
          expenses={mockExpenses}
          onDelete={vi.fn()}
          filters={{}}
          onFilterChange={vi.fn()}
        />
      </BrowserRouter>
    );

    expect(screen.getByText("Coffee")).toBeInTheDocument();
    expect(screen.getByText("-$5.50")).toBeInTheDocument();
  });

  it("calls onDelete when delete button is clicked", () => {
    const onDeleteMock = vi.fn();
    // Mock window.confirm as it's used in the component
    vi.spyOn(window, "confirm").mockImplementation(() => true);

    render(
      <BrowserRouter>
        <ExpenseTable
          expenses={mockExpenses}
          onDelete={onDeleteMock}
          filters={{}}
          onFilterChange={vi.fn()}
        />
      </BrowserRouter>
    );

    const deleteBtn = screen.getByTitle("Delete Expense");
    fireEvent.click(deleteBtn);

    expect(onDeleteMock).toHaveBeenCalledWith("1");
  });
});
