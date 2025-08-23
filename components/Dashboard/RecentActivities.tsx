/** @format */

import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { cn } from "@/lib/design-system";

const RecentActivities = () => {
  const { data: activities } = useQuery({
    queryKey: ["recentActivities"],
    queryFn: async () => {
      // Simulate an API call
      return (await api.analytics.getUserActivities()).data.data;
    },
  });

  if (!activities) {
    return (
      <Card className="border border-border bg-card">
        <CardContent className="p-6">
          <Skeleton className="h-6 w-1/3 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-title font-semibold text-foreground mb-2">
            Recent Activities
          </h2>
          <p className="text-caption text-muted-foreground">
            Your latest trading activities and transactions
          </p>
        </div>
        {/* <Link
          href="/app/history"
          className="text-primary hover:text-primary/80 text-caption font-medium flex items-center gap-1 transition-colors"
        >
          View all <ArrowRight size={16} />
        </Link> */}
      </div>

      {activities.length === 0 ? (
        <Card className="border-2 border-dashed border-border bg-card hover:shadow-card-hover transition-shadow duration-200">
          <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
            <div className="h-16 w-16 rounded-full bg-secondary text-primary flex items-center justify-center mb-6">
              <Activity size={24} />
            </div>
            <h3 className="text-subtitle font-semibold text-foreground mb-3">
              No Recent Activities
            </h3>
            <p className="text-body text-muted-foreground mb-6 max-w-sm leading-relaxed">
              Start trading to see your recent activities and transactions here.
            </p>
            <Link href="/app/strategies">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-card transition-all duration-200 hover:shadow-card-hover">
                Start Trading
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-border bg-card hover:shadow-card-hover transition-shadow duration-200">
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {activities.map((activity) => {
                // Format the date
                const formattedDate = Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(activity.createdAt));

                const isBuy =
                  activity.type === "swap" || activity.type === "buy";

                return (
                  <div
                    key={activity._id}
                    className="flex items-center justify-between p-6 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center",
                          isBuy
                            ? "bg-success/10 text-success"
                            : "bg-warning/10 text-warning"
                        )}
                      >
                        {isBuy ? (
                          <TrendingUp size={20} />
                        ) : (
                          <TrendingDown size={20} />
                        )}
                      </div>
                      <div>
                        <div className="text-body font-medium text-foreground">
                          {/* {activity.} */}
                        </div>
                        <div className="text-caption text-muted-foreground">
                          {formattedDate}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-body font-medium text-foreground">
                        {activity.type}
                      </div>
                      <div className="text-caption text-muted-foreground metric-display">
                        {/* Display metadata if available */}
                        {activity.from.amount.toFixed(4) +
                          " " +
                          activity.from.token}{" "}
                        for{" "}
                        {activity.to.amount.toFixed(4) +
                          " " +
                          activity.to.token}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RecentActivities;
