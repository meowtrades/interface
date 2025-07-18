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
import { cn, getProfitLossColor, formatCurrency, formatPercentage } from "@/lib/design-system";

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border border-border bg-card">
            <CardHeader className="pb-3">
              <Skeleton className="h-4 w-28 mb-2" />
              <Skeleton className="h-8 w-32" />
            </CardHeader>
            <CardContent className="pb-6">
              <Skeleton className="h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const profitLossValue = overview?.profitLossPercentage || 0;
  const totalProfitLoss = overview?.totalProfitLoss || 0;

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-title font-semibold text-foreground mb-2">
          Portfolio Overview
        </h2>
        <p className="text-caption text-muted-foreground">
          Your current portfolio performance and key metrics
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Portfolio Value */}
        <Card className="border border-border bg-card hover:shadow-card-hover transition-shadow duration-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-overline text-muted-foreground">
              Total Portfolio Value
            </CardDescription>
            <CardTitle className="text-title font-semibold text-foreground metric-display">
              {formatCurrency(overview?.totalPortfolioValue || 0)}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className={cn(
              "flex items-center gap-2 text-caption font-medium",
              getProfitLossColor(profitLossValue)
            )}>
              {profitLossValue >= 0 ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <span className="metric-display">
                {profitLossValue >= 0 ? '+' : ''}{formatPercentage(profitLossValue)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Total Invested */}
        <Card className="border border-border bg-card hover:shadow-card-hover transition-shadow duration-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-overline text-muted-foreground">
              Total Invested
            </CardDescription>
            <CardTitle className="text-title font-semibold text-foreground metric-display">
              {formatCurrency(overview?.totalInvested || 0)}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="text-caption text-muted-foreground">
              Across all strategies
            </div>
          </CardContent>
        </Card>

        {/* Total Profit/Loss */}
        <Card className="border border-border bg-card hover:shadow-card-hover transition-shadow duration-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-overline text-muted-foreground">
              Total Profit/Loss
            </CardDescription>
            <CardTitle className={cn(
              "text-title font-semibold metric-display",
              getProfitLossColor(totalProfitLoss)
            )}>
              {totalProfitLoss >= 0 ? "+" : ""}
              {formatCurrency(totalProfitLoss)}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className={cn(
              "flex items-center gap-2 text-caption font-medium",
              getProfitLossColor(profitLossValue)
            )}>
              {profitLossValue >= 0 ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <span className="metric-display">
                {profitLossValue >= 0 ? '+' : ''}{formatPercentage(profitLossValue)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Active Strategies */}
        <Card className="border border-border bg-card hover:shadow-card-hover transition-shadow duration-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-overline text-muted-foreground">
              Active Strategies
            </CardDescription>
            <CardTitle className="text-title font-semibold text-foreground metric-display">
              {overview?.activeStrategies?.total || 0}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="text-caption text-muted-foreground">
              {overview?.activeStrategies?.mock || 0} mock trades
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PortfolioOverview;
