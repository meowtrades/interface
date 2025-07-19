/** @format */

"use client";

import { useState } from "react";
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
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  api,
  axiosInstance,
  useCreateMockTrade,
  useStopMockTrade,
} from "@/api";
import { Frequency, RiskLevel } from "@/lib/types";
import { formatFrequency } from "@/lib/utils";
import { useQueries, useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

// Mock data for performance chart
const generateMockChartData = (timeframe: string) => {
  const currentDate = new Date();
  const data = [];
  let value = 1000;

  if (timeframe === "7d") {
    // 7 days data - daily points
    for (let i = 7; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      // Add some randomness to the value
      value = value * (1 + (Math.random() * 0.02 - 0.01));
      data.push({ date: formattedDate, value: Math.round(value) });
    }
  } else if (timeframe === "1m") {
    // 1 month data - daily points
    for (let i = 30; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      // Add some randomness to the value
      value = value * (1 + (Math.random() * 0.03 - 0.01));
      data.push({ date: formattedDate, value: Math.round(value) });
    }
  } else if (timeframe === "3m") {
    // 3 months data - every 3 days
    for (let i = 90; i >= 0; i -= 3) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      value = value * (1 + (Math.random() * 0.04 - 0.015));
      data.push({ date: formattedDate, value: Math.round(value) });
    }
  }

  // Make a new array that shows cumulative till that date
  // Try to decrease linearity of chart, start linear then move a little flat
  const output: { date: string; value: number }[] = [];

  let cumulativeValue = 0;
  data.forEach((point, index) => {
    cumulativeValue += (point.value * (1 + Math.random() * 2)) / (index + 1); // Add some randomness
    output.push({ date: point.date, value: cumulativeValue });
  });

  return output;
};

const MockTrades = () => {
  const [amount, setAmount] = useState("100");
  const [selectedStrategy, setSelectedStrategy] = useState("SDCA");
  const [selectedToken, setSelectedToken] = useState("BTC");
  const [riskLevel, setRiskLevel] = useState(2); // Default to moderate (2)
  const [frequency, setFrequency] = useState(Frequency.DAILY); // Default frequency
  const [chartTimeframe, setChartTimeframe] = useState("1m");
  const [chartData, setChartData] = useState(generateMockChartData("1m"));

  const mockTradeMutation = useCreateMockTrade();

  const stopMutation = useStopMockTrade();

  const handleTimeframeChange = (timeframe: string) => {
    setChartTimeframe(timeframe);
    setChartData(generateMockChartData(timeframe));
  };

  const [
    { data: tokens, isLoading: isTokensLoading },
    { data: strategies, isLoading: isStrategiesLoading },
  ] = useQueries({
    queries: [
      {
        queryKey: ["available", "tokens"],
        queryFn: async () => {
          const { data } = await axiosInstance.get("/available/tokens");
          return data.tokens;
        },
      },
      {
        queryKey: ["available", "strategies"],
        queryFn: async () => {
          const { data } = await axiosInstance.get("/available/strategies");
          return data.strategies;
        },
      },
    ],
  });

  const {
    data: activeMockStrategiesWithAnalytics,
    isLoading: isLoadingActiveMockStrategiesAnalytics,
  } = useQuery({
    queryKey: ["activeStrategiesAnalytics", "mock"],
    queryFn: async () => {
      const {
        data: { data },
      } = await api.analytics.getActiveMockStrategies();
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const handleStartMockTrade = () => {
    mockTradeMutation.mutate({
      strategyId: selectedStrategy,
      tokenSymbol: selectedToken,
      amount: Number(amount),
      riskLevel:
        riskLevel === 1
          ? RiskLevel.NO_RISK
          : riskLevel === 2
          ? RiskLevel.MEDIUM_RISK
          : RiskLevel.HIGH_RISK,
      frequency,
    });

    toast.success("Paper Trade started successfully!", {
      description: "You can track its performance in the Active Trades tab.",
    });
  };

  return (
    <AppLayout>
      <div className="mb-8 px-1">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Paper Trades
        </h1>
        <p className="text-muted-foreground">
          Test strategies with virtual funds before investing real money.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mb-8" data-start-trade-section>
        <Card className="w-full lg:w-1/3 shadow-3d-soft hover:shadow-3d-hover-soft transition-all duration-300">
          <CardHeader className="pb-4 pt-6 px-6">
            <CardTitle className="text-xl font-bold text-contrast-high">
              Start a Paper Trade
            </CardTitle>
            <CardDescription className="text-contrast-medium">
              Simulate how a strategy would perform with virtual funds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-6">
            <div>
              <label className="text-sm font-semibold block mb-2 text-contrast-high">
                Amount
              </label>
              <Input
                type="number"
                min="10"
                max="1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="focus:border-blue-500 focus:ring-2 focus:ring-blue-200 border-2 bg-white text-contrast-high font-medium"
                placeholder="Enter amount"
              />
              <p className="text-xs text-contrast-medium mt-2">
                Default mock amount is $100
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold block mb-2 text-contrast-high">
                Strategy
              </label>
              <Select
                value={selectedStrategy}
                onValueChange={setSelectedStrategy}
              >
                <SelectTrigger className="border-2 bg-white text-contrast-high font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                  <SelectValue placeholder="Select a strategy" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 shadow-lg">
                  {strategies?.map((strategy: string) => (
                    <SelectItem key={strategy} value={strategy} className="text-contrast-high font-medium">
                      {strategy}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-semibold block mb-2 text-contrast-high">
                Token
              </label>
              <Select value={selectedToken} onValueChange={setSelectedToken}>
                <SelectTrigger className="border-2 bg-white text-contrast-high font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                  <SelectValue placeholder="Select a token" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 shadow-lg">
                  {tokens?.map((token: string) => (
                    <SelectItem key={token} value={token} className="text-contrast-high font-medium">
                      {token}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-semibold block mb-2 text-contrast-high">
                Risk Level
              </label>
              <Slider
                value={[riskLevel]}
                onValueChange={(value: number[]) => setRiskLevel(value[0])}
                min={1}
                max={3}
                step={1}
                className="w-full py-2"
              />
              <div className="flex justify-between text-xs text-contrast-medium mt-2 font-medium">
                <span>Conservative</span>
                <span>Moderate</span>
                <span>Aggressive</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold block mb-2 text-contrast-high">
                Frequency
              </label>
              <Select
                value={frequency}
                onValueChange={(value: string) => setFrequency(value as Frequency)}
              >
                <SelectTrigger className="border-2 bg-white text-contrast-high font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 shadow-lg">
                  {Object.values(Frequency).map((freq) => (
                    <SelectItem key={freq} value={freq} className="text-contrast-high font-medium">
                      {formatFrequency(freq)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 text-contrast-high">
              <AlertCircle size={20} className="text-blue-600 flex-shrink-0" />
              <p className="text-sm font-medium">
                This is a simulation using historical data. Past performance
                does not guarantee future results.
              </p>
            </div>
          </CardContent>

          <CardFooter className="px-6 pt-2 pb-6">
            <Button
              onClick={handleStartMockTrade}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 shadow-sm hover:shadow-md transition-all duration-200"
            >
              Start Paper Trade
            </Button>
          </CardFooter>
        </Card>

        <Card className="w-full lg:w-2/3 shadow-3d-soft hover:shadow-3d-hover-soft transition-all duration-300">
          <CardHeader className="pb-4 pt-6 px-6">
            <CardTitle className="text-xl font-bold text-contrast-high">
              Smart DCA Performance
            </CardTitle>
            <CardDescription className="text-contrast-medium">
              How $10 daily investment would have performed over time
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6">
            <div className="flex justify-end space-x-2 mb-6">
              <Button
                variant={chartTimeframe === "7d" ? "default" : "outline"}
                size="sm"
                onClick={() => handleTimeframeChange("7d")}
                className={
                  chartTimeframe === "7d"
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold shadow-sm"
                    : "border-2 text-contrast-high font-medium hover:bg-purple-50 transition-colors"
                }
              >
                7D
              </Button>
              <Button
                variant={chartTimeframe === "1m" ? "default" : "outline"}
                size="sm"
                onClick={() => handleTimeframeChange("1m")}
                className={
                  chartTimeframe === "1m"
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold shadow-sm"
                    : "border-2 text-contrast-high font-medium hover:bg-purple-50 transition-colors"
                }
              >
                1M
              </Button>
              <Button
                variant={chartTimeframe === "3m" ? "default" : "outline"}
                size="sm"
                onClick={() => handleTimeframeChange("3m")}
                className={
                  chartTimeframe === "3m"
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold shadow-sm"
                    : "border-2 text-contrast-high font-medium hover:bg-purple-50 transition-colors"
                }
              >
                3M
              </Button>
            </div>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="colorPerformance"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#9a71ff" stopOpacity={0.6} />
                      <stop
                        offset="95%"
                        stopColor="#9a71ff"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                    domain={["dataMin - 200", "dataMax + 200"]}
                  />
                  <Tooltip
                    formatter={(value) => [
                      `$${value.toLocaleString()}`,
                      "Value",
                    ]}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{
                      borderRadius: "6px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="url(#colorPerformance)"
                    dot={false}
                    activeDot={{
                      r: 6,
                      stroke: "#FFF",
                      strokeWidth: 2,
                      fill: "#8b5cf6",
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mb-6">Your Paper Trades</h2>

      <Tabs defaultValue="active" className="mb-2">
        <TabsContent value="active" className="pt-6">
          {!isLoadingActiveMockStrategiesAnalytics && (!activeMockStrategiesWithAnalytics || activeMockStrategiesWithAnalytics.length === 0) ? (
            <Card className="border-2 border-dashed border-border bg-card hover:shadow-card-hover transition-shadow duration-200">
              <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
                <div className="h-16 w-16 rounded-full bg-secondary text-primary flex items-center justify-center mb-6">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-subtitle font-semibold text-foreground mb-3">
                  No Active Paper Trades
                </h3>
                <p className="text-body text-muted-foreground mb-6 max-w-sm leading-relaxed">
                  You don&apos;t have any active paper trades yet. Start your first simulation to test strategies with virtual funds before investing real money.
                </p>
                <Button 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-card transition-all duration-200 hover:shadow-card-hover"
                  onClick={() => {
                    const startTradeSection = document.querySelector('[data-start-trade-section]');
                    if (startTradeSection) {
                      startTradeSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Start Your First Paper Trade
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoadingActiveMockStrategiesAnalytics ? (
                <>
                  <Skeleton className="h-80 w-full" />
                  <Skeleton className="h-80 w-full" />
                </>
              ) : (
                activeMockStrategiesWithAnalytics?.map((trade) => {
                const startedAt = Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }).format(new Date(trade.createdAt));

                return (
                  <Card key={trade._id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-10 h-10 rounded-full ${
                              // eslint-disable-next-line no-constant-condition
                              true
                                ? "bg-blue-100 text-crypto-blue"
                                : "bg-purple-100 text-crypto-purple"
                            } flex items-center justify-center`}
                          >
                            {
                              // eslint-disable-next-line no-constant-condition
                              true ? (
                                <TrendingUp size={20} />
                              ) : (
                                <TrendingDown size={20} />
                              )
                            }
                          </div>
                          <div>
                            <CardTitle className="text-md">Smart DCA</CardTitle>
                            <CardDescription>
                              {trade.token.symbol} • Started {startedAt}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 text-sm">
                            Initial Amount
                          </span>
                          <span className="font-medium">
                            ${trade.totalInvested.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 text-sm">
                            Current Value
                          </span>
                          <span className="font-medium">
                            ${trade.currentValue.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 text-sm">
                            Profit/Loss
                          </span>
                          <span
                            className={`font-medium ${
                              trade.profit >= 0
                                ? "text-crypto-green"
                                : "text-crypto-red"
                            }`}
                          >
                            {trade.profit >= 0 ? "+" : ""}$
                            {trade.profit.toFixed(2)} (
                            {trade.profit >= 0 ? "+" : ""}
                            {trade.profitPercentage.toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="flex gap-2">
                      <Link
                        href={`/app/strategies/${trade._id}`}
                        className="w-full"
                      >
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>

                      <Button
                        onClick={() =>
                          stopMutation.mutate({ tradeId: trade._id })
                        }
                        variant="destructive"
                        className="w-full"
                      >
                        Stop
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })
            )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: "completed1",
                type: "Smart DCA",
                token: "BTC",
                startDate: "Feb 10, 2023",
                endDate: "Mar 15, 2023",
                startAmount: 100,
                endAmount: 138.25,
                profit: 38.25,
                profitPercentage: 38.25,
              },
              {
                id: "completed2",
                type: "Grid Trading",
                token: "ETH",
                startDate: "Jan 5, 2023",
                endDate: "Mar 5, 2023",
                startAmount: 100,
                endAmount: 112.8,
                profit: 12.8,
                profitPercentage: 12.8,
              },
            ].map((trade) => (
              <Card key={trade.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-10 h-10 rounded-full ${
                          trade.type === "Smart DCA"
                            ? "bg-blue-100 text-crypto-blue"
                            : "bg-purple-100 text-crypto-purple"
                        } flex items-center justify-center`}
                      >
                        {trade.type === "Smart DCA" ? (
                          <TrendingUp size={20} />
                        ) : (
                          <TrendingDown size={20} />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-md">{trade.type}</CardTitle>
                        <CardDescription>
                          {trade.token} • Completed {trade.endDate}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm">Duration</span>
                      <span className="font-medium">
                        {trade.startDate} - {trade.endDate}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm">
                        Initial Amount
                      </span>
                      <span className="font-medium">
                        ${trade.startAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm">
                        Final Value
                      </span>
                      <span className="font-medium">
                        ${trade.endAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm">
                        Final Profit/Loss
                      </span>
                      <span
                        className={`font-medium ${
                          trade.profit >= 0
                            ? "text-crypto-green"
                            : "text-crypto-red"
                        }`}
                      >
                        {trade.profit >= 0 ? "+" : ""}${trade.profit.toFixed(2)}{" "}
                        ({trade.profit >= 0 ? "+" : ""}
                        {trade.profitPercentage.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        View Report
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>
                          {trade.type} - {trade.token} Trade Report
                        </DialogTitle>
                        <DialogDescription>
                          Completed Paper Trade performance
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4 py-4">
                        <div className="h-40 bg-slate-100 rounded-lg flex items-center justify-center">
                          <span className="text-slate-400">
                            Performance Chart
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">
                              Duration
                            </label>
                            <p className="text-sm text-slate-600">
                              {trade.startDate} - {trade.endDate}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">
                              Initial Investment
                            </label>
                            <p className="text-sm text-slate-600">
                              ${trade.startAmount.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">
                              Final Value
                            </label>
                            <p className="text-sm text-slate-600">
                              ${trade.endAmount.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">
                              Profit/Loss
                            </label>
                            <p
                              className={`text-sm ${
                                trade.profit >= 0
                                  ? "text-crypto-green"
                                  : "text-crypto-red"
                              }`}
                            >
                              {trade.profit >= 0 ? "+" : ""}$
                              {trade.profit.toFixed(2)} (
                              {trade.profit >= 0 ? "+" : ""}
                              {trade.profitPercentage.toFixed(2)}%)
                            </p>
                          </div>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button className="bg-crypto-blue hover:bg-crypto-blue/90">
                          Start Real Trade with This Strategy
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default MockTrades;
