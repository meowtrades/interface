/** @format */

export type CreateDcaPlanDto = {
  amount: number;
  userWalletAddress: string;
  frequency: "daily" | "weekly" | "monthly" | "test_minute" | "test_10_seconds";
  tokenSymbol: string;
  strategyId: string;
  recipientAddress: string;
  chain: string;
  riskLevel: "no_risk" | "low_risk" | "medium_risk" | "high_risk";
  slippage: number;
};

export type DcaPlan = {
  id: string;
  amount: number;
  frequency: string;
  userWalletAddress: string;
  recipientAddress: string;
  tokenSymbol: string;
  strategyId: string;
  chain: string;
  riskLevel: "no_risk" | "low_risk" | "medium_risk" | "high_risk";
  slippage: number;
  totalInvested: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

// export type Transaction = {
//   id: string;
//   planId: string;
//   userId: string;
//   chain: string;
//   amount: number;
//   status: string;
//   retryCount: number;
//   maxRetries: number;
//   lastAttemptTime: string;
//   createdAt: string;
//   updatedAt: string;
//   type: string;
//   tokenSymbol: string;
//   price: number;
//   value: number;
// };

export type Transaction = {
  _id: string;
  type: string;
  from: {
    token: string;
    amount: number;
  };
  to: {
    token: string;
    amount: number;
  };
  price: number;
  value: number;
  invested: number;
  planId: string;
  userId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type DepositFundsDto = {
  chainId: string;
  amount: string;
  txHash: string;
  tokenSymbol: string;
};

export type WithdrawFundsDto = {
  chainId: string;
  amount: string;
  destinationAddress: string;
  tokenSymbol: string;
};

export type AllocateFundsDto = {
  strategyId: string;
  chainId: string;
  amount: string;
  tokenSymbol: string;
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
