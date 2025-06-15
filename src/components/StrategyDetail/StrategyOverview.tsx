/** @format */

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Grid,
  Pause,
  RefreshCcw,
  RefreshCw,
  TrendingUp,
  Play,
  Loader2,
} from "lucide-react";
import { StrategyChart } from "./StrategyChart";
import { UserStrategy } from "./types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api, Transaction } from "@/api";
import { useParams, useSearchParams } from "react-router-dom";
import { Frequency } from "@/lib/types";
import { getValidRanges } from "@/lib/utils";
import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export const StrategyOverview = () => {
  const { strategyId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [_validRanges, setValidRanges] = useState<
    { label: string; value: string }[]
  >([]);
  const range = searchParams.get("range");

  const {
    data: userStrategy,
    refetch: refetchUserStrategy,
    isLoading: isLoadingUserStrategy,
  } = useQuery<UserStrategy>({
    queryKey: ["userStrategy", strategyId],
    queryFn: async () => {
      if (!strategyId) throw new Error("Strategy ID is required");
      const {
        data: { data },
      } = await api.strategies.getDetails(strategyId);
      return data;
    },
  });

  console.log(userStrategy);
  const [currentPage, setCurrentPage] = useState(1);

  const { refetch: refetchTransactions } = useQuery<
    unknown,
    AxiosError,
    {
      data: Transaction[];
      pagination: {
        totalPages: number;
      };
    }
  >({
    queryKey: ["transactions", strategyId, currentPage],
    queryFn: async () => {
      return (
        await api.strategies.getTransactions(strategyId, {
          page: currentPage,
          limit: 5,
        })
      ).data;
    },
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!strategyId,
  });

  const { refetch: refetchChart } = useQuery({
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
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!strategyId && !!range,
  });

  const refreshData = async () => {
    try {
      await refetchChart();
      await refetchUserStrategy();
      await refetchTransactions();
    } catch (error) {
      console.error("Failed to refresh chart data:", error);
    }
  };

  const { mutate: switchStrategyStatus, isPending: isSwitching } = useMutation({
    mutationFn: async () => {
      if (!strategyId) throw new Error("Strategy ID is required");

      if (userStrategy.status === "active") {
        const { data } = await api.plans.pause(strategyId);
        return data;
      } else {
        const { data } = await api.plans.resume(strategyId);
        return data;
      }
    },

    onSuccess: () => {
      refetchUserStrategy();
      refetchTransactions();
      refetchChart();
    },
  });

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
              {userStrategy.token.symbol} {userStrategy.strategyTemplate?.name}
            </h2>
            <div
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorScheme.bg}`}
            >
              {userStrategy.strategyTemplate?.name}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={refreshData}
          >
            <RefreshCcw size={14} />
            Refresh
          </Button>
          {userStrategy.chain !== "mock" && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => switchStrategyStatus()}
              disabled={isSwitching}
            >
              {isSwitching || isLoadingUserStrategy ? (
                <Loader2 size={14} className="animate-spin" />
              ) : userStrategy.status === "active" ? (
                <Pause size={14} />
              ) : (
                <Play size={14} />
              )}
              {userStrategy.status === "active" ? "Pause" : "Resume"}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            Close Position
          </Button>
        </div>
      </div>

      {userStrategy.pauseReason && (
        <Alert variant="info" className="mb-4">
          <AlertTitle className="text-sm font-semibold">
            Strategy Paused
          </AlertTitle>
          <AlertDescription className="text-sm">
            Due to {userStrategy.pauseReason}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardDescription>Current Position</CardDescription>
            <CardTitle className="text-xl">
              {formatCurrency(userStrategy.currentValue)}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardDescription>Total Invested</CardDescription>
            <CardTitle className="text-xl">
              {formatCurrency(userStrategy.totalInvested)}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardDescription>Profit/Loss</CardDescription>
            <CardTitle
              className={`text-xl ${
                userStrategy.profit >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {userStrategy.profit >= 0 ? "+" : "-"}
              {formatCurrency(Math.abs(userStrategy.profit))}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      <StrategyChart />
    </div>
  );
};
