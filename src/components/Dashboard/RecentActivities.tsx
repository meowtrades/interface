/** @format */

import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const RecentActivities = () => {
  // Mock data - in a real app, this would come from an API
  const activities = [
    {
      id: "act1",
      type: "Buy",
      token: "INJ",
      amount: "2.5 INJ",
      value: "$12.75",
      time: "2 hours ago",
    },
    {
      id: "act2",
      type: "Sell",
      token: "INJ",
      amount: "3.8 INJ",
      value: "$38.76",
      time: "5 hours ago",
    },
    {
      id: "act3",
      type: "Buy",
      token: "USDT",
      amount: "100 USDT",
      value: "$100.00",
      time: "1 day ago",
    },
  ];

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Recent Activities</h2>
        <Link
          to="/app/history"
          className="text-blue-600 text-sm flex items-center"
        >
          View all <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="divide-y">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-5"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center ${
                      activity.type === "Buy"
                        ? "bg-green-100 text-green-600"
                        : "bg-amber-100 text-amber-600"
                    }`}
                  >
                    {activity.type === "Buy" ? (
                      <TrendingUp size={20} />
                    ) : (
                      <TrendingDown size={20} />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">
                      {activity.type} {activity.token}
                    </div>
                    <div className="text-xs text-slate-500">
                      {activity.time}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{activity.amount}</div>
                  <div className="text-xs text-slate-500">{activity.value}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentActivities;
