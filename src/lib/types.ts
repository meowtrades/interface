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
  year?: number;
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
  TEST_MINUTE = "test_minute",
  TEST_10_SECONDS = "test_10_seconds",
}
