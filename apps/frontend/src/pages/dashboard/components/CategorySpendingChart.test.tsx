import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CategorySpendingChart } from "./CategorySpendingChart";
import { renderWithProviders } from "../../../test/test-utils";

describe("CategorySpendingChart", () => {
  it('renders a "No data" message when the data array is empty', () => {
    renderWithProviders(<CategorySpendingChart data={[]} />);
    expect(screen.getByText(/no category data available/i)).toBeInTheDocument();
  });
});
