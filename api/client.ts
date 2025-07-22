/** @format */

import { UserStrategy } from "@/components/StrategyDetail/types";
import axiosInstance from "./interceptors/axiosInterceptor";
import {
  CreateDcaPlanDto,
  DcaPlan,
  Transaction,
  DepositFundsDto,
  WithdrawFundsDto,
  AllocateFundsDto,
  PerformanceHistory,
  PlatformStatistics,
} from "./types/dtos";
import { ActiveStrategyAnalytics } from "./types";
import type { LeaderboardUser } from "@/components/LeaderboardTable";

export const api = {
  plans: {
    grid: {
      get: (id: string) =>
        axiosInstance.get<DcaPlan>(`/services/grid/plans/${id}`),
      getAll: () => axiosInstance.get<DcaPlan[]>(`/services/grid/plans`),
      create: (data: CreateDcaPlanDto) =>
        axiosInstance.post<DcaPlan>(`/services/grid/create-plan`, data),
      stop: (id: string) =>
        axiosInstance.post(`/services/grid/stop-plan/${id}`),
      stopAll: () => axiosInstance.post(`/services/grid/stop-all-plans`),
      pause: (planId: string) =>
        axiosInstance.post<{
          success: boolean;
          message: string;
          plan: DcaPlan;
        }>(`/services/grid/pause-plan/${planId}`),
      resume: (planId: string) =>
        axiosInstance.post<{
          success: boolean;
          message: string;
          plan: DcaPlan;
        }>(`/services/grid/resume-plan/${planId}`),
    },
    get: (id: string) =>
      axiosInstance.get<DcaPlan>(`/services/s-dca/plans/${id}`),
    getAll: () => axiosInstance.get<DcaPlan[]>(`/services/s-dca/plans`),
    create: (data: CreateDcaPlanDto) =>
      axiosInstance.post<DcaPlan>(`/services/s-dca/create-plan`, data),
    stop: (id: string) => axiosInstance.post(`/services/s-dca/stop-plan/${id}`),
    stopAll: () => axiosInstance.post(`/services/s-dca/stop-all-plans`),
    pause: (planId: string) =>
      axiosInstance.post<{
        success: boolean;
        message: string;
        plan: DcaPlan;
      }>(`/services/s-dca/pause-plan/${planId}`),
    resume: (planId: string) =>
      axiosInstance.post<{
        success: boolean;
        message: string;
        plan: DcaPlan;
      }>(`/services/s-dca/resume-plan/${planId}`),
  },
  balances: {
    get: () =>
      axiosInstance.get<{ balances: Record<string, Record<string, string>> }>(
        `/user/balance`
      ),
    getByChain: (chainId: string) =>
      axiosInstance.get<{ chainId: string; tokens: Record<string, string> }>(
        `/user/balance/${chainId}`
      ),
    getTokenBalance: (chainId: string, tokenSymbol: string) =>
      axiosInstance.get<{
        chainId: string;
        tokenSymbol: string;
        balance: string;
      }>(`/user/balance/${chainId}/token/${tokenSymbol}`),
    getChainTokens: (chainId: string) =>
      axiosInstance.get<{
        chainId: string;
        tokens: {
          symbol: string;
          name: string;
          decimals: number;
          isNative?: boolean;
          isStablecoin?: boolean;
          address: string;
        }[];
      }>(`/user/balance/${chainId}/tokens`),
    getAllTokens: () =>
      axiosInstance.get<
        Record<
          string,
          {
            symbol: string;
            name: string;
            decimals: number;
            isNative?: boolean;
            isStablecoin?: boolean;
            address: string;
          }[]
        >
      >(`/user/balance/tokens`),
    deposit: (data: DepositFundsDto) =>
      axiosInstance.post(`/user/balance/deposit`, data),
    withdraw: (data: WithdrawFundsDto) =>
      axiosInstance.post(`/user/balance/withdraw`, data),
    allocate: (data: AllocateFundsDto) =>
      axiosInstance.post(`/user/balance/allocate`, data),
  },
  analytics: {
    getUserPerformanceHistory: (params: {
      timeframe: string;
      granularity: string;
    }) =>
      axiosInstance.get<PerformanceHistory>(
        `/user/analytics/performance/history`,
        { params }
      ),
    getStrategyPerformanceHistory: (
      strategyId: string,
      params: { timeframe: string; granularity: string }
    ) =>
      axiosInstance.get<PerformanceHistory>(
        `/user/analytics/performance/strategy/${strategyId}`,
        { params }
      ),
    getUserStatistics: () =>
      axiosInstance.get(`/user/analytics/statistics/user`),
    getPlatformStatistics: () =>
      axiosInstance.get<PlatformStatistics>(
        `/user/analytics/statistics/platform`
      ),
    getUserOverview: () => axiosInstance.get(`/user/analytics/overview`),
    getUserActivities: () =>
      axiosInstance.get<{
        data: Transaction[];
      }>(`/user/analytics/activities`),
    getActiveStrategiesAnalytics: () =>
      axiosInstance.get<{
        data: {
          mock: ActiveStrategyAnalytics[];
          real: ActiveStrategyAnalytics[];
        };
      }>(`/user/analytics/strategies/active/analytics`),
    getActiveMockStrategies: () => {
      return axiosInstance.get<{
        data: ActiveStrategyAnalytics[];
      }>(`/user/analytics/strategies/active/mock`);
    },
    getActiveLiveStrategies: () => {
      return axiosInstance.get<{
        data: ActiveStrategyAnalytics[];
      }>(`/user/analytics/strategies/active/live`);
    },
  },
  strategies: {
    getDetails: (strategyId: string) =>
      axiosInstance.get<{ data: UserStrategy }>(
        `/user/analytics/strategies/${strategyId}`
      ),
    getChartData: (strategyId: string) =>
      axiosInstance.get<{
        data: { timestamp: number; price: number }[];
        totalInvestment: number;
      }>(`/user/analytics/strategies/chart/${strategyId}`),
    getTransactions: (
      strategyId: string,
      params: { page: number; limit: number }
    ) =>
      axiosInstance.get<{
        data: Transaction[];
        pagination: { totalPages: number };
      }>(`/user/analytics/strategies/${strategyId}/transactions`, { params }),
    getActive: async () =>
      (
        await axiosInstance.get<{ data: UserStrategy[] }>(
          `/user/analytics/strategies/active`
        )
      ).data.data,
    getActiveSeparated: async () =>
      (
        await axiosInstance.get<{
          data: {
            mockStrategies: UserStrategy[];
            realStrategies: UserStrategy[];
          };
        }>(`/user/analytics/strategies/active/separated`)
      ).data.data,
    getActiveAnalytics: async () =>
      (
        await axiosInstance.get<{ data: UserStrategy[] }>(
          `/user/analytics/strategies/active/analytics`
        )
      ).data.data,
  },
  available: {
    getStrategies: () =>
      axiosInstance.get<{
        message: string;
        strategies: {
          id: string;
          name: string;
          description: string;
          riskLevels: string[];
          supportedChains: string[];
        }[];
      }>(`/available/strategies`),
    getTokens: () =>
      axiosInstance.get<{
        message: string;
        tokens: {
          symbol: string;
          name: string;
          coingeckoId: string;
          supportedChains: string[];
          logo?: string;
        }[];
      }>(`/available/tokens`),
    getTrendingStrategy: () =>
      axiosInstance.get<{
        strategy: {
          id: string;
          name: string;
          trendingScore: number;
          activeUsers: number;
          avgReturn: string;
        };
      }>(`/available/strategies/trending`),
    getTokenPrice: (tokenId: string) =>
      axiosInstance.get<{
        tokenId: string;
        price: string;
        change24h: string;
        timestamp: string;
      }>(`/available/price/${tokenId}`),
  },
  admin: {
    getActivePlans: () =>
      axiosInstance.get<DcaPlan[]>(`/admin/active-plans`, {
        headers: { "X-Admin-Token": "14-E" },
      }),
    stopAllPlans: () =>
      axiosInstance.post(
        `/admin/stop-all-plans`,
        {},
        {
          headers: { "X-Admin-Token": "14-E" },
        }
      ),
    allocateCredits: (data: {
      email: string;
      chainId: string;
      amount: number;
      tokenSymbol: string;
    }) =>
      axiosInstance.post(`/user/balance/allocate/wallet`, data, {
        headers: { "X-Admin-Token": "14-E" },
      }),
  },
  user: {
    getCurrentUser: () => axiosInstance.get(`/user/me`),
    updateAddress: (address: string) =>
      axiosInstance.patch(`/user/address`, { address }),
    getUserTransactions: () => axiosInstance.get(`/user/transactions`),
    checkAdminStatus: () =>
      axiosInstance.get<{ isAdmin: boolean }>(`/user/is-admin`),
  },
  xp: {
    getUserXp: () => axiosInstance.get(`/xp`),
    leaderboard: () => axiosInstance.get<LeaderboardUser[]>("/xp/leaderboard"),
  },
};
