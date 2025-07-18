/** @format */

import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { cn, formatCurrency } from "@/lib/design-system";

const RecentActivities = () => {
  const { data: activities } = useQuery({
    queryKey: ["recentActivities"],
    queryFn: async () => {
      // Simulate an API call
      return (await api.analytics.getActivities()).data.data;
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
        <Link
          href="/app/history"
          className="text-primary hover:text-primary/80 text-caption font-medium flex items-center gap-1 transition-colors"
        >
          View all <ArrowRight size={16} />
        </Link>
      </div>

      <Card className="border border-border bg-card hover:shadow-card-hover transition-shadow duration-200">
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {activities.map((activity) => {
              // Format the date
              activity.createdAt = Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(activity.createdAt));

              const isBuy = activity.type === "swap";

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
                        Buy {activity.to.token}
                      </div>
                      <div className="text-caption text-muted-foreground">
                        {activity.createdAt}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-body font-medium text-foreground">
                      {activity.from.token}
                    </div>
                    <div className="text-caption text-muted-foreground metric-display">
                      {formatCurrency(activity.invested)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentActivities;
