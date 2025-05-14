/** @format */

import { Frequency, RiskLevel } from "@/lib/types";

export interface Transaction {
  _id: string;
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
}

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
  activeStrategies: {
    mock: number;
    real: number;
    total: number;
  };
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

/**
 * active
: 
true
amount
: 
1000
analytics
: 
averageBuyPrice
: 
0
currentTokenPrice
: 
0.999942
portfolioValue
: 
0
profit
: 
0
profitPercentage
: 
null
tokensHeld
: 
0
totalTransactions
: 
0
[[Prototype]]
: 
Object
chain
: 
"injective"
createdAt
: 
"2025-05-13T19:13:48.557Z"
currentValue
: 
0
frequency
: 
"test_minute"
initialAmount
: 
1000
invested
: 
1000
profit
: 
0
profitPercentage
: 
null
strategyTemplate
: 
{id: 'SDCA', name: 'Smart Dollar Cost Averaging', type: 'dca', description: 'DCA reduces the impact of volatility by investing … at regular intervals, regardless of asset price.'}
token
: 
{symbol: 'USDT', name: 'Tether', currentPrice: 0.999942}
totalInvested
: 
0
_id
: 
"682399ec7f41b4978187af43"
 */
export type ActiveStrategyAnalytics = {
  chain: string;
  _id: string;
  currentValue: number;
  token: {
    symbol: string;
    name: string;
    currentPrice: number;
  };
  strategyTemplate: {
    id: string;
    name: string;
    type: string;
    description: string;
  };
  totalInvested: number;
  invested: number;
  profit: number;
  profitPercentage: number;
  initialAmount: number;
  frequency: string;
  amount: number;
  createdAt: string;
  active: boolean;
  analytics: {
    tokensHeld: number;
    averageBuyPrice: number;
    currentTokenPrice: number;
    portfolioValue: number;
    profit: number;
    profitPercentage: number;
    totalTransactions: number;
  };
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
