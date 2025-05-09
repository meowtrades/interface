export interface UserStrategy {
  id: string;
  strategyId: string;
  chainId: string;
  tokenId: string;
  startDate: string;
  _id: string;
  totalInvested: number;
  profit: number;
  profitPercentage: number;
  invested: number;
  initialAmount: number;
  frequency: string;
  amount: number;
  createdAt: string;
  active: boolean;
  currentValue: number;
  strategyTemplate?: {
    id: string;
    name: string;
    type: string;
  };
  token?: {
    symbol: string;
    name: string;
  };
}

export interface ChartData {
  waiting: boolean;
  data?: {
    date: string;
    value: number;
  }[];
} 