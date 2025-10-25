/** @format */

// Types for the modular strategy architecture

export type Chain = {
  id: string;
  name: string;
  icon?: string;
  isTestnet?: boolean;
};

export type Token = {
  id: string;
  symbol: string;
  name: string;
  icon?: string;
  chains: string[]; // chain ids that support this token
  decimals: number;
};

export type StrategyType = "dca" | "grid" | "momentum" | "custom";

export type StrategyPerformance = {
  Y?: number;
  sixMonths?: number;
  threeMonths?: number;
  month?: number;
  week?: number;
  day?: number;
};

export type Strategy = {
  id: string;
  name: string;
  description: string;
  type: StrategyType;
  icon?: string;
  features: string[];
  supportedChains: string[]; // chain ids
  supportedTokens: string[]; // token ids
  performance?: Record<string, StrategyPerformance>; // token id -> performance
  minInvestment?: Record<string, number>; // chain id -> min investment
  riskLevel: "low" | "medium" | "high";
  active?: boolean;
};

export type UserWallet = {
  chainId: string;
  tokenId: string;
  balance: number;
  usdValue: number;
  address: string;
};

export type UserStrategy = {
  id: string;
  strategyId: string;
  chainId: string;
  tokenId: string;
  invested: number;
  currentValue: number;
  profit: number;
  profitPercentage: number;
  startDate: string;
  lastExecuted?: string;
  active: boolean;
};

export enum Frequency {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
}

export enum RiskLevel {
  NO_RISK = "no_risk",
  LOW_RISK = "low_risk",
  MEDIUM_RISK = "medium_risk",
  HIGH_RISK = "high_risk",
}

export const FREQUENCY_RANGE_MAP: Record<
  Frequency,
  { label: string; value: string }[]
> = {
  [Frequency.DAILY]: [
    { label: "7D", value: "7d" },
    { label: "14D", value: "14d" },
    { label: "30D", value: "30d" },
    { label: "90D", value: "90d" },
  ],
  [Frequency.WEEKLY]: [
    { label: "1M", value: "1M" },
    { label: "3M", value: "3M" },
    { label: "6M", value: "6M" },
    { label: "1Y", value: "1y" },
  ],
  [Frequency.MONTHLY]: [
    { label: "6M", value: "6M" },
    { label: "1Y", value: "1y" },
    { label: "2Y", value: "2y" },
    { label: "5Y", value: "5y" },
  ],
};
