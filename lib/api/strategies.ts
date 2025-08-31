/** @format */

import { axiosInstance } from "@/api";
import { Chain, Strategy, Token, UserStrategy } from "../types";
import { UserStrategyNew } from "../context/StrategiesContext";

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
];

const strategies: Strategy[] = [
  {
    id: "SDCA",
    name: "Smart DCA Strategy",
    description: "Dollar-cost averaging enhanced by market timing algorithms",
    type: "dca",
    icon: "RefreshCw",
    features: [
      "Automated investments at regular intervals",
      "AI-driven market timing optimization",
      "Buy more when prices dip, less when they rise",
    ],
    supportedChains: ["injective", "injective-evm"],
    supportedTokens: ["inj"],
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
    name: "Grid Trading Strategy",
    description: "Automated buy-low, sell-high across a price range",
    type: "grid",
    icon: "Grid",
    features: [
      "Buy at lower grid levels, sell at higher levels",
      "Works well in ranging (sideways) markets",
      "Captures small price movements repeatedly",
    ],
    supportedChains: ["injective", "injective-evm"],
    supportedTokens: ["inj"],
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

const userStrategiesNew: UserStrategyNew[] = [
  {
    _id: "user-strategy-1",
    totalInvested: 500,
    strategyId: "SDCA",
    chainId: "injective",
    tokenId: "inj",
    invested: 450,
    initialAmount: 100,
    frequency: "daily",
    amount: 50,
    createdAt: "2023-11-15T00:00:00Z",
    active: true,
  },
  {
    _id: "user-strategy-2",
    totalInvested: 300,
    strategyId: "GRID",
    chainId: "injective",
    tokenId: "inj",
    invested: 275,
    initialAmount: 50,
    frequency: "weekly",
    amount: 25,
    createdAt: "2023-11-20T00:00:00Z",
    active: true,
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
    tokenId: "inj",
    invested: 200,
    currentValue: 230,
    profit: 30,
    profitPercentage: 15,
    startDate: "2023-10-20T00:00:00Z",
    lastExecuted: "2023-12-02T00:00:00Z",
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

export const fetchUserStrategies = async (): Promise<UserStrategyNew[]> => {
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
