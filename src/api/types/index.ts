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
  totalProfit: number;
  totalFees: number;
  activePlans: number;
  completedPlans: number;
  successRate: number;
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
export type FrequencyOption = "hourly" | "daily" | "weekly" | "monthly";
export type ThresholdComparison = "lessThan" | "greaterThan" | "equals";

export type DcaPlanCustomSettings = {
  priceThreshold?: string;
  thresholdComparison?: ThresholdComparison;
  maxSlippage?: number;
  gasLimit?: string;
};

export type CreateDcaPlanDto = {
  userId: string;
  targetToken: string;
  sourceToken: string;
  amount: string;
  frequency: FrequencyOption;
  duration: number;
  chainId: number;
  customSettings?: DcaPlanCustomSettings;
};

export type DcaPlan = {
  id: string;
  userId: string;
  targetToken: Token;
  sourceToken: Token;
  amount: string;
  frequency: FrequencyOption;
  duration: number;
  chainId: number;
  customSettings?: DcaPlanCustomSettings;
  status: "active" | "completed" | "stopped";
  createdAt: string;
  updatedAt: string;
  nextExecutionTime?: string;
  executionHistory: {
    timestamp: string;
    sourceAmount: string;
    targetAmount: string;
    price: string;
    txHash: string;
  }[];
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

export type CreateMockTradeDto = {
  pair: string;
  entryPrice: number;
  amount: number;
  direction: Direction;
  leverage: number;
  stopLoss?: number;
  takeProfit?: number;
  tags?: string[];
  notes?: string;
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
