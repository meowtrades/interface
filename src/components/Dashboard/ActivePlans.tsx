/** @format */

import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { PlanCard } from "./PlanCard";

const ActivePlans = () => {
  const { data: activeStrategiesAnalytics, isLoading } = useQuery({
    queryKey: ["activeStrategiesAnalytics", "real"],
    queryFn: async () => {
      const { data } = await api.analytics.getActiveLiveStrategies();
      return data.data;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Live Strategies</h2>
        <Link
          to="/app/strategies?tab=active"
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
          activeStrategiesAnalytics.map((strategy) => (
            <PlanCard key={strategy._id} {...strategy} />
          ))
        ) : (
          <Card className="border-dashed border-2 border-slate-200 shadow-sm">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
              <div className="h-14 w-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <Zap size={24} />
              </div>
              <h3 className="text-lg font-medium mb-3">
                Start Your First Strategy
              </h3>
              <p className="text-slate-500 mb-5">
                Choose from our range of automated trading strategies to start
                investing with just one click.
              </p>
              <Link to="/app/strategies">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Explore Strategies
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ActivePlans;
