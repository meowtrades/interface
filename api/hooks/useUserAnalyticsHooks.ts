import { useQuery } from "@tanstack/react-query";
import { api } from "../client";
import {
  GranularityOption,
  TimeframeOption,
} from "../types";

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
 * Get user's performance history
 */
export const useUserPerformanceHistory = (
  timeframe: TimeframeOption = "30d",
  granularity: GranularityOption = "daily"
) => {
  return useQuery({
    queryKey: USER_ANALYTICS_KEYS.performance.history(timeframe, granularity),
    queryFn: async () => {
      const response = await api.analytics.getUserPerformanceHistory({
        timeframe,
        granularity,
      });
      return response.data;
    },
  });
};

/**
 * Get performance history for a specific strategy
 */
export const useStrategyPerformanceHistory = (
  strategyId: string,
  timeframe: TimeframeOption = "30d",
  granularity: GranularityOption = "daily"
) => {
  return useQuery({
    queryKey: USER_ANALYTICS_KEYS.performance.strategy(
      strategyId,
      timeframe,
      granularity
    ),
    queryFn: async () => {
      const response = await api.analytics.getStrategyPerformanceHistory(
        strategyId,
        {
          timeframe,
          granularity,
        }
      );
      return response.data;
    },
    enabled: !!strategyId,
  });
};

/**
 * Get user statistics
 */
export const useUserStatistics = () => {
  return useQuery({
    queryKey: USER_ANALYTICS_KEYS.statistics.user(),
    queryFn: async () => {
      const response = await api.analytics.getUserStatistics();
      return response.data;
    },
  });
};

/**
 * Get platform-wide statistics
 */
export const usePlatformStatistics = () => {
  return useQuery({
    queryKey: USER_ANALYTICS_KEYS.statistics.platform(),
    queryFn: async () => {
      const response = await api.analytics.getPlatformStatistics();
      return response.data;
    },
  });
};

/**
 * Get user overview analytics
 */
export const useUserOverview = () => {
  return useQuery({
    queryKey: USER_ANALYTICS_KEYS.overview(),
    queryFn: async () => {
      const response = await api.analytics.getUserOverview();
      return response.data;
    },
  });
};

/**
 * Get user activities
 */
export const useUserActivities = () => {
  return useQuery({
    queryKey: USER_ANALYTICS_KEYS.activities(),
    queryFn: async () => {
      const response = await api.analytics.getUserActivities();
      return response.data.activities;
    },
  });
};
