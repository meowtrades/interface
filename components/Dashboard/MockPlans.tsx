/** @format */

import Link from "next/link";
import { ArrowRight, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-title font-semibold text-foreground mb-2">
            Paper Trades
          </h2>
          <p className="text-caption text-muted-foreground">
            Practice trading strategies without real money
          </p>
        </div>
        <Link
          href="/app/strategies?tab=paper"
          className="text-primary hover:text-primary/80 text-caption font-medium flex items-center gap-1 transition-colors"
        >
          View all <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="border border-border bg-card">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-32 mb-4" />
                  <Skeleton className="h-8 w-24 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : activeStrategiesAnalytics && activeStrategiesAnalytics.length > 0 ? (
          activeStrategiesAnalytics.map((strategy) => {
            return <PlanCard key={strategy._id} {...strategy} />;
          })
        ) : (
          <Card className="border-2 border-dashed border-border bg-card hover:shadow-card-hover transition-shadow duration-200">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[280px]">
              <div className="h-16 w-16 rounded-full bg-secondary text-primary flex items-center justify-center mb-6">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-subtitle font-semibold text-foreground mb-3">
                Start Your First Mock Strategy
              </h3>
              <p className="text-body text-muted-foreground mb-6 max-w-sm leading-relaxed">
                Try out our strategies in mock mode to test your trading
                strategies risk-free.
              </p>
              <Link href="/app/strategies">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-card transition-all duration-200 hover:shadow-card-hover">
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
