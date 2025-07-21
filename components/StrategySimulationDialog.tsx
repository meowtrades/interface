/** @format */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RiskLevel, Strategy } from "@/lib/types";
import {
  RefreshCw,
  Grid,
  TrendingUp,
  Clock,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import StartStrategyDialog from "./StartStrategyDialog";
import { FrequencyOption, useCreateInvestmentPlan } from "@/api";
import { authClient } from "@/lib/auth";
import { getLeapWalletAddress } from "@/lib/grants/wallet";

interface StrategySimulationDialogProps {
  strategy: Strategy;
  open: boolean;
  onClose: () => void;
  defaultToken?: string;
}

// Color map for strategy types
const ColorMap: Record<
  string,
  { bg: string; text: string; primary: string; gradient: string }
> = {
  dca: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    primary: "#3b82f6",
    gradient: "#93c5fd",
  },
  grid: {
    bg: "bg-purple-100",
    text: "text-purple-600",
    primary: "#8b5cf6",
    gradient: "#c4b5fd",
  },
  momentum: {
    bg: "bg-amber-100",
    text: "text-amber-600",
    primary: "#d97706",
    gradient: "#fcd34d",
  },
  custom: {
    bg: "bg-green-100",
    text: "text-green-600",
    primary: "#22c55e",
    gradient: "#86efac",
  },
};

// Icon map for strategy types
const IconMap: Record<string, React.ReactNode> = {
  RefreshCw: <RefreshCw size={20} />,
  Grid: <Grid size={20} />,
  TrendingUp: <TrendingUp size={20} />,
};

// Button classes with proper hover states for each strategy type
const getButtonClasses = (strategyType: string): string => {
  switch (strategyType) {
    case "dca":
      return "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200 font-semibold shadow-sm hover:shadow-md";
    case "grid":
      return "bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800 transition-colors duration-200 font-semibold shadow-sm hover:shadow-md";
    case "momentum":
      return "bg-amber-600 text-white hover:bg-amber-700 active:bg-amber-800 transition-colors duration-200 font-semibold shadow-sm hover:shadow-md";
    case "custom":
      return "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 transition-colors duration-200 font-semibold shadow-sm hover:shadow-md";
    default:
      return "bg-slate-600 text-white hover:bg-slate-700 active:bg-slate-800 transition-colors duration-200 font-semibold shadow-sm hover:shadow-md";
  }
};

const StrategySimulationDialog = ({
  strategy,
  open,
  onClose,
  defaultToken = "btc",
}: StrategySimulationDialogProps) => {
  // State for strategy dialog
  const [startDialogOpen, setStartDialogOpen] = useState(false);

  const dcaMutation = useCreateInvestmentPlan();
  const { data: user } = authClient.useSession();

  // Handle starting a strategy
  const handleStartStrategy = async (data: {
    strategyId: string;
    tokenId: string;
    amount: number;
    frequency: string;
    slippage: number;
    recipientAddress?: string;
    riskLevel?: RiskLevel;
    chain: string;
  }) => {
    if (!user?.user?.id) {
      throw new Error("User not authenticated");
    }

    const amountPerDay = data.amount;

    console.log(data);

    const walletAddress = await getLeapWalletAddress();

    await dcaMutation.mutateAsync({
      amount: amountPerDay,
      userWalletAddress: walletAddress,
      recipientAddress:
        data.strategyId === "SDCA" && data.recipientAddress
          ? data.recipientAddress
          : walletAddress,
      frequency: data.frequency as FrequencyOption,
      chain: data.chain,
      riskLevel: data.riskLevel ?? "medium_risk",
      strategyId: data.strategyId,
      tokenSymbol: data.tokenId,
      slippage: data.slippage,
    });
  };

  // Fixed values for the simulation
  const initialInvestment = 500;
  const currentValue = 560;
  const profit = currentValue - initialInvestment;
  const profitPercentage = (profit / initialInvestment) * 100;

  // Create exact dates for the chart to match the screenshot
  const performanceData = [
    { date: "Jan 24", value: 500 },
    { date: "Feb 8", value: 515 },
    { date: "Feb 23", value: 530 },
    { date: "Mar 10", value: 545 },
    { date: "Mar 25", value: 555 },
    { date: "Apr 9", value: 560 },
  ];

  // Create simulated transactions to match the screenshot
  const transactions = [
    { date: "Jan 24", type: "Buy", amount: 166.67, value: 170.78 },
    { date: "Feb 23", type: "Buy", amount: 166.67, value: 181.35 },
    { date: "Mar 25", type: "Buy", amount: 166.67, value: 207.87 },
  ];

  // Get color scheme based on strategy type
  const colorScheme = ColorMap[strategy.type] || {
    bg: "bg-gray-100",
    text: "text-gray-600",
    primary: "#4ade80",
    gradient: "#86efac",
  };
  const isProfitable = profit > 0;

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              What if you invested $10 daily for 3 months?
              {/* What if you invested $500 3 months ago? */}
            </DialogTitle>
            <p className="text-slate-600 mt-1">
              See how a $900 investment would have performed with the{" "}
              {strategy.name} strategy
            </p>
          </DialogHeader>

          <div className="mt-6 space-y-6">
            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg text-center">
                <p className="text-sm text-slate-500 mb-1 font-medium">
                  Initial Investment
                </p>
                <p className="text-xl font-semibold">
                  ${initialInvestment.toFixed(2)}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg text-center">
                <p className="text-sm text-slate-500 mb-1 font-medium">
                  Current Value
                </p>
                <p className="text-xl font-semibold">
                  ${currentValue.toFixed(2)}
                </p>
              </div>

              <div
                className={`p-4 rounded-lg text-center ${
                  isProfitable ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <p className="text-sm text-slate-500 mb-1 font-medium">
                  Profit/Loss
                </p>
                <p
                  className={`text-xl font-semibold ${
                    isProfitable ? "text-green-600" : "text-red-600"
                  }`}
                >
                  +{profit.toFixed(2)} ({profitPercentage.toFixed(0)}%)
                </p>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <h3 className="text-lg font-medium mb-4">
                Performance Over Time
              </h3>
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={performanceData}
                    margin={{ top: 5, right: 10, bottom: 5, left: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorValue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={colorScheme.primary}
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor={colorScheme.primary}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#eee"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#94a3b8" }}
                    />
                    <YAxis
                      domain={[450, 610]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#94a3b8" }}
                      tickCount={5}
                      ticks={[450, 490, 530, 570, 610]}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      formatter={(value) => [`$${value}`, "Value"]}
                      labelFormatter={(label) => `Date: ${label}`}
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        boxShadow:
                          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        border: "none",
                        padding: "8px 12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={colorScheme.primary}
                      strokeWidth={2}
                      fill="url(#colorValue)"
                      dot={false}
                      activeDot={{
                        r: 6,
                        fill: colorScheme.primary,
                        stroke: "#fff",
                        strokeWidth: 2,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <h3 className="text-lg font-medium mb-4">
                Simulated Transactions
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="py-2 px-4 text-left font-medium text-slate-600">
                        Date
                      </th>
                      <th className="py-2 px-4 text-left font-medium text-slate-600">
                        Type
                      </th>
                      <th className="py-2 px-4 text-left font-medium text-slate-600">
                        Amount
                      </th>
                      <th className="py-2 px-4 text-left font-medium text-slate-600">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx, i) => (
                      <tr key={i} className="border-t border-slate-200">
                        <td className="py-3 px-4">{tx.date}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 ${colorScheme.bg} ${colorScheme.text} rounded-full text-sm`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-3 px-4">${tx.amount.toFixed(2)}</td>
                        <td className="py-3 px-4">${tx.value.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Strategy Insights */}
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <h3 className="text-lg font-medium mb-4">Strategy Insights</h3>
              <div className="space-y-3">
                {strategy.type === "dca" && (
                  <>
                    <div className="flex items-start gap-3">
                      <Clock className={`${colorScheme.text} mt-0.5 w-5 h-5`} />
                      <div>
                        <p className="font-medium">Automatic Timing</p>
                        <p className="text-sm text-slate-500">
                          The strategy purchased at regular intervals, reducing
                          timing risk.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <DollarSign
                        className={`${colorScheme.text} mt-0.5 w-5 h-5`}
                      />
                      <div>
                        <p className="font-medium">Cost Averaging</p>
                        <p className="text-sm text-slate-500">
                          Regular investments reduced your average cost basis
                          over the 3-month period.
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {strategy.type === "grid" && (
                  <>
                    <div className="flex items-start gap-3">
                      <Grid className={`${colorScheme.text} mt-0.5 w-5 h-5`} />
                      <div>
                        <p className="font-medium">Price Range Trading</p>
                        <p className="text-sm text-slate-500">
                          The strategy buys at lower price levels and sells at
                          higher price levels.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <ArrowRight
                        className={`${colorScheme.text} mt-0.5 w-5 h-5`}
                      />
                      <div>
                        <p className="font-medium">Predefined Range</p>
                        <p className="text-sm text-slate-500">
                          Trading occurred within a set price range, with
                          profits taken at the upper bound.
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {strategy.type === "momentum" && (
                  <>
                    <div className="flex items-start gap-3">
                      <TrendingUp
                        className={`${colorScheme.text} mt-0.5 w-5 h-5`}
                      />
                      <div>
                        <p className="font-medium">Trend Following</p>
                        <p className="text-sm text-slate-500">
                          The strategy buys when prices show upward momentum.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <RefreshCw
                        className={`${colorScheme.text} mt-0.5 w-5 h-5`}
                      />
                      <div>
                        <p className="font-medium">Dynamic Allocation</p>
                        <p className="text-sm text-slate-500">
                          Position sizes are adjusted based on market conditions
                          and trend strength.
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {strategy.type !== "dca" &&
                  strategy.type !== "grid" &&
                  strategy.type !== "momentum" && (
                    <div className="flex items-start gap-3">
                      <RefreshCw
                        className={`${colorScheme.text} mt-0.5 w-5 h-5`}
                      />
                      <div>
                        <p className="font-medium">Custom Strategy</p>
                        <p className="text-sm text-slate-500">
                          This strategy uses custom parameters to optimize your
                          investment over time.
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button
              className={`${getButtonClasses(strategy.type)}`}
              onClick={() => setStartDialogOpen(true)}
            >
              Start This Strategy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Strategy Start Dialog */}
      <StartStrategyDialog
        supportedChains={strategy.supportedChains || ["injective"]}
        loading={dcaMutation.isPending}
        strategy={strategy}
        open={startDialogOpen}
        onClose={() => setStartDialogOpen(false)}
        defaultToken={defaultToken}
        onStartStrategy={handleStartStrategy}
      />
    </>
  );
};

export default StrategySimulationDialog;
