/** @format */

import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import StrategyPopup from "@/components/StrategyPopup";
import { useStrategies } from "@/lib/context/StrategiesContext";
import { useWallet } from "@/lib/context/WalletContext";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import PortfolioOverview from "@/components/Dashboard/PortfolioOverview";
import ActivePlans from "@/components/Dashboard/ActivePlans";
import MockPlans from "@/components/Dashboard/MockPlans";
import RecentActivities from "@/components/Dashboard/RecentActivities";

const Dashboard = () => {
  const { error: strategiesError } = useStrategies();
  const { error: walletsError } = useWallet();
  const [showStrategyPopup, setShowStrategyPopup] = useState(false);

  const error = strategiesError || walletsError;

  useEffect(() => {
    const shouldShowPopup =
      localStorage.getItem("showStrategyPopup") === "true";
    if (shouldShowPopup) {
      setShowStrategyPopup(true);
      localStorage.removeItem("showStrategyPopup");
    }
  }, []);

  const handleStrategyStart = () => {
    // In a real app, this would call the API to start a strategy
  };

  if (error) {
    return (
      <AppLayout>
        <div className="p-4 bg-red-50 text-red-600 rounded-md">
          Error loading dashboard data: {error}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <DashboardHeader />

      <StrategyPopup
        open={showStrategyPopup}
        onOpenChange={setShowStrategyPopup}
        onConfirm={handleStrategyStart}
      />

      <PortfolioOverview />
      <ActivePlans />
      <MockPlans />
      <RecentActivities />
    </AppLayout>
  );
};

export default Dashboard;
