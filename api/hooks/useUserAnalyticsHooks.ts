import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../interceptors/axiosInterceptor";
import {
  GenericResponse,
  GranularityOption,
  PerformanceHistory,
  PlatformStatistics,
  TimeframeOption,
  UserStatistics,
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
};

// Commented out unused analytics hooks - uncomment if needed
/**
 * Get user's performance history
 */
// export const useUserPerformanceHistory = (
//   timeframe: TimeframeOption = "30d",
//   granularity: GranularityOption = "daily"
// ) => {
//   return useQuery({
//     queryKey: USER_ANALYTICS_KEYS.performance.history(timeframe, granularity),
//     queryFn: async () => {
//       const response = await axiosInstance.get<PerformanceHistory>(
//         `/user/analytics/performance/history`,
//         {
//           params: {
//             timeframe,
//             granularity,
//           },
//         }
//       );
//       return response.data;
//     },
//   });
// };

/**
 * Get performance history for a specific strategy
 */
// export const useStrategyPerformanceHistory = (
//   strategyId: string,
//   timeframe: TimeframeOption = "30d",
//   granularity: GranularityOption = "daily"
// ) => {
//   return useQuery({
//     queryKey: USER_ANALYTICS_KEYS.performance.strategy(
//       strategyId,
//       timeframe,
//       granularity
//     ),
//     queryFn: async () => {
//       const response = await axiosInstance.get<PerformanceHistory>(
//         `/user/analytics/performance/strategy/${strategyId}`,
//         {
//           params: {
//             timeframe,
//             granularity,
//           },
//         }
//       );
//       return response.data;
//     },
//     enabled: !!strategyId,
//   });
// };

/**
 * Get user statistics
 */
// export const useUserStatistics = () => {
//   return useQuery({
//     queryKey: USER_ANALYTICS_KEYS.statistics.user(),
//     queryFn: async () => {
//       const response = await axiosInstance.get<GenericResponse<UserStatistics>>(
//         "/user/analytics/statistics/user"
//       );
//       return response.data.data;
//     },
//   });
// };

/**
 * Get platform-wide statistics
 */
// export const usePlatformStatistics = () => {
//   return useQuery({
//     queryKey: USER_ANALYTICS_KEYS.statistics.platform(),
//     queryFn: async () => {
//       const response = await axiosInstance.get<PlatformStatistics>(
//         "/user/analytics/statistics/platform"
//       );
//       return response.data;
//     },
//   });
// };
