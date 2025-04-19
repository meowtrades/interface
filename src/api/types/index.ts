/** @format */

import { RiskLevel } from "@/components/StartStrategyDialog";
import { Frequency } from "@/lib/types";

// Common types
export type Pagination = {
  page: number;
  limit: number;
  total: number;
};

// User types
export type User = {
  id: string;
  address: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateUpdateUserDto = {
  address: string;
  email?: string;
  name?: string;
};

// User Analytics types
export type TimeframeOption = "7d" | "30d" | "90d" | "1y";
export type GranularityOption = "hourly" | "daily" | "weekly" | "monthly";

export type GenericResponse<T> = {
  data: T;
  message: string;
  success: boolean;
};

export type PerformanceDataPoint = {
  timestamp: string;
  value: number;
  percentChange?: number;
};

export type PerformanceHistory = {
  data: PerformanceDataPoint[];
  timeframe: TimeframeOption;
  granularity: GranularityOption;
};

export type UserStatistics = {
  activeTrades: number;
  bestPerformingStrategy: string | null;
  completedTrades: number;
  mostTradedToken: string | null;
  profitLossPercentage: number;
  totalCurrentValue: number;
  totalInvestment: number;
  totalProfitLoss: number;
  worstPerformingStrategy: string | null;
};

export type PlatformStatistics = {
  totalUsers: number;
  totalVolume: number;
  avgUserProfit: number;
  topStrategies: {
    id: string;
    name: string;
    performance: number;
  }[];
};

// User Balance types
export type Token = {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  balance?: string;
  balanceUsd?: number;
};

export type ChainToken = {
  chainId: string;
  tokenSymbol: string;
  tokenName: string;
  chainName: string;
  balance: string;
  usdValue: string;
  lastUpdated: string;
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

// Smart DCA types
export type FrequencyOption =
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "test_minute";
export type ThresholdComparison = "lessThan" | "greaterThan" | "equals";

export type DcaPlanCustomSettings = {
  priceThreshold?: string;
  thresholdComparison?: ThresholdComparison;
  maxSlippage?: number;
  gasLimit?: string;
};

export type CreateDcaPlanDto = {
  userId: string;
  amount: number;
  userWalletAddress: string;
  frequency: FrequencyOption;
  chain: string;
  riskLevel: string;
};

export type DcaPlan = {
  amount: number;
  chain: string;
  createdAt: string;
  executionCount: number;
  frequency: FrequencyOption;
  initialAmount: number;
  isActive: boolean;
  lastExecutionTime: string | null;
  riskLevel: string;
  totalInvested: number;
  updatedAt: string;
  userId: string;
  userWalletAddress: string;
  __v: number;
  _id: string;
};

export type DcaPosition = {
  token: Token;
  amount: string;
  amountUsd: number;
  averageEntryPrice: string;
  currentPrice: string;
  profit: number;
  profitPercentage: number;
};

export type TotalInvestment = {
  totalInvested: number;
  totalValue: number;
  profit: number;
  profitPercentage: number;
};

// Mock Trading types
export type Direction = "long" | "short";

// export type CreateMockTradeDto = {
//   strategyId: string;
//   tokenSymbol: string;
//   initialInvestment: number;
//   riskLevel: string;
//   // timeframe: string;
// };

export type CreateMockTradeDto = {
  strategyId: string;
  tokenSymbol: string;
  amount: number;
  riskLevel: RiskLevel;
  frequency: Frequency;
};

export type StopMockTradeDto = {
  exitPrice: number;
  exitReason?: string;
  notes?: string;
};

export type MockTrade = {
  id: string;
  userId: string;
  pair: string;
  entryPrice: number;
  exitPrice?: number;
  amount: number;
  direction: Direction;
  leverage: number;
  stopLoss?: number;
  takeProfit?: number;
  tags: string[];
  notes: string;
  status: "active" | "closed";
  pnl?: number;
  pnlPercentage?: number;
  entryTime: string;
  exitTime?: string;
  exitReason?: string;
  history: {
    timestamp: string;
    price: number;
    pnl: number;
    pnlPercentage: number;
  }[];
};

// Admin types
export type AdminStats = {
  totalActivePlans: number;
  totalUsers: number;
  totalLockedValue: number;
  systemStatus: {
    healthy: boolean;
    issues?: string[];
  };
};
