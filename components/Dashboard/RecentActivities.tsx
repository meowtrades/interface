/** @format */

import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";

const RecentActivities = () => {
  // Mock data - in a real app, this would come from an API
  // const activities = [
  //   {
  //     id: "act1",
  //     type: "Buy",
  //     token: "INJ",
  //     amount: "2.5 INJ",
  //     value: "$12.75",
  //     time: "2 hours ago",
  //   },
  //   {
  //     id: "act2",
  //     type: "Sell",
  //     token: "INJ",
  //     amount: "3.8 INJ",
  //     value: "$38.76",
  //     time: "5 hours ago",
  //   },
  //   {
  //     id: "act3",
  //     type: "Buy",
  //     token: "USDT",
  //     amount: "100 USDT",
  //     value: "$100.00",
  //     time: "1 day ago",
  //   },
  // ];
  const { data: activities } = useQuery({
    queryKey: ["recentActivities"],
    queryFn: async () => {
      // Simulate an API call
      return (await api.analytics.getActivities()).data.data;
    },
  });

  if (!activities) {
    return (
      <Card className="shadow-sm">
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
    <div className="mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Recent Activities</h2>
        <Link
          href="/app/history"
          className="text-blue-600 text-sm flex items-center"
        >
          View all <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="divide-y">
            {activities.map((activity) => {
              // Format the date
              activity.createdAt = Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(activity.createdAt));

              // console.log(activity);

              return (
                <div
                  key={activity._id}
                  className="flex items-center justify-between p-5"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center ${
                        activity.type === "swap"
                          ? "bg-green-100 text-green-600"
                          : "bg-amber-100 text-amber-600"
                      }`}
                    >
                      {activity.type === "swap" ? (
                        <TrendingUp size={20} />
                      ) : (
                        <TrendingDown size={20} />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">
                        Buy {activity.to.token}{" "}
                      </div>
                      <div className="text-xs text-slate-500">
                        {activity.createdAt}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{activity.from.token}</div>
                    <div className="text-xs text-slate-500">
                      ${activity.invested}
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
