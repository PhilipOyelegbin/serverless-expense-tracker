import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthPage } from "./page";

const queryClient = new QueryClient();

describe("AuthPage", () => {
  it("toggles between Login and Register modes", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthPage />
        </BrowserRouter>
      </QueryClientProvider>
    );

    // Initial state: Login
    expect(screen.getByText(/Sign in to your account/i)).toBeInTheDocument();

    // Click toggle button
    const toggleBtn = screen.getByText(/Don't have an account\? Register/i);
    fireEvent.click(toggleBtn);

    // New state: Register
    expect(screen.getByText(/Create new account/i)).toBeInTheDocument();
  });
});
