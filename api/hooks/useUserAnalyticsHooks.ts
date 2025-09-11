import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import {
  GranularityOption,
  TimeframeOption,
} from "@/api";

// Query keys for cache management
export const USER_ANALYTICS_KEYS = {
  all: ["user", "analytics"] as const,
  performance: {
    history: (timeframe?: TimeframeOption, granularity?: GranularityOption) =>
      [
        ...USER_ANALYTICS_KEYS.all,
        "performance",
        "history",
        timeframe,
        granularity,
      ] as const,
    strategy: (
      strategyId: string,
      timeframe?: TimeframeOption,
      granularity?: GranularityOption
    ) =>
      [
        ...USER_ANALYTICS_KEYS.all,
        "performance",
        "strategy",
        strategyId,
        timeframe,
        granularity,
      ] as const,
  },
  statistics: {
    user: () => [...USER_ANALYTICS_KEYS.all, "statistics", "user"] as const,
    platform: () =>
      [...USER_ANALYTICS_KEYS.all, "statistics", "platform"] as const,
  },
  overview: () => [...USER_ANALYTICS_KEYS.all, "overview"] as const,
  activities: () => [...USER_ANALYTICS_KEYS.all, "activities"] as const,
};









/**
 * Get user overview analytics
 */
export const useUserOverview = () => {
  return useQuery({
    queryKey: USER_ANALYTICS_KEYS.overview(),
    queryFn: async () => {
      const response = await api.analytics.getUserOverview();
      // Ensure we return the payload, not the envelope
      return (response.data as any)?.data ?? response.data;
    },
    // Poll periodically so dashboard updates without manual refresh
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
  });
};


