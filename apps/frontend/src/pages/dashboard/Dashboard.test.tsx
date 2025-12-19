import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Dashboard } from "./page";
import { renderWithProviders } from "../../test/test-utils";

describe("Dashboard Page", () => {
  it("renders all core sections", () => {
    renderWithProviders(<Dashboard />);

    // Check for Section Headers
    expect(screen.getByText(/expense tracker/i)).toBeInTheDocument();
    expect(screen.getByText(/new expense/i)).toBeInTheDocument();
    expect(screen.getByText(/spending by category/i)).toBeInTheDocument();
    expect(screen.getByText(/all expenses/i)).toBeInTheDocument();
    expect(screen.getByText(/monthly summary/i)).toBeInTheDocument();
  });
});
