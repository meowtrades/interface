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
import { ActiveStrategyAnalytics } from "@/api";
import { cn, getProfitLossColor, formatCurrency, formatPercentage } from "@/lib/design-system";

export const PlanCard = (strategy: ActiveStrategyAnalytics) => {
  const profitLossValue = strategy.profit || 0;
  const profitLossPercentage = strategy.profitPercentage || 0;

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
            <span className="text-caption text-muted-foreground">
              Current Position
            </span>
            <span className="text-body font-medium text-foreground metric-display">
              {formatCurrency(strategy.currentValue)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-caption text-muted-foreground">
              Total Invested
            </span>
            <span className="text-body font-medium text-foreground metric-display">
              {formatCurrency(strategy.totalInvested)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-caption text-muted-foreground">
              Profit/Loss
            </span>
            <div className="text-right">
              <span className={cn(
                "text-body font-medium metric-display",
                getProfitLossColor(profitLossValue)
              )}>
                {profitLossValue >= 0 ? "+" : ""}{formatCurrency(profitLossValue)}
              </span>
              <div className={cn(
                "text-caption font-medium metric-display",
                getProfitLossColor(profitLossPercentage)
              )}>
                ({profitLossPercentage >= 0 ? "+" : ""}{formatPercentage(profitLossPercentage)})
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Link href={`/app/strategies/${strategy._id}`} className="w-full">
          <Button 
            variant="outline" 
            className="w-full font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
