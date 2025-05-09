/** @format */

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Grid, RefreshCcw, RefreshCw, TrendingUp } from "lucide-react";
import { StrategyChart } from "./StrategyChart";
import { UserStrategy, ChartData } from "./types";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
import { Frequency } from "@/lib/types";
import { getValidRanges } from "@/lib/utils";
import { useState, useEffect } from "react";

interface StrategyOverviewProps {
  userStrategy: UserStrategy;
}

export const StrategyOverview = ({ userStrategy }: StrategyOverviewProps) => {
  const { strategyId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [validRanges, setValidRanges] = useState<
    { label: string; value: string }[]
  >([]);
  const range = searchParams.get("range");

  useEffect(() => {
    const ranges = getValidRanges(userStrategy.frequency as Frequency);
    setValidRanges(ranges);

    // Set the default range in the search params if not already set
    if (!range) {
      setSearchParams(
        { range: ranges[0].value },
        {
          replace: true,
        }
      );
    }
  }, [userStrategy.frequency, range, setSearchParams]);

  const {
    data: filteredChartData,
    isLoading: isChartDataLoading,
    refetch: refetchChartData,
    error: chartError,
  } = useQuery({
    queryKey: ["chart", strategyId, range],
    queryFn: async () => {
      if (!strategyId) throw new Error("Strategy ID is required");
      const priceData = await api.strategies.getChartData(strategyId);

      if (priceData.status === 202) {
        return {
          waiting: true,
        };
      }

      const data = priceData.data.data.map((i) => ({
        date: new Date(i.timestamp * 1000).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        }),
        value: i.price,
      }));

      return { waiting: false, data };
    },
    refetchOnWindowFocus: false,
    retry(_failureCount, error) {
      if (axios.isAxiosError(error)) {
        return error.response?.status === 500 || error.code === "ERR_NETWORK";
      }
      return false;
    },
    enabled: !!strategyId && !!range,
  });

  // Helper to format as currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

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

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => refetchChartData()}
          >
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
              {formatCurrency(userStrategy.profit)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      <StrategyChart />
    </div>
  );
};
