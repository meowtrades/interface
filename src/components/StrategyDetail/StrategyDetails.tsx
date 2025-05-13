/** @format */

import { Grid, RefreshCw, TrendingUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatFrequency } from "@/lib/utils";
import { UserStrategy } from "./types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { api } from "@/api";

export const StrategyDetails = () => {
  const { strategyId } = useParams();
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
    const type = userStrategy.strategyTemplate?.type || "dca";
    if (type === "grid") return <Grid size={18} />;
    if (type === "momentum") return <TrendingUp size={18} />;
    return <RefreshCw size={18} />;
  };

  return (
    <div className="bg-white rounded-lg p-5 shadow-sm">
      <h3 className="font-medium text-lg mb-4">Strategy Details</h3>
      <div className="space-y-4">
        <div>
          <h4 className="text-sm text-slate-500 mb-2">Strategy Type</h4>
          <div className="flex items-center gap-2">
            {getStrategyIcon()}
            <span className="font-medium">
              {userStrategy.strategyTemplate.name}
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
              <span className="font-medium">${userStrategy.totalInvested}</span>
            </div>
          </div>
        </div>

        <Separator className="my-2" />

        <div>
          <h4 className="text-sm text-slate-500 mb-2">Description</h4>
          <p className="text-sm text-slate-700">
            {userStrategy.strategyTemplate.description}
          </p>
        </div>
      </div>
    </div>
  );
};
