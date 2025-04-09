
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Strategies from "./pages/Strategies";
import MockTrades from "./pages/MockTrades";
import Wallet from "./pages/Wallet";
import NotFound from "./pages/NotFound";
import StrategyDetail from "./pages/StrategyDetail";

const queryClient = new QueryClient();

// Route guard for authenticated routes
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = localStorage.getItem('cryptoclick_user');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          
          {/* App routes */}
          <Route path="/app" element={<RequireAuth><Navigate to="/app/dashboard" replace /></RequireAuth>} />
          <Route path="/app/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/app/strategies" element={<RequireAuth><Strategies /></RequireAuth>} />
          <Route path="/app/strategies/:strategyId" element={<RequireAuth><StrategyDetail /></RequireAuth>} />
          <Route path="/app/mock-trades" element={<RequireAuth><MockTrades /></RequireAuth>} />
          <Route path="/app/wallet" element={<RequireAuth><Wallet /></RequireAuth>} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
