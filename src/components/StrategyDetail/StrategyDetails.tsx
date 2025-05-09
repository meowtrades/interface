/** @format */

import { Grid, RefreshCw, TrendingUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatFrequency } from "@/lib/utils";
import { UserStrategy } from "./types";

interface StrategyDetailsProps {
  userStrategy: UserStrategy;
}

export const StrategyDetails = ({ userStrategy }: StrategyDetailsProps) => {
  console.log(userStrategy);
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
          <span className="font-medium">Injective</span>
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
            {userStrategy.strategyTemplate?.type === "grid"
              ? "Grid trading automatically places buy and sell orders at predetermined price levels, capturing profit from price oscillations."
              : userStrategy.strategyTemplate?.type === "momentum"
              ? "Momentum trading capitalizes on market trends by buying assets that have recently shown upward price movement."
              : "DCA reduces the impact of volatility by investing fixed amounts at regular intervals, regardless of asset price."}
          </p>
        </div>
      </div>
    </div>
  );
};
