/** @format */

"use client";

import { useEffect, Suspense } from "react";
import { useParams, useRouter, usePathname, useSearchParams } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { StrategyHeader } from "@/components/StrategyDetail/StrategyHeader";
import { StrategyOverview } from "@/components/StrategyDetail/StrategyOverview";
import { StrategyDetails } from "@/components/StrategyDetail/StrategyDetails";
import { TransactionList } from "@/components/StrategyDetail/TransactionList";

const StrategyDetailContent = () => {
  const { strategyId } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Check if we're viewing a user strategy or a general strategy template
  const isUserStrategy = !!searchParams.get("planId") || searchParams.get("source") === "dashboard";

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
      } = await api.strategies.getDetails(strategyId as string);
      return data;
    },
    enabled: !!strategyId,
  });

  useEffect(() => {
    if (!isLoading && !userStrategy) {
      router.push("/app/strategies");
    }
  }, [isLoading, router, strategyId, userStrategy]);

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
        <StrategyOverview />
        <StrategyDetails />
      </div>

      <TransactionList />
    </AppLayout>
  );
};

const StrategyDetail = () => {
  return (
    <Suspense fallback={
      <AppLayout>
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </AppLayout>
    }>
      <StrategyDetailContent />
    </Suspense>
  );
};

export default StrategyDetail;
