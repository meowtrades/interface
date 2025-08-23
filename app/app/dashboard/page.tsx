/** @format */

"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import StrategyPopup from "@/components/StrategyPopup";
import { useStrategies } from "@/lib/context/StrategiesContext";
import { useWallet } from "@/lib/context/WalletContext";
import PortfolioOverview from "@/components/Dashboard/PortfolioOverview";
import ActivePlans from "@/components/Dashboard/ActivePlans";
import MockPlans from "@/components/Dashboard/MockPlans";
import RecentActivities from "@/components/Dashboard/RecentActivities";

const DashboardContent = () => {
  const { error: strategiesError } = useStrategies();
  const { error: walletsError } = useWallet();
  const [showStrategyPopup, setShowStrategyPopup] = useState(false);

  const error = strategiesError || walletsError;

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
