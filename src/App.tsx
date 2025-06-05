/** @format */
import { Buffer } from "buffer";
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
import Admin from "./pages/admin/Credits";
import { useQueryClient } from "@tanstack/react-query";
import Testnet from "./pages/Test";

window.Buffer = Buffer; // Polyfill Buffer for browser compatibility

// Route guard for authenticated routes
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { data, isPending, error, refetch } = authClient.useSession();

  console.log(data, isPending, error);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
          <p className="mt-2 text-slate-600 font-medium">
            Loading your account...
          </p>
        </div>
      </div>
    );
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

        <Route path="/test" element={<Testnet />} />

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

        <Route
          path="/admin/credits"
          element={
            <RequireAuth>
              <Admin />
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
