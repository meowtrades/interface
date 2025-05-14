/** @format */

import { Link } from "react-router-dom";
import { ArrowRight, Grid } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";

const MockPlans = () => {
  const { data: activeStrategiesAnalytics, isLoading } = useQuery({
    queryKey: ["activeStrategiesAnalytics"],
    queryFn: async () => {
      const { data } = await api.analytics.getActiveStrategiesAnalytics();
      return data.data;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Mock Plans</h2>
        <Link
          to="/app/strategies"
          className="text-blue-600 text-sm flex items-center"
        >
          View all <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? (
          <>
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </>
        ) : activeStrategiesAnalytics?.mock.length > 0 ? (
          activeStrategiesAnalytics.mock.map((strategy) => {
            const isProfitable = strategy.profit >= 0;
            const profitPercentage =
              (strategy.profit / strategy.totalInvested) * 100;

            return (
              <Card key={strategy._id} className="shadow-sm">
                <CardHeader className="pb-2 pt-4 px-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardDescription>
                        {strategy.strategyTemplate.name}
                      </CardDescription>
                      <CardTitle className="text-xl">
                        {strategy.token.symbol}
                      </CardTitle>
                    </div>
                    <div className="px-3 py-1 rounded-full text-white text-xs font-medium bg-purple-600">
                      {strategy.strategyTemplate.id}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-3">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm">
                        Current Value
                      </span>
                      <span className="font-medium">
                        ${strategy.currentValue.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm">
                        Starting Value
                      </span>
                      <span className="font-medium">
                        ${strategy.totalInvested.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm">
                        Profit/Loss
                      </span>
                      <span
                        className={`font-medium ${
                          isProfitable ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {isProfitable ? "+" : "-"}$
                        {Math.abs(strategy.profit).toFixed(2)} (
                        {profitPercentage.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="px-5 pt-0 pb-4">
                  <Link
                    to={`/app/strategies/${strategy._id}`}
                    state={{
                      source: "dashboard",
                      strategyId: strategy._id,
                    }}
                    className="w-full"
                  >
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <Card className="border-dashed border-2 border-slate-200 shadow-sm">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
              <div className="h-14 w-14 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <Grid size={24} />
              </div>
              <h3 className="text-lg font-medium mb-3">
                Start Your First Mock Strategy
              </h3>
              <p className="text-slate-500 mb-5">
                Try out our strategies in mock mode to test your trading
                strategies risk-free.
              </p>
              <Link to="/app/strategies">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Explore Mock Strategies
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MockPlans;
