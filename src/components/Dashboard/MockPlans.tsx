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
import { PlanCard } from "./PlanCard";

const MockPlans = () => {
  const { data: activeStrategiesAnalytics, isLoading } = useQuery({
    queryKey: ["activeStrategiesAnalytics", "mock"],
    queryFn: async () => {
      const { data } = await api.analytics.getActiveMockStrategies();
      return data.data;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Paper Trades</h2>
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
        ) : activeStrategiesAnalytics?.length > 0 ? (
          activeStrategiesAnalytics.map((strategy) => {
            return <PlanCard key={strategy._id} {...strategy} />;
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
