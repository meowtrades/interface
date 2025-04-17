/** @format */

import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Grid,
  Info,
  RefreshCcw,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { Separator } from "@/components/ui/separator";
import { useStrategies } from "@/lib/context/StrategiesContext";
import { Skeleton } from "@/components/ui/skeleton";
// import { UserStrategy } from "@/lib/types";
import { formatFrequency } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { axiosInstance } from "@/api";

// Mock price data that would come from an API in a real app
const generateMockPriceHistory = (
  days: number,
  startValue: number,
  trend: "up" | "down" | "sideways"
) => {
  const data = [];
  let value = startValue;

  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Generate some random price movement
    let change = 0;
    if (trend === "up") {
      change = (Math.random() * 5 - 1) / 100; // -1% to +4%
    } else if (trend === "down") {
      change = (Math.random() * 5 - 4) / 100; // -4% to +1%
    } else {
      change = (Math.random() * 4 - 2) / 100; // -2% to +2%
    }

    value = value * (1 + change);

    data.push({
      date: date.toISOString().split("T")[0],
      value: parseFloat(value.toFixed(2)),
      profit: parseFloat((value - startValue).toFixed(2)),
    });
  }
  return data;
};

// Mock transactions data
const generateMockTransactions = (
  days: number,
  token: string,
  strategyType: string
) => {
  const transactions = [];
  const now = new Date();

  const types = strategyType === "grid" ? ["Buy", "Sell"] : ["Buy"];

  for (
    let i = 0;
    i < Math.min(10, days);
    i += Math.floor(Math.random() * 5) + 1
  ) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const type = types[Math.floor(Math.random() * types.length)];
    const amount = (Math.random() * 0.1 + 0.001).toFixed(4);
    const price = (Math.random() * 100 + 10).toFixed(2);

    transactions.push({
      date: date.toISOString().split("T")[0],
      type,
      amount: `${amount} ${token}`,
      price: `$${price}`,
      value: `$${price}`,
    });
  }
  return transactions;
};

// Define types for our data
interface Transaction {
  date: string;
  type: string;
  amount: string;
  price: string;
  value: string;
}

interface PriceHistoryItem {
  date: string;
  value: number;
  profit: number;
}

interface UserStrategy {
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

const StrategyDetail = () => {
  const { strategyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // const { strategies, userStrategies, tokens, isLoading, error } =
  //   useStrategies();

  // const [strategry, setStrategry] = useState(null);

  const [timeframe, setTimeframe] = useState("all");
  const [priceHistory, setPriceHistory] = useState<PriceHistoryItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  // const [profit, setProfit] = useState(0);
  // const [currentValue, setCurrentValue] = useState(0);
  // const [userStrategy, setUserStrategy] = useState<UserStrategy | null>(null);

  // Check if we're viewing a user strategy or a general strategy template
  const isUserStrategy =
    location.state?.planId || location.state?.source === "dashboard";

  // Find the relevant strategy data
  // const userStrategy = userStrategies.find((us) => us._id === strategyId);
  // const strategyTemplate = strategies.find(
  //   (s) => s.id === (userStrategy?.strategyId || strategyId)
  // );

  // // Get token information
  // const token = tokens.find(
  //   (t) => t.id === (userStrategy?.tokenId || location.state?.token || "inj")
  // );

  // const currentValue = userStrategy.totalInvested + userStrategy.amount;
  // const profit = 0;
  // const currentValue = 0;
  // const profit = 50;

  const {
    data: userStrategy,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userStrategy", strategyId],
    queryFn: async () => {
      const url = `/user/analytics/strategies/${strategyId}`;
      console.log(url);
      const d = (await axiosInstance.get<{ data: UserStrategy }>(url)).data
        .data;

      console.log("strat:", d, strategyId);

      return d;
    },
  });

  useEffect(() => {
    if (!isLoading) {
      // If no strategy found, redirect
      // console.log(!userStrategies, !strategyTemplate, !isLoading);
      // console.log(
      //   "strat",
      //   userStrategies.find((us) => us.id === strategyId)
      // );
      if (
        !userStrategy
        // !userStrategies.find((us) => us._id === strategyId)
      ) {
        navigate("/app/strategies");
        return;
      }

      // Set current value and profit
      // if (userStrategy) {
      //   const currentValue = userStrategy.totalInvested + userStrategy.amount;
      //   setCurrentValue(currentValue);
      //   const profitPercentage = currentValue - userStrategy.initialAmount;
      //   setProfit(profitPercentage);
      // } else {
      //   setCurrentValue(0);
      //   setProfit(0);
      // }

      // console.log(userStrategies, strategyId);

      // Use fixed data to match the image
      const fixedPriceData = [
        { date: "2024-04-01", value: 600, profit: 0 },
        { date: "2024-04-15", value: 605, profit: 5 },
        { date: "2024-05-01", value: 615, profit: 15 },
        { date: "2024-05-15", value: 590, profit: -10 },
        { date: "2024-06-01", value: 610, profit: 10 },
        { date: "2024-06-15", value: 630, profit: 30 },
        { date: "2024-07-01", value: 640, profit: 40 },
        { date: "2024-07-15", value: 630, profit: 30 },
        { date: "2024-08-01", value: 640, profit: 40 },
        { date: "2024-08-15", value: 655, profit: 55 },
      ];

      setPriceHistory(fixedPriceData);

      // Generate mock transactions
      if (userStrategy) {
        const strategyType = userStrategy.strategyTemplate?.type || "dca";
        setTransactions(
          generateMockTransactions(
            120,
            userStrategy.token?.symbol || "INJ",
            strategyType
          )
        );
      } else if (userStrategy.strategyTemplate) {
        setTransactions(
          generateMockTransactions(
            120,
            userStrategy.token?.symbol || "INJ",
            userStrategy.strategyTemplate.type
          )
        );
      }
    }
  }, [isLoading, strategyId, userStrategy]);

  if (isLoading || !userStrategy) {
    return (
      <AppLayout>
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="p-4 bg-red-50 text-red-600 rounded-md">
          Error loading strategy data: {error.message}
        </div>
      </AppLayout>
    );
  }

  // Helper to format as currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  // Format dates for chart
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Filter data based on timeframe
  const getFilteredChartData = (selectedTimeframe: string) => {
    if (!priceHistory.length) return [];

    const data = [...priceHistory];

    if (selectedTimeframe === "7D" || selectedTimeframe === "week") {
      return data.slice(-7);
    } else if (selectedTimeframe === "1M" || selectedTimeframe === "month") {
      return data.slice(-30);
    } else if (
      selectedTimeframe === "3M" ||
      selectedTimeframe === "threeMonths"
    ) {
      return data.slice(-90);
    } else if (
      selectedTimeframe === "6M" ||
      selectedTimeframe === "sixMonths"
    ) {
      return data.slice(-180);
    } else if (selectedTimeframe === "1Y" || selectedTimeframe === "year") {
      return data.slice(-365);
    }

    return data;
  };

  const filteredChartData = getFilteredChartData(timeframe);

  // Determine if we're showing profit or loss
  // const isProfitable = userStrategy ?  >= 0 : true;

  // Get the proper icon based on strategy type
  const getStrategyIcon = () => {
    const type = userStrategy.strategyTemplate?.type || "dca";
    if (type === "grid") return <Grid size={18} />;
    if (type === "momentum") return <TrendingUp size={18} />;
    return <RefreshCw size={18} />;
  };

  // Get color scheme based on strategy type
  const getColorScheme = () => {
    const type = userStrategy.strategyTemplate?.type || "dca";
    if (type === "grid")
      return { bg: "bg-purple-100", text: "text-purple-600" };
    if (type === "momentum")
      return { bg: "bg-amber-100", text: "text-amber-600" };
    return { bg: "bg-blue-100", text: "text-blue-600" };
  };

  const colorScheme = getColorScheme();

  return (
    <AppLayout>
      <div className="mb-5 flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() =>
            navigate(isUserStrategy ? "/app/dashboard" : "/app/strategies")
          }
        >
          <ArrowLeft size={16} />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Your Strategy</h1>
      </div>

      {/* Strategy Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg p-5 shadow-sm lg:col-span-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <div
                className={`w-12 h-12 rounded-full ${colorScheme.bg} ${colorScheme.text} flex items-center justify-center`}
              >
                {getStrategyIcon()}
              </div>
              <div>
                <h2 className="text-lg font-semibold">
                  {userStrategy.token?.symbol || "BTC"}{" "}
                  {userStrategy.strategyTemplate?.name || "Strategy"}
                </h2>
                <div
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    userStrategy.strategyTemplate?.type === "grid"
                      ? "bg-purple-100 text-purple-800"
                      : userStrategy.strategyTemplate?.type === "momentum"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {userStrategy.strategyTemplate?.type === "grid"
                    ? "Grid Trading"
                    : userStrategy.strategyTemplate?.type === "momentum"
                    ? "Momentum"
                    : "Smart DCA"}
                </div>
              </div>
            </div>

            {userStrategy && (
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="gap-1">
                  <RefreshCcw size={14} />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Close Position
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-2 pt-4 px-5">
                <CardDescription>Current Value</CardDescription>
                <CardTitle className="text-xl">
                  {formatCurrency(userStrategy.currentValue)}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-2 pt-4 px-5">
                <CardDescription>Starting Value</CardDescription>
                <CardTitle className="text-xl">
                  {formatCurrency(userStrategy.initialAmount)}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-2 pt-4 px-5">
                <CardDescription>Profit/Loss</CardDescription>
                <CardTitle
                  className={`text-xl ${
                    userStrategy.currentValue > userStrategy.initialAmount
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {userStrategy.currentValue > userStrategy.initialAmount
                    ? "+"
                    : "-"}
                  {/* {formatCurrency(
                    Math.abs(
                      userStrategy
                        ? userStrategy.currentValue - userStrategy.invested
                        : 45.32
                    )
                  )} */}
                  {formatCurrency(userStrategy.profit)}
                  {/* FIXME: MISSING VALUE (  
                  {userStrategy
                    ? userStrategy.profitPercentage.toFixed(2)
                    : "7.55"}
                  %) */}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-lg">Performance</h3>
              <div className="flex gap-1 bg-slate-100 p-1 rounded-md">
                <Button
                  variant={timeframe === "week" ? "secondary" : "ghost"}
                  size="sm"
                  className="text-xs h-7 px-2"
                  onClick={() => setTimeframe("week")}
                >
                  7D
                </Button>
                <Button
                  variant={timeframe === "month" ? "secondary" : "ghost"}
                  size="sm"
                  className="text-xs h-7 px-2"
                  onClick={() => setTimeframe("month")}
                >
                  1M
                </Button>
                <Button
                  variant={timeframe === "threeMonths" ? "secondary" : "ghost"}
                  size="sm"
                  className="text-xs h-7 px-2"
                  onClick={() => setTimeframe("threeMonths")}
                >
                  3M
                </Button>
                <Button
                  variant={timeframe === "all" ? "secondary" : "ghost"}
                  size="sm"
                  className="text-xs h-7 px-2"
                  onClick={() => setTimeframe("all")}
                >
                  All
                </Button>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={filteredChartData}
                  margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                  />
                  <YAxis
                    tickFormatter={(value) => `$${value}`}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    width={60}
                  />
                  <Tooltip
                    formatter={(value) => [`$${value}`, "Value"]}
                    labelFormatter={(label) => formatDate(label)}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#2563EB"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-sm">
          <h3 className="font-medium text-lg mb-4">Strategy Details</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm text-slate-500 mb-2">Strategy Type</h4>
              <div className="flex items-center gap-2">
                {getStrategyIcon()}
                <span className="font-medium">
                  {userStrategy.strategyTemplate?.type === "grid"
                    ? "Grid Trading"
                    : userStrategy.strategyTemplate?.type === "momentum"
                    ? "Momentum Trading"
                    : "Smart Dollar Cost Averaging"}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-sm text-slate-500 mb-2">Asset</h4>
              <div className="flex items-center gap-2">
                {/* <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">{token?.symbol?.charAt(0) || 'B'}</span>
                </div> */}
                <span className="font-medium">
                  {userStrategy.token?.name || "Bitcoin"} (
                  {userStrategy.token?.symbol || "BTC"})
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-sm text-slate-500 mb-2">Network</h4>
              <span className="font-medium">Injective</span>
            </div>

            <div>
              <h4 className="text-sm text-slate-500 mb-2">Started On</h4>
              <span className="font-medium">
                {new Date(userStrategy.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })}
              </span>
            </div>

            <div>
              <h4 className="text-sm text-slate-500 mb-2">Strategy Settings</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Investment Duration:</span>
                  <span className="font-medium">
                    {formatFrequency(userStrategy.frequency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Investment Amount:</span>
                  <span className="font-medium">
                    ${userStrategy.totalInvested}
                  </span>
                </div>
              </div>
            </div>

            <Separator className="my-2" />

            <div>
              <h4 className="text-sm text-slate-500 mb-2">Description</h4>
              <p className="text-sm text-slate-700">
                {userStrategy.strategyTemplate?.type === "grid"
                  ? "Grid trading automatically places buy and sell orders at predetermined price levels, capturing profit from price oscillations."
                  : userStrategy.strategyTemplate?.type === "momentum"
                  ? "Momentum trading capitalizes on market trends by buying assets that have recently shown upward price movement."
                  : "DCA reduces the impact of volatility by investing fixed amounts at regular intervals, regardless of asset price."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <Card className="shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-4 px-5 font-medium text-slate-500">
                    Date
                  </th>
                  <th className="text-left py-4 px-5 font-medium text-slate-500">
                    Type
                  </th>
                  <th className="text-left py-4 px-5 font-medium text-slate-500">
                    Amount
                  </th>
                  <th className="text-left py-4 px-5 font-medium text-slate-500">
                    Price
                  </th>
                  <th className="text-right py-4 px-5 font-medium text-slate-500">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 5).map((transaction, index) => (
                  <tr key={index} className="border-b border-slate-100">
                    <td className="py-4 px-5 text-slate-700">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === "Buy"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-slate-700">
                      {transaction.amount}
                    </td>
                    <td className="py-4 px-5 text-slate-700">
                      {transaction.price}
                    </td>
                    <td className="py-4 px-5 text-right text-slate-700">
                      {transaction.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default StrategyDetail;
