/** @format */

export type CreateDcaPlanDto = {
  userId: string;
  amount: number;
  userWalletAddress: string;
  frequency: "hourly" | "daily" | "weekly" | "monthly" | "test_minute";
  chain: string;
  riskLevel: string;
};

export type DcaPlan = {
  id: string;
  amount: number;
  frequency: string;
  userWalletAddress: string;
  chain: string;
  riskLevel: string;
  totalInvested: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Transaction = {
  id: string;
  planId: string;
  userId: string;
  chain: string;
  amount: number;
  status: string;
  retryCount: number;
  maxRetries: number;
  lastAttemptTime: string;
  createdAt: string;
  updatedAt: string;
};

export type DepositFundsDto = {
  chainId: string;
  tokenAddress: string;
  amount: string;
  txHash: string;
};

export type WithdrawFundsDto = {
  chainId: string;
  tokenAddress: string;
  amount: string;
  destinationAddress: string;
};

export type AllocateFundsDto = {
  strategyId: string;
  chainId: number;
  tokenAddress: string;
  amount: string;
};

export type PerformanceHistory = {
  data: Array<{
    timestamp: string;
    value: number;
    percentChange?: number;
  }>;
  timeframe: "7d" | "30d" | "90d" | "1y";
  granularity: "hourly" | "daily" | "weekly" | "monthly";
};

export type PlatformStatistics = {
  totalUsers: number;
  totalActivePlans: number;
  totalLockedValue: number;
  systemStatus: {
    healthy: boolean;
    issues?: string[];
  };
};
