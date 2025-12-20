import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MonthlySummary } from "./MonthlySummary";
import { renderWithProviders } from "../../../test/test-utils";

describe("MonthlySummary", () => {
  it("renders list items sorted by date", () => {
    const data = [
      { _id: "2025-01", totalAmount: 100 },
      { _id: "2025-02", totalAmount: 200 },
    ];

    renderWithProviders(<MonthlySummary data={data} />);

    const listItems = screen.getAllByRole("listitem");
    expect(listItems[0]).toHaveTextContent(/february/i);
    expect(listItems[1]).toHaveTextContent(/january/i);
  });
});
