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

export const PlanCard = (strategy: ActiveStrategyAnalytics) => {
  return (
    <Card key={strategy._id} className="shadow-sm">
      <CardHeader className="pb-2 pt-4 px-5">
        <div className="flex items-center justify-between">
          <div>
            <CardDescription>{strategy.strategyTemplate.name}</CardDescription>
            <CardTitle className="text-xl">{strategy.token.symbol}</CardTitle>
          </div>
          <div className="px-3 py-1 rounded-full text-white text-xs font-medium bg-blue-600">
            {strategy.strategyTemplate.id}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-3">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 text-sm">Current Position</span>
            <span className="font-medium">
              ${strategy.currentValue.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 text-sm">Total Invested</span>
            <span className="font-medium">
              ${strategy.totalInvested.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 text-sm">Profit/Loss</span>
            <span
              className={`font-medium ${
                strategy.profit > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {strategy.profit > 0 ? "+" : "-"}$
              {Math.abs(strategy.profit).toFixed(2)} (
              {strategy.profitPercentage.toFixed(2)}%)
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-5 pt-0 pb-4">
        <Link
          href={`/app/strategies/${strategy._id}`}
          className="w-full"
        >
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
