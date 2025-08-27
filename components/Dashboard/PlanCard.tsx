/** @format */

import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { ActiveStrategyAnalytics, useStopDcaPlan } from "@/api";
import { cn, getProfitLossColor, formatCurrency, formatPercentage } from "@/lib/design-system";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const PlanCard = (strategy: ActiveStrategyAnalytics) => {
  const profitLossValue = strategy.profit || 0;
  const profitLossPercentage = strategy.profitPercentage || 0;

  const stopDcaPlanMutation = useStopDcaPlan();
  const queryClient = useQueryClient();

  const handleStopPlan = async () => {
    try {
      await stopDcaPlanMutation.mutateAsync(strategy._id);

      toast.success("Plan Stopped Successfully", {
        description: "Your strategy has been stopped.",
        duration: 5000,
      });

      // Invalidate queries so UI updates instantly
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["activeStrategiesAnalytics", "real"] }),
        queryClient.invalidateQueries({ queryKey: ["user", "analytics", "overview"] }),
        queryClient.invalidateQueries({ queryKey: ["recentActivities"] }),
      ]);
    } catch (err) {
      console.error("Failed to stop plan:", err);
      toast.error("Failed to stop plan", {
        description: "Please try again later or contact support.",
        duration: 5000,
      });
    }
  };

  return (
    <Card className="border border-border bg-card hover:shadow-card-hover transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardDescription className="text-overline text-muted-foreground mb-1">
              {strategy.strategyTemplate.name}
            </CardDescription>
            <CardTitle className="text-title font-semibold text-foreground">
              {strategy.token.symbol}
            </CardTitle>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-overline font-medium">
            {strategy.strategyTemplate.id}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-caption text-muted-foreground">Current Position</span>
            <span className="text-body font-medium text-foreground metric-display">
              {formatCurrency(strategy.currentValue)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-caption text-muted-foreground">Total Invested</span>
            <span className="text-body font-medium text-foreground metric-display">
              {formatCurrency(strategy.totalInvested)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-caption text-muted-foreground">Profit/Loss</span>
            <div className="text-right">
              <span
                className={cn(
                  "text-body font-medium metric-display",
                  getProfitLossColor(profitLossValue)
                )}
              >
                {profitLossValue >= 0 ? "+" : ""}
                {formatCurrency(profitLossValue)}
              </span>
              <div
                className={cn(
                  "text-caption font-medium metric-display",
                  getProfitLossColor(profitLossPercentage)
                )}
              >
                ({profitLossPercentage >= 0 ? "+" : ""}
                {formatPercentage(profitLossPercentage)})
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Link href={`/app/strategies/${strategy._id}`} className="w-full">
          <Button 
            variant="outline" 
            className="w-full font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            View Details
          </Button>
        </Link>

        <Button
          variant="destructive"
          className="w-full"
          onClick={handleStopPlan}
          disabled={stopDcaPlanMutation.isPending}
        >
          {stopDcaPlanMutation.isPending ? "Stopping..." : "Stop"}
        </Button>
      </CardFooter>
    </Card>
  );
};
