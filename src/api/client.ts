/** @format */

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
  },
  strategies: {
    getDetails: (strategyId: string) =>
      axiosInstance.get<{ data: { frequency: string } }>(
        `/user/analytics/strategies/${strategyId}`
      ),
    getChartData: (strategyId: string) =>
      axiosInstance.get<{
        totalInvestment: number;
        data: { timestamp: number; price: number }[];
      }>(`/mocktrades/chart/${strategyId}`),
    getTransactions: (
      strategyId: string,
      params: { page: number; limit: number }
    ) =>
      axiosInstance.get<{
        data: Transaction[];
        pagination: { totalPages: number };
      }>(`/user/analytics/strategies/${strategyId}/transactions`, { params }),
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
};
