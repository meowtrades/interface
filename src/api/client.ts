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

export const api = {
  plans: {
    get: (id: string) =>
      axiosInstance.get<DcaPlan>(`/services/s-dca/plans/${id}`),
    getAll: () => axiosInstance.get<DcaPlan[]>(`/services/s-dca/plans`),
    create: (data: CreateDcaPlanDto) =>
      axiosInstance.post<DcaPlan>(`/services/s-dca/create-plan`, data),
    stop: (id: string) => axiosInstance.post(`/services/s-dca/stop-plan/${id}`),
    stopAll: (userId: string) =>
      axiosInstance.post(`/services/s-dca/stop-all-plans/${userId}`),
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
  transactions: {
    get: (id: string) => axiosInstance.get<Transaction>(`/transactions/${id}`),
    getAll: (planId: string) =>
      axiosInstance.get<Transaction[]>(`/transactions?planId=${planId}`),
    retry: (id: string) => axiosInstance.post(`/transactions/${id}/retry`),
  },
  balances: {
    get: (userId: string) =>
      axiosInstance.get<Record<string, number>>(`/user/balance/${userId}`),
    deposit: (data: DepositFundsDto) =>
      axiosInstance.post(`/user/balance/deposit`, data),
    withdraw: (data: WithdrawFundsDto) =>
      axiosInstance.post(`/user/balance/withdraw`, data),
    allocate: (data: AllocateFundsDto) =>
      axiosInstance.post(`/user/balance/allocate`, data),
  },
  analytics: {
    getUserPerformance: (
      userId: string,
      params: { timeframe: string; granularity: string }
    ) =>
      axiosInstance.get<PerformanceHistory>(
        `/user/analytics/performance/${userId}`,
        { params }
      ),
    getStrategyPerformance: (
      strategyId: string,
      params: { timeframe: string; granularity: string }
    ) =>
      axiosInstance.get<PerformanceHistory>(
        `/user/analytics/performance/strategy/${strategyId}`,
        { params }
      ),
    getPlatformStatistics: () =>
      axiosInstance.get<PlatformStatistics>(
        `/user/analytics/statistics/platform`
      ),
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
    getActivities: () => {
      return axiosInstance.get<{ data: Transaction[] }>(
        `/user/analytics/activities`
      );
    },
  },
  strategies: {
    getDetails: (strategyId: string) =>
      axiosInstance.get<{ data: UserStrategy }>(
        `/user/analytics/strategies/${strategyId}`
      ),
    getMockChartData: (strategyId: string) =>
      axiosInstance.get<{
        data: { timestamp: number; price: number }[];
        totalInvestment: number;
      }>(`/mocktrades/chart/${strategyId}`),
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
  admin: {
    getActivePlans: () => axiosInstance.get<DcaPlan[]>(`/admin/active-plans`),
    stopAllPlans: () => axiosInstance.post(`/admin/stop-all-plans`),
    allocateCredits: (data: {
      email: string;
      amount: string;
      tokenSymbol: string;
    }) => axiosInstance.post(`/user/balance/allocate/wallet/`, data),
  },
  user: {
    updateAddress: (newAddress: string) =>
      axiosInstance.patch(`/user/address`, { newAddress }),
  },
};
