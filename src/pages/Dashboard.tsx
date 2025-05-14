/** @format */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  BarChart2,
  Zap,
  RefreshCw,
  Grid,
} from "lucide-react";
import StrategyPopup from "@/components/StrategyPopup";
import { useStrategies } from "@/lib/context/StrategiesContext";
import { useWallet } from "@/lib/context/WalletContext";
import { Skeleton } from "@/components/ui/skeleton";
import {
  api,
  axiosInstance,
  useUserDcaPlans,
  useUserStatistics,
  useUserTransactions,
} from "@/api";
import { useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  const {
    userStrategies,
    strategies,
    tokens,
    chains,
    isLoading: strategiesLoading,
    error: strategiesError,
  } = useStrategies();

  const {
    wallets,
    isLoading: walletsLoading,
    error: walletsError,
    getTotalBalanceUsd,
  } = useWallet();

  const { data: userStatistics, isLoading: userStatisticsLoading } =
    useUserStatistics();

  const [showStrategyPopup, setShowStrategyPopup] = useState(false);

  const { data: dcaActiveStrategies } = useUserDcaPlans();

  const { data: activeStrategiesAnalytics, isLoading: analyticsLoading } =
    useQuery({
      queryKey: ["activeStrategiesAnalytics"],
      queryFn: () => api.analytics.getActiveStrategiesAnalytics(),
    });

  console.log("activeStrategiesAnalytics", activeStrategiesAnalytics);

  // Filter active user strategies
  const activeUserStrategies = dcaActiveStrategies?.filter((us) => us.isActive);

  const isProfitable = userStatistics?.profitLossPercentage > 0;

  // Check for errors
  const error = strategiesError || walletsError;

  useEffect(() => {
    const shouldShowPopup =
      localStorage.getItem("showStrategyPopup") === "true";
    if (shouldShowPopup) {
      setShowStrategyPopup(true);
      localStorage.removeItem("showStrategyPopup");
    }
  }, []);
  console.log("userStatistics", userStatistics);

  const handleStrategyStart = (strategyData: {
    amount: number;
    token: string;
  }) => {
    console.log("Starting strategy with:", strategyData);
    // In a real app, this would call the API to start a strategy
  };

  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: ["overview"],
    queryFn: async () => {
      const response = await axiosInstance.get("/user/analytics/overview");
      return response.data.data;
    },
  });

  const isLoading = overviewLoading || userStatisticsLoading;

  console.log("overview", overview);

  if (error) {
    return (
      <AppLayout>
        <div className="p-4 bg-red-50 text-red-600 rounded-md">
          Error loading dashboard data: {error}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-slate-600">
          Welcome back! Here's your trading overview.
        </p>
      </div>

      <StrategyPopup
        open={showStrategyPopup}
        onOpenChange={setShowStrategyPopup}
        onConfirm={handleStrategyStart}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card className="shadow-sm">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardDescription>Total Portfolio Value</CardDescription>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <CardTitle className="text-2xl">
                ${overview?.totalPortfolioValue.toFixed(2)}
              </CardTitle>
            )}
          </CardHeader>
          <CardContent className="pb-4 px-5">
            {isLoading ? (
              <Skeleton className="h-4 w-16" />
            ) : (
              <div
                className={`flex items-center gap-1 text-sm ${
                  isProfitable ? "text-green-500" : "text-red-500"
                }`}
              >
                {isProfitable ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
                <span>{overview?.profitLossPercentage.toFixed(2)}%</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardDescription>Total Invested</CardDescription>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <CardTitle className="text-2xl">
                ${overview?.totalInvested.toFixed(2)}
              </CardTitle>
            )}
          </CardHeader>
          <CardContent className="pb-4 px-5">
            <div className="text-sm text-slate-500">Across all strategies</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardDescription>Total Profit/Loss</CardDescription>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <CardTitle
                className={`text-2xl ${
                  isProfitable ? "text-green-500" : "text-red-500"
                }`}
              >
                {isProfitable ? "+" : "-"}$
                {Math.abs(overview?.totalProfitLoss).toFixed(2)}
              </CardTitle>
            )}
          </CardHeader>
          <CardContent className="pb-4 px-5">
            {isLoading ? (
              <Skeleton className="h-4 w-16" />
            ) : (
              <div
                className={`flex items-center gap-1 text-sm ${
                  overview?.profitLossPercentage >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {isProfitable ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
                <span>{overview?.profitLossPercentage.toFixed(2)}%</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardDescription>Active Strategies</CardDescription>
            {isLoading ? (
              <Skeleton className="h-8 w-8" />
            ) : (
              <CardTitle className="text-2xl">
                {overview?.activeStrategies.total}
              </CardTitle>
            )}
          </CardHeader>
          <CardContent className="pb-4 px-5">
            <div className="text-sm text-slate-500">
              {overview?.activeStrategies.mock} mock trades
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Active Plans</h2>
          <Link
            to="/app/strategies"
            className="text-blue-600 text-sm flex items-center"
          >
            View all <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading ? (
            <>
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </>
          ) : activeStrategiesAnalytics?.data.data.real.length > 0 ? (
            activeStrategiesAnalytics.data.data.real.map((strategy) => {
              const isProfitable = strategy.profit >= 0;
              const profitPercentage =
                (strategy.profit / strategy.totalInvested) * 100;

              return (
                <Card key={strategy._id} className="shadow-sm">
                  <CardHeader className="pb-2 pt-4 px-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardDescription>
                          {strategy.strategyTemplate.name}
                        </CardDescription>
                        <CardTitle className="text-xl">
                          {strategy.token.symbol}
                        </CardTitle>
                      </div>
                      <div className="px-3 py-1 rounded-full text-white text-xs font-medium bg-blue-600">
                        {strategy.strategyTemplate.id}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-5 pb-3">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-sm">
                          Current Value
                        </span>
                        <span className="font-medium">
                          ${strategy.currentValue.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-sm">
                          Starting Value
                        </span>
                        <span className="font-medium">
                          ${strategy.totalInvested.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-sm">
                          Profit/Loss
                        </span>
                        <span
                          className={`font-medium ${
                            isProfitable ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {isProfitable ? "+" : "-"}$
                          {Math.abs(strategy.profit).toFixed(2)} (
                          {profitPercentage.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="px-5 pt-0 pb-4">
                    <Link
                      to={`/app/strategies/${strategy._id}`}
                      state={{
                        source: "dashboard",
                        strategyId: strategy._id,
                      }}
                      className="w-full"
                    >
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })
          ) : (
            <Card className="border-dashed border-2 border-slate-200 shadow-sm">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <div className="h-14 w-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <Zap size={24} />
                </div>
                <h3 className="text-lg font-medium mb-3">
                  Start Your First Strategy
                </h3>
                <p className="text-slate-500 mb-5">
                  Choose from our range of automated trading strategies to start
                  investing with just one click.
                </p>
                <Link to="/app/strategies">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Explore Strategies
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Mock Plans</h2>
          <Link
            to="/app/strategies"
            className="text-blue-600 text-sm flex items-center"
          >
            View all <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading ? (
            <>
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </>
          ) : activeStrategiesAnalytics?.data.data.mock.length > 0 ? (
            activeStrategiesAnalytics.data.data.mock.map((strategy) => {
              const isProfitable = strategy.profit >= 0;
              const profitPercentage =
                (strategy.profit / strategy.totalInvested) * 100;

              return (
                <Card key={strategy._id} className="shadow-sm">
                  <CardHeader className="pb-2 pt-4 px-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardDescription>
                          {strategy.strategyTemplate.name}
                        </CardDescription>
                        <CardTitle className="text-xl">
                          {strategy.token.symbol}
                        </CardTitle>
                      </div>
                      <div className="px-3 py-1 rounded-full text-white text-xs font-medium bg-purple-600">
                        {strategy.strategyTemplate.id}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-5 pb-3">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-sm">
                          Current Value
                        </span>
                        <span className="font-medium">
                          ${strategy.currentValue.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-sm">
                          Starting Value
                        </span>
                        <span className="font-medium">
                          ${strategy.totalInvested.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-sm">
                          Profit/Loss
                        </span>
                        <span
                          className={`font-medium ${
                            isProfitable ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {isProfitable ? "+" : "-"}$
                          {Math.abs(strategy.profit).toFixed(2)} (
                          {profitPercentage.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="px-5 pt-0 pb-4">
                    <Link
                      to={`/app/strategies/${strategy._id}`}
                      state={{
                        source: "dashboard",
                        strategyId: strategy._id,
                      }}
                      className="w-full"
                    >
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })
          ) : (
            <Card className="border-dashed border-2 border-slate-200 shadow-sm">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <div className="h-14 w-14 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                  <Grid size={24} />
                </div>
                <h3 className="text-lg font-medium mb-3">
                  Start Your First Mock Strategy
                </h3>
                <p className="text-slate-500 mb-5">
                  Try out our strategies in mock mode to test your trading
                  strategies risk-free.
                </p>
                <Link to="/app/strategies">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Explore Mock Strategies
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Activities</h2>
          <Link
            to="/app/history"
            className="text-blue-600 text-sm flex items-center"
          >
            View all <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <div className="divide-y">
                {/* Mock data - in a real app, this would come from an API */}
                {[
                  {
                    id: "act1",
                    type: "Buy",
                    token: "INJ",
                    amount: "2.5 INJ",
                    value: "$12.75",
                    time: "2 hours ago",
                  },
                  {
                    id: "act2",
                    type: "Sell",
                    token: "INJ",
                    amount: "3.8 INJ",
                    value: "$38.76",
                    time: "5 hours ago",
                  },
                  {
                    id: "act3",
                    type: "Buy",
                    token: "USDT",
                    amount: "100 USDT",
                    value: "$100.00",
                    time: "1 day ago",
                  },
                ].map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-5"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center ${
                          activity.type === "Buy"
                            ? "bg-green-100 text-green-600"
                            : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {activity.type === "Buy" ? (
                          <TrendingUp size={20} />
                        ) : (
                          <TrendingDown size={20} />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">
                          {activity.type} {activity.token}
                        </div>
                        <div className="text-xs text-slate-500">
                          {activity.time}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{activity.amount}</div>
                      <div className="text-xs text-slate-500">
                        {activity.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard;
