/** @format */

import { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { StrategyHeader } from "@/components/StrategyDetail/StrategyHeader";
import { StrategyOverview } from "@/components/StrategyDetail/StrategyOverview";
import { StrategyDetails } from "@/components/StrategyDetail/StrategyDetails";
import { TransactionList } from "@/components/StrategyDetail/TransactionList";

const StrategyDetail = () => {
  const { strategyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're viewing a user strategy or a general strategy template
  const isUserStrategy =
    location.state?.planId || location.state?.source === "dashboard";

  const {
    data: userStrategy,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userStrategy", strategyId],
    queryFn: async () => {
      if (!strategyId) throw new Error("Strategy ID is required");
      // const url = `/user/analytics/strategies/${strategyId}`;
      const {
        data: { data },
      } = await api.strategies.getDetails(strategyId);
      return data;
    },
    enabled: !!strategyId,
  });

  useEffect(() => {
    if (!isLoading) {
      if (!userStrategy) {
        navigate("/app/strategies");
        return;
      }
    }
  }, [isLoading, navigate, strategyId, userStrategy]);

  if (isLoading || !userStrategy) {
    return (
      <AppLayout>
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="p-4 bg-red-50 text-red-600 rounded-md">
          Error loading strategy data: {error.message}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <StrategyHeader isUserStrategy={isUserStrategy} />

      {/* Strategy Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <StrategyOverview userStrategy={userStrategy} />
        <StrategyDetails userStrategy={userStrategy} />
      </div>

      <TransactionList />
    </AppLayout>
  );
};

export default StrategyDetail;
