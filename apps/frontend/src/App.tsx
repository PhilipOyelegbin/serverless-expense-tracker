import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "./pages/auth/page";
import { Dashboard } from "./pages/dashboard/page";
import { useAuthStore } from "./store/useAuthStore";
import { EditExpensePage } from "./pages/dashboard/EditExpensePage";

const App = () => {
  const token = useAuthStore((state) => state.token);

  return (
    <BrowserRouter>
      <Routes>
        {/* If authenticated, redirect home to dashboard */}
        <Route
          path="/"
          element={!token ? <AuthPage /> : <Navigate to="/dashboard" />}
        />

        {/* Protected Route */}
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/dashboard/expenses/edit/:id"
          element={token ? <EditExpensePage /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
