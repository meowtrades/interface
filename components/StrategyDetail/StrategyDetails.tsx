/** @format */

import { Grid, RefreshCw, TrendingUp, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatFrequency } from "@/lib/utils";
import { UserStrategy } from "./types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { api } from "@/api";

// Calculate next execution time based on frequency and last execution
const getNextExecutionTime = (
  createdAt: string,
  lastExecutionTime: string | null,
  frequency: string
): string => {
  const baseTime = lastExecutionTime
    ? new Date(lastExecutionTime)
    : new Date(createdAt);

  let nextTime = new Date(baseTime);

  switch (frequency.toLowerCase()) {
    case "daily":
      nextTime.setDate(nextTime.getDate() + 1);
      break;
    case "weekly":
      nextTime.setDate(nextTime.getDate() + 7);
      break;
    case "monthly":
      nextTime.setMonth(nextTime.getMonth() + 1);
      break;
    case "hourly":
      nextTime.setHours(nextTime.getHours() + 1);
      break;
    case "minute":
      nextTime.setMinutes(nextTime.getMinutes() + 1);
      break;
    default:
      nextTime.setDate(nextTime.getDate() + 1);
  }

  const now = new Date();
  if (nextTime < now) {
    return "Pending execution";
  }

  const diff = nextTime.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `In ${days} day${days > 1 ? "s" : ""}`;
  } else if (hours > 0) {
    return `In ${hours} hour${hours > 1 ? "s" : ""} ${minutes > 0 ? `${minutes}m` : ""}`;
  } else if (minutes > 0) {
    return `In ${minutes} minute${minutes > 1 ? "s" : ""}`;
  } else {
    return "Soon";
  }
};

export const StrategyDetails = () => {
  const { id: rawStrategyId } = useParams();
  const strategyId = Array.isArray(rawStrategyId)
    ? rawStrategyId[0]
    : rawStrategyId;

  const { data: userStrategy } = useQuery<UserStrategy>({
    queryKey: ["userStrategy", strategyId],
    queryFn: async () => {
      if (!strategyId) throw new Error("Strategy ID is required");
      // const url = `/user/analytics/strategies/${strategyId}`;
      const {
        data: { data },
      } = await api.strategies.getDetails(strategyId);
      return data;
    },
  });

  // Get the proper icon based on strategy type
  const getStrategyIcon = () => {
    const type = userStrategy?.strategyTemplate?.type || "dca";
    if (type === "grid") return <Grid size={18} />;
    if (type === "momentum") return <TrendingUp size={18} />;
    return <RefreshCw size={18} />;
  };

  // Return early if userStrategy is not loaded yet
  if (!userStrategy) {
    return (
      <div className="bg-white rounded-lg p-5 shadow-sm">
        <h3 className="font-medium text-lg mb-4">Strategy Details</h3>
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-5 shadow-sm">
      <h3 className="font-medium text-lg mb-4">Strategy Details</h3>
      <div className="space-y-4">
        <div>
          <h4 className="text-sm text-slate-500 mb-2">Strategy Type</h4>
          <div className="flex items-center gap-2">
            {getStrategyIcon()}
            <span className="font-medium">
              {userStrategy.strategyTemplate?.name}
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-sm text-slate-500 mb-2">Asset</h4>
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {userStrategy.token.name} ({userStrategy.token.symbol})
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-sm text-slate-500 mb-2">Network</h4>
          <span className="font-medium">{userStrategy.chain}</span>
        </div>

        <div>
          <h4 className="text-sm text-slate-500 mb-2">Started On</h4>
          <span className="font-medium">
            {new Date(userStrategy.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })}
          </span>
        </div>

        {userStrategy.status === "active" && (
          <div>
            <h4 className="text-sm text-slate-500 mb-2">Next Execution</h4>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-blue-600" />
              <span className="font-medium text-blue-600">
                {getNextExecutionTime(
                  userStrategy.createdAt,
                  userStrategy.lastExecutionTime || null,
                  userStrategy.frequency
                )}
              </span>
            </div>
          </div>
        )}

        <div>
          <h4 className="text-sm text-slate-500 mb-2">Strategy Settings</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Investment Duration:</span>
              <span className="font-medium">
                {formatFrequency(userStrategy.frequency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Investment Amount:</span>
              <span className="font-medium">
                ${userStrategy.initialAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <Separator className="my-2" />

        <div>
          <h4 className="text-sm text-slate-500 mb-2">Description</h4>
          <p className="text-sm text-slate-700">
            {userStrategy.strategyTemplate?.description}
          </p>
        </div>
      </div>
    </div>
  );
};
