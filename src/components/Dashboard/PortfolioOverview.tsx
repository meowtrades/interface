/** @format */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/api";

const PortfolioOverview = () => {
  const { data: overview, isLoading } = useQuery({
    queryKey: ["overview"],
    queryFn: async () => {
      const response = await axiosInstance.get("/user/analytics/overview");
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="shadow-sm">
            <CardHeader className="pb-2 pt-4 px-5">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-24" />
            </CardHeader>
            <CardContent className="pb-4 px-5">
              <Skeleton className="h-4 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      <Card className="shadow-sm">
        <CardHeader className="pb-2 pt-4 px-5">
          <CardDescription>Total Portfolio Value</CardDescription>
          <CardTitle className="text-2xl">
            ${overview?.totalPortfolioValue.toFixed(2)}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4 px-5">
          <div
            className={`flex items-center gap-1 text-sm ${
              overview?.profitLossPercentage >= 0
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {overview?.profitLossPercentage >= 0 ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            <span>{overview?.profitLossPercentage.toFixed(2)}%</span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="pb-2 pt-4 px-5">
          <CardDescription>Total Invested</CardDescription>
          <CardTitle className="text-2xl">
            ${overview?.totalInvested.toFixed(2)}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4 px-5">
          <div className="text-sm text-slate-500">Across all strategies</div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="pb-2 pt-4 px-5">
          <CardDescription>Total Profit/Loss</CardDescription>
          <CardTitle
            className={`text-2xl ${
              overview?.profitLossPercentage >= 0
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {overview?.profitLossPercentage >= 0 ? "+" : "-"}$
            {Math.abs(overview?.totalProfitLoss).toFixed(2)}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4 px-5">
          <div
            className={`flex items-center gap-1 text-sm ${
              overview?.profitLossPercentage >= 0
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {overview?.profitLossPercentage >= 0 ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            <span>{overview?.profitLossPercentage.toFixed(2)}%</span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="pb-2 pt-4 px-5">
          <CardDescription>Active Strategies</CardDescription>
          <CardTitle className="text-2xl">
            {overview?.activeStrategies.total}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4 px-5">
          <div className="text-sm text-slate-500">
            {overview?.activeStrategies.mock} mock trades
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioOverview;
