import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ExpenseForm } from "./ExpenseForm";
import { renderWithProviders } from "../../../test/test-utils";

describe("ExpenseForm", () => {
  it("submits the form with correct data", async () => {
    const onSubmitMock = vi.fn();
    renderWithProviders(
      <ExpenseForm onSubmit={onSubmitMock} isLoading={false} />
    );

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Groceries" },
    });
    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: "45.50" },
    });

    // Submit
    fireEvent.click(screen.getByRole("button", { name: /add expense/i }));

    expect(onSubmitMock).toHaveBeenCalledWith(
      expect.objectContaining({
        description: "Groceries",
        amount: 45.5,
      })
    );
  });

  it("disables the button while loading", () => {
    renderWithProviders(<ExpenseForm onSubmit={vi.fn()} isLoading={true} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
