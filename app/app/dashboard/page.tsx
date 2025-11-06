/** @format */

"use client";

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AppLayout from "@/components/AppLayout";
import StrategyPopup from "@/components/StrategyPopup";
import { useStrategies } from "@/lib/context/StrategiesContext";
import { api } from "@/api";
import PortfolioOverview from "@/components/Dashboard/PortfolioOverview";
import ActivePlans from "@/components/Dashboard/ActivePlans";
import MockPlans from "@/components/Dashboard/MockPlans";
import RecentActivities from "@/components/Dashboard/RecentActivities";

const DashboardContent = () => {
  const queryClient = useQueryClient();
  const { error: strategiesError } = useStrategies();
  const [showStrategyPopup, setShowStrategyPopup] = useState(false);

  const error = strategiesError;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const shouldShowPopup =
        localStorage.getItem("showStrategyPopup") === "true";
      if (shouldShowPopup) {
        setShowStrategyPopup(true);
        localStorage.removeItem("showStrategyPopup");
      }
    }
  }, []);

  // Prefetch data for Live Strategies, Paper Trades, and Leaderboard to avoid repeated loading spinners on navigation
  useEffect(() => {
    const prefetch = async () => {
      try {
        await Promise.all([
          // Active strategies analytics - mock (Paper Trades)
          queryClient.prefetchQuery({
            queryKey: ["activeStrategiesAnalytics", "mock"],
            queryFn: async () => {
              const {
                data: { data },
              } = await api.analytics.getActiveMockStrategies();
              return data;
            },
            staleTime: 5 * 60 * 1000,
          }),
          // Active strategies analytics - real (Live)
          queryClient.prefetchQuery({
            queryKey: ["activeStrategiesAnalytics", "real"],
            queryFn: async () => {
              const {
                data: { data },
              } = await api.analytics.getActiveLiveStrategies();
              return data;
            },
            staleTime: 5 * 60 * 1000,
          }),
          // Leaderboard page data
          queryClient.prefetchQuery({
            queryKey: ["leaderboard"],
            queryFn: async () => {
              const response = await api.xp.leaderboard();
              return response.data;
            },
            staleTime: 5 * 60 * 1000,
          }),
        ]);
      } catch (e) {
        // Silent failure; dashboard UI already handles error states
      }
    };

    prefetch();
  }, [queryClient]);

  const handleStrategyStart = () => {
    // In a real app, this would call the API to start a strategy
  };

  if (error) {
    return (
      <div className="p-6 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg">
        <h3 className="text-subtitle font-semibold mb-2">
          Error loading dashboard data
        </h3>
        <p className="text-body">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      {/* <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Dashboard
        </h1>
      </div> */}

      <StrategyPopup
        open={showStrategyPopup}
        onOpenChange={setShowStrategyPopup}
        onConfirm={handleStrategyStart}
      />

      <PortfolioOverview />
      <ActivePlans />
      <MockPlans />
      <RecentActivities />
    </div>
  );
};

const Dashboard = () => {
  return (
    <AppLayout>
      <DashboardContent />
    </AppLayout>
  );
};

export default Dashboard;
