/** @format */

import { axiosInstance } from "@/api";
import { Chain, Strategy, Token, UserStrategy } from "../types";
import type { ActiveStrategyAnalytics } from "@/api/types";

// Mock data for development
// In a real app, these would be API calls to the backend

const chains: Chain[] = [
  {
    id: "injective",
    name: "Injective",
    icon: "/icons/injective.svg",
  },
  {
    id: "injective-evm",
    name: "Injective EVM",
    icon: "/icons/injective.svg",
  },
];

const tokens: Token[] = [
  {
    id: "inj",
    symbol: "INJ",
    name: "Injective",
    icon: "/icons/injective.svg",
    chains: ["injective", "injective-evm"],
    decimals: 18,
  },
  {
    id: "btc",
    symbol: "BTC",
    name: "Bitcoin",
    icon: "/icons/bitcoin.svg",
    chains: ["injective", "injective-evm"],
    decimals: 8,
  },
  {
    id: "eth",
    symbol: "ETH",
    name: "Ethereum",
    icon: "/icons/ethereum.svg",
    chains: ["injective", "injective-evm"],
    decimals: 18,
  },
  {
    id: "usdc",
    symbol: "USDC",
    name: "USD Coin",
    icon: "/icons/usdc.svg",
    chains: ["injective", "injective-evm"],
    decimals: 6,
  },
  {
    id: "apt",
    symbol: "APT",
    name: "Aptos",
    icon: "/icons/aptos.svg",
    chains: ["injective", "injective-evm"],
    decimals: 8,
  },
  {
    id: "sonic",
    symbol: "SONIC",
    name: "Sonic",
    icon: "/icons/sonic.svg",
    chains: ["injective", "injective-evm"],
    decimals: 9,
  },
];

const strategies: Strategy[] = [
  {
    id: "SDCA",
    name: "Smart DCA Agent",
    description: "Dollar-cost averaging enhanced by market timing algorithms",
    type: "dca",
    icon: "RefreshCw",
    features: [
      "Automated investments at regular intervals",
      "AI-driven market timing optimization",
      "Buy more when prices dip, less when they rise",
    ],
    supportedChains: ["injective", "injective-evm"],
    supportedTokens: ["inj", "btc", "eth", "usdc", "apt", "sonic"],
    performance: {
      inj: {
        sixMonths: 18.3,
        threeMonths: 12.1,
        month: 5.4,
        week: 2.1,
      },
      usdt: {
        sixMonths: 5.7,
        threeMonths: 2.8,
        month: 1.2,
        week: 0.3,
      },
    },
    minInvestment: {
      injective: 10,
    },
    riskLevel: "low",
  },
  {
    id: "GRID",
    name: "Grid Trading Agent",
    description: "Automated buy-low, sell-high across a price range",
    type: "grid",
    icon: "Grid",
    features: [
      "Buy at lower grid levels, sell at higher levels",
      "Works well in ranging (sideways) markets",
      "Captures small price movements repeatedly",
    ],
    supportedChains: ["injective", "injective-evm"],
    supportedTokens: ["inj", "btc", "eth", "usdc", "apt", "sonic"],
    performance: {
      inj: {
        sixMonths: 14.5,
        threeMonths: 8.9,
        month: 3.7,
        week: 1.5,
      },
    },
    minInvestment: {
      injective: 20,
      "injective-evm": 20,
    },
    riskLevel: "medium",
  },
  // {
  //   id: 'momentum',
  //   name: 'Momentum Strategy',
  //   description: 'Follow market trends and optimize entry/exit timing',
  //   type: 'momentum',
  //   icon: 'TrendingUp',
  //   features: [
  //     'Follows market momentum and trends',
  //     'Technical analysis based entry and exit',
  //     'Aims to capture larger market movements'
  //   ],
  //   supportedChains: ['injective'],
  //   supportedTokens: ['inj', 'usdt'],
  //   performance: {
  //     'inj': {
  //       year: 38.2,
  //       sixMonths: 20.5,
  //       threeMonths: 10.8,
  //       month: 6.3,
  //       week: 2.5
  //     },
  //     'usdt': {
  //       year: 12.6,
  //       sixMonths: 7.9,
  //       threeMonths: 3.5,
  //       month: 1.8,
  //       week: 0.5
  //     }
  //   },
  //   minInvestment: {
  //     'injective': 15
  //   },
  //   riskLevel: 'high'
  // }
];

const userStrategiesNew: ActiveStrategyAnalytics[] = [
  {
    _id: "user-strategy-1",
    chain: "injective",
    currentValue: 500,
    token: { symbol: "inj", name: "Injective", currentPrice: 1 },
    strategyTemplate: {
      id: "SDCA",
      name: "Smart DCA Strategy",
      type: "dca",
      description: "",
    },
    totalInvested: 500,
    invested: 450,
    profit: 50,
    profitPercentage: 10,
    initialAmount: 100,
    frequency: "daily",
    amount: 50,
    createdAt: "2023-11-15T00:00:00Z",
    active: true,
    analytics: {
      tokensHeld: 0,
      averageBuyPrice: 0,
      currentTokenPrice: 0,
      portfolioValue: 0,
      profit: 0,
      profitPercentage: 0,
      totalTransactions: 0,
    },
  },
  {
    _id: "user-strategy-2",
    chain: "injective",
    currentValue: 300,
    token: { symbol: "btc", name: "Bitcoin", currentPrice: 1 },
    strategyTemplate: {
      id: "GRID",
      name: "Grid Trading Strategy",
      type: "grid",
      description: "",
    },
    totalInvested: 300,
    invested: 275,
    profit: 25,
    profitPercentage: 8.33,
    initialAmount: 50,
    frequency: "weekly",
    amount: 25,
    createdAt: "2023-11-20T00:00:00Z",
    active: true,
    analytics: {
      tokensHeld: 0,
      averageBuyPrice: 0,
      currentTokenPrice: 0,
      portfolioValue: 0,
      profit: 0,
      profitPercentage: 0,
      totalTransactions: 0,
    },
  },
  {
    _id: "user-strategy-3",
    chain: "injective",
    currentValue: 200,
    token: { symbol: "eth", name: "Ethereum", currentPrice: 1 },
    strategyTemplate: {
      id: "SDCA",
      name: "Smart DCA Strategy",
      type: "dca",
      description: "",
    },
    totalInvested: 200,
    invested: 180,
    profit: 20,
    profitPercentage: 10,
    initialAmount: 40,
    frequency: "daily",
    amount: 20,
    createdAt: "2023-11-25T00:00:00Z",
    active: true,
    analytics: {
      tokensHeld: 0,
      averageBuyPrice: 0,
      currentTokenPrice: 0,
      portfolioValue: 0,
      profit: 0,
      profitPercentage: 0,
      totalTransactions: 0,
    },
  },
  {
    _id: "user-strategy-4",
    chain: "injective",
    currentValue: 150,
    token: { symbol: "usdc", name: "USD Coin", currentPrice: 1 },
    strategyTemplate: {
      id: "GRID",
      name: "Grid Trading Strategy",
      type: "grid",
      description: "",
    },
    totalInvested: 150,
    invested: 140,
    profit: 10,
    profitPercentage: 6.67,
    initialAmount: 30,
    frequency: "weekly",
    amount: 10,
    createdAt: "2023-11-28T00:00:00Z",
    active: true,
    analytics: {
      tokensHeld: 0,
      averageBuyPrice: 0,
      currentTokenPrice: 0,
      portfolioValue: 0,
      profit: 0,
      profitPercentage: 0,
      totalTransactions: 0,
    },
  },
  {
    _id: "user-strategy-5",
    chain: "injective",
    currentValue: 120,
    token: { symbol: "apt", name: "Aptos", currentPrice: 1 },
    strategyTemplate: {
      id: "SDCA",
      name: "Smart DCA Strategy",
      type: "dca",
      description: "",
    },
    totalInvested: 120,
    invested: 110,
    profit: 10,
    profitPercentage: 8.33,
    initialAmount: 20,
    frequency: "daily",
    amount: 10,
    createdAt: "2023-12-01T00:00:00Z",
    active: true,
    analytics: {
      tokensHeld: 0,
      averageBuyPrice: 0,
      currentTokenPrice: 0,
      portfolioValue: 0,
      profit: 0,
      profitPercentage: 0,
      totalTransactions: 0,
    },
  },
  {
    _id: "user-strategy-6",
    chain: "injective",
    currentValue: 100,
    token: { symbol: "sonic", name: "Sonic", currentPrice: 1 },
    strategyTemplate: {
      id: "GRID",
      name: "Grid Trading Strategy",
      type: "grid",
      description: "",
    },
    totalInvested: 100,
    invested: 90,
    profit: 10,
    profitPercentage: 10,
    initialAmount: 15,
    frequency: "weekly",
    amount: 5,
    createdAt: "2023-12-03T00:00:00Z",
    active: true,
    analytics: {
      tokensHeld: 0,
      averageBuyPrice: 0,
      currentTokenPrice: 0,
      portfolioValue: 0,
      profit: 0,
      profitPercentage: 0,
      totalTransactions: 0,
    },
  },
];

// Keep original userStrategies for other functions
const userStrategies: UserStrategy[] = [
  {
    id: "user-strategy-1",
    strategyId: "smart-dca",
    chainId: "injective",
    tokenId: "inj",
    invested: 100,
    currentValue: 112,
    profit: 12,
    profitPercentage: 12,
    startDate: "2023-11-15T00:00:00Z",
    lastExecuted: "2023-12-01T00:00:00Z",
    active: true,
  },
  {
    id: "user-strategy-2",
    strategyId: "grid-trading",
    chainId: "injective",
    tokenId: "btc",
    invested: 200,
    currentValue: 230,
    profit: 30,
    profitPercentage: 15,
    startDate: "2023-10-20T00:00:00Z",
    lastExecuted: "2023-12-02T00:00:00Z",
    active: true,
  },
  {
    id: "user-strategy-3",
    strategyId: "smart-dca",
    chainId: "injective",
    tokenId: "eth",
    invested: 150,
    currentValue: 160,
    profit: 10,
    profitPercentage: 6.7,
    startDate: "2023-11-10T00:00:00Z",
    lastExecuted: "2023-12-03T00:00:00Z",
    active: true,
  },
  {
    id: "user-strategy-4",
    strategyId: "grid-trading",
    chainId: "injective",
    tokenId: "usdc",
    invested: 120,
    currentValue: 125,
    profit: 5,
    profitPercentage: 4.2,
    startDate: "2023-11-18T00:00:00Z",
    lastExecuted: "2023-12-04T00:00:00Z",
    active: true,
  },
  {
    id: "user-strategy-5",
    strategyId: "smart-dca",
    chainId: "injective",
    tokenId: "apt",
    invested: 80,
    currentValue: 85,
    profit: 5,
    profitPercentage: 6.25,
    startDate: "2023-11-22T00:00:00Z",
    lastExecuted: "2023-12-05T00:00:00Z",
    active: true,
  },
  {
    id: "user-strategy-6",
    strategyId: "grid-trading",
    chainId: "injective",
    tokenId: "sonic",
    invested: 60,
    currentValue: 65,
    profit: 5,
    profitPercentage: 8.3,
    startDate: "2023-11-25T00:00:00Z",
    lastExecuted: "2023-12-06T00:00:00Z",
    active: true,
  },
];

// Simulate API calls with promises
export const fetchChains = async (): Promise<Chain[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));
  return chains;
};

export const fetchTokens = async (): Promise<Token[]> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return tokens;
};

export const fetchStrategies = async (): Promise<Strategy[]> => {
  return strategies;
};

export const fetchUserStrategies = async (): Promise<
  ActiveStrategyAnalytics[]
> => {
  const response = await axiosInstance.get("/user/analytics/strategies");
  return response.data.data;
};

// Additional API functions for a real implementation
export const startStrategy = async (
  strategyId: string,
  chainId: string,
  tokenId: string,
  amount: number
): Promise<UserStrategy> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In a real app, this would call the backend API
  const newStrategy: UserStrategy = {
    id: `user-strategy-${Date.now()}`,
    strategyId,
    chainId,
    tokenId,
    invested: amount,
    currentValue: amount,
    profit: 0,
    profitPercentage: 0,
    startDate: new Date().toISOString(),
    active: true,
  };

  // In a real app, this would be stored in the backend
  userStrategies.push(newStrategy);

  return newStrategy;
};

export const stopStrategy = async (
  userStrategyId: string
): Promise<boolean> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In a real app, this would call the backend API
  const index = userStrategies.findIndex((us) => us.id === userStrategyId);
  if (index >= 0) {
    userStrategies[index].active = false;
    return true;
  }

  return false;
};
