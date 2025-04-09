import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Strategies from "./pages/Strategies";
import MockTrades from "./pages/MockTrades";
import Wallet from "./pages/Wallet";
import NotFound from "./pages/NotFound";
import StrategyDetail from "./pages/StrategyDetail";
import AppProviders from "./components/AppProviders";
import { authClient } from "@/lib/auth";
// Route guard for authenticated routes
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { data, isPending, error, refetch } = authClient.useSession();

  console.log(data, isPending, error);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const isAuthenticated = data?.user;

  if (!isAuthenticated) {
    console.log("Not authenticated, navigating to login");
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => (
  <AppProviders>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />

        {/* App routes */}
        <Route
          path="/app"
          element={
            <RequireAuth>
              <Navigate to="/app/dashboard" replace />
            </RequireAuth>
          }
        />
        <Route
          path="/app/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/app/strategies"
          element={
            <RequireAuth>
              <Strategies />
            </RequireAuth>
          }
        />
        <Route
          path="/app/strategies/:strategyId"
          element={
            <RequireAuth>
              <StrategyDetail />
            </RequireAuth>
          }
        />
        <Route
          path="/app/mock-trades"
          element={
            <RequireAuth>
              <MockTrades />
            </RequireAuth>
          }
        />
        <Route
          path="/app/wallet"
          element={
            <RequireAuth>
              <Wallet />
            </RequireAuth>
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </AppProviders>
);

export default App;
