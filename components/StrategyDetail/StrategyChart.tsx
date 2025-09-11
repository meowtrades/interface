/** @format */

"use client";

/** @format */

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
} from "recharts";
import { AlertCircle, RefreshCw, BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { useParams, usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Frequency } from "@/lib/types";
import { getValidRanges } from "@/lib/utils";
import { useState, useEffect } from "react";

export const StrategyChart = () => {
  const { id: strategyId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [validRanges, setValidRanges] = useState<
    { label: string; value: string }[]
  >([]);
  const range = searchParams.get("range");
  const pathname = usePathname();

  const { data: userStrategy, isLoading: isStrategyLoading } = useQuery({
    queryKey: ["userStrategy", strategyId],
    queryFn: async () => {
      if (!strategyId) throw new Error("Strategy ID is required");
      const response = await api.strategies.getDetails(strategyId as string);
      return response.data.data;
    },
    enabled: !!strategyId,
  });

  useEffect(() => {
    if (userStrategy) {
      const ranges = getValidRanges(userStrategy.frequency as Frequency);
      setValidRanges(ranges);

      // Set the default range in the search params if not already set
      if (!range) {
        const searchParam = new URLSearchParams();
        searchParam.set("range", ranges[0].value);
        router.replace(`${pathname}?${searchParam.toString()}`);
      }
    }
  }, [userStrategy, range, router, pathname]);

  const {
    data: chartData,
    isLoading: isChartLoading,
    error,
    refetch,
    failureCount,
  } = useQuery({
    queryKey: ["chart", strategyId, range],
    queryFn: async () => {
      if (!strategyId) throw new Error("Strategy ID is required");
      const priceData = await api.strategies.getChartData(strategyId as string);

      // If backend signals processing or returns no data, show waiting state
      if (priceData.status === 202) {
        return {
          waiting: true,
        };
      }

      const series = priceData.data?.data;

      if (!series || series.length === 0) {
        return { waiting: true };
      }

      const data = series.map((i) => ({
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

  console.log(chartData);

  // Format dates for chart
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const ChartError = () => {
    if (!error) return null;

    const isNetworkError =
      axios.isAxiosError(error) && error.code === "ERR_NETWORK";
    const isServerError =
      axios.isAxiosError(error) && error.response?.status === 500;
    const isMaxRetries = failureCount >= 3;

    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 p-4">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle size={20} />
          <span className="font-medium">Failed to load chart data</span>
        </div>
        <p className="text-sm text-slate-600 text-center">
          {isMaxRetries
            ? "We've tried multiple times but couldn't load the data. Please try again."
            : isNetworkError
            ? "Please check your internet connection and try again."
            : isServerError
            ? "Our servers are having trouble. Please try again later."
            : "Something went wrong while loading the chart data."}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => refetch()}
        >
          <RefreshCw size={14} />
          Try Again
        </Button>
      </div>
    );
  };

  if (isStrategyLoading) {
    return (
      <div className="h-72 w-full">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  if (!isChartLoading && (!chartData || chartData.data?.length === 0)) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-lg">Performance</h3>
        </div>
        <Card className="border-2 border-dashed border-border bg-card hover:shadow-card-hover transition-shadow duration-200">
          <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
            <div className="h-16 w-16 rounded-full bg-secondary text-primary flex items-center justify-center mb-6">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-subtitle font-semibold text-foreground mb-3">
              Processing Strategy Data
            </h3>
            <p className="text-body text-muted-foreground mb-6 max-w-sm leading-relaxed">
              We&apos;re currently processing your strategy data. This may take
              a few moments as we gather and analyze your transaction history.
            </p>
            <p className="text-caption text-muted-foreground">
              You&apos;ll be able to see your performance metrics once the data
              is ready.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // For mock chains, show the chart as is
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-lg">Performance</h3>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-md">
          {validRanges.map((rangeOption) => (
            <Button
              key={rangeOption.value}
              variant={range === rangeOption.value ? "secondary" : "ghost"}
              size="sm"
              className="text-xs h-7 px-2"
              onClick={() => {
                const searchParam = new URLSearchParams();
                searchParam.set("range", rangeOption.value);
                router.replace(`${pathname}?${searchParam.toString()}`);
              }}
            >
              {rangeOption.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-72 w-full">
        {error ? (
          <ChartError />
        ) : isChartLoading ? (
          <div className="flex items-center justify-center h-full">
            <Skeleton className="h-full w-full" />
          </div>
        ) : chartData?.waiting ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-gray-600">
              {
                "We're processing your data. We'll reach out to you soon with the results."
              }
            </p>
          </div>
        ) : chartData?.data ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData.data.slice(
                -parseInt(range?.split("d")[0] || "7")
              )}
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
                dataKey="value"
                tickFormatter={(value) => `$${value}`}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
                width={60}
              />
              <Tooltip formatter={(value) => [`$${value}`, "Value"]} />
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
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-600">No chart data available.</p>
          </div>
        )}
      </div>
    </div>
  );
};
