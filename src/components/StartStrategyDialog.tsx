/** @format */

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Strategy, Frequency, RiskLevel } from "@/lib/types";
import {
  RefreshCw,
  Grid,
  TrendingUp,
  TrendingUp as TrendingUpIcon,
} from "lucide-react";
import { toast } from "sonner";
import { FrequencyOption } from "@/api";
import WalletPicker from "./WalletPicker";
import { useSearchParams } from "react-router-dom";

// Color map for strategy types
const ColorMap: Record<string, { bg: string; text: string }> = {
  dca: { bg: "bg-blue-100", text: "text-crypto-blue" },
  grid: { bg: "bg-purple-100", text: "text-crypto-purple" },
  momentum: { bg: "bg-amber-100", text: "text-amber-600" },
  custom: { bg: "bg-green-100", text: "text-green-600" },
};

// Icon map for strategy types
const IconMap: Record<string, React.ReactNode> = {
  RefreshCw: <RefreshCw size={20} />,
  Grid: <Grid size={20} />,
  TrendingUp: <TrendingUp size={20} />,
};

// Frequency options
const frequencyOptions = [
  { value: Frequency.DAILY, label: "Daily" },
  { value: Frequency.WEEKLY, label: "Weekly" },
  { value: Frequency.MONTHLY, label: "Monthly" },
  { value: Frequency.TEST_MINUTE, label: "Test Minute" },
  { value: Frequency.TEST_10_SECONDS, label: "Test 10 Seconds" },
];

interface StartStrategyDialogProps {
  loading: boolean;
  strategy: Strategy;
  open: boolean;
  onClose: () => void;
  defaultToken?: string;
  supportedChains: string[];
  onStartStrategy: (data: {
    strategyId: string;
    tokenId: string;
    amount: number;
    slippage: number;
    frequency: FrequencyOption;
    chain: string;
    riskLevel?: RiskLevel;
  }) => Promise<void>;
}

const StartStrategyDialog = ({
  loading,
  strategy,
  open,
  onClose,
  defaultToken = "inj",
  supportedChains,
  onStartStrategy,
}: StartStrategyDialogProps) => {
  const [tokenId, setTokenId] = useState(defaultToken);
  const [amount, setAmount] = useState("1000");
  const [frequency, setFrequency] = useState(Frequency.DAILY);
  const [chain, setChain] = useState("injective"); // Default to TEST_MINUTE for simplicity
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(RiskLevel.MEDIUM_RISK);
  const [slippage, setSlippage] = useState(-1); // Default to -1 for auto slippage
  const [showSuccess, setShowSuccess] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  // Reset form when strategy changes
  useEffect(() => {
    if (strategy) {
      setTokenId(defaultToken);
      setAmount("1000");
      setFrequency(Frequency.DAILY);
      setRiskLevel(RiskLevel.MEDIUM_RISK);
      setShowSuccess(false);
    }
  }, [strategy, defaultToken]);

  // Reset success state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setShowSuccess(false);
    }
  }, [open]);

  // Get color scheme based on strategy type
  const colorScheme = ColorMap[strategy.type] || {
    bg: "bg-gray-100",
    text: "text-gray-600",
  };

  // Convert slider value to RiskLevel enum
  const sliderValueToRiskLevel = (value: number): RiskLevel => {
    if (value < 25) return RiskLevel.NO_RISK;
    if (value < 50) return RiskLevel.LOW_RISK;
    if (value < 75) return RiskLevel.MEDIUM_RISK;
    return RiskLevel.HIGH_RISK;
  };

  // Convert RiskLevel enum to slider value
  const riskLevelToSliderValue = (riskLevel: RiskLevel): number => {
    switch (riskLevel) {
      case RiskLevel.NO_RISK:
        return 0;
      case RiskLevel.LOW_RISK:
        return 33;
      case RiskLevel.MEDIUM_RISK:
        return 66;
      case RiskLevel.HIGH_RISK:
        return 100;
      default:
        return 62.5;
    }
  };

  // Get display name for risk level
  const getRiskLevelDisplayName = (riskLevel: RiskLevel): string => {
    switch (riskLevel) {
      case RiskLevel.NO_RISK:
        return "No Risk";
      case RiskLevel.LOW_RISK:
        return "Conservative";
      case RiskLevel.MEDIUM_RISK:
        return "Moderate";
      case RiskLevel.HIGH_RISK:
        return "Aggressive";
      default:
        return "Moderate";
    }
  };
  const handleSubmit = async () => {
    // Validate amount
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    try {
      // Start the strategy
      await onStartStrategy({
        strategyId: strategy.id,
        tokenId,
        chain,
        amount: amountNum,
        frequency,
        slippage, // Default to -1 for auto slippage
        riskLevel,
      }); // Show success toast
      toast.success("🎉 Strategy successfully activated!", {
        description: `Your ${strategy.name} strategy is now running with $${amountNum} investment.`,
        duration: 4000,
      });

      // Add a small delay to make the transition feel natural
      setTimeout(() => {
        setShowSuccess(true);
      }, 500);
    } catch (error) {
      // Handle error - success state won't show
      console.error("Strategy creation failed:", error);
      toast.error("Failed to activate strategy. Please try again.");
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose();
    setSearchParams({
      tab: "active",
    });
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        {showSuccess ? ( // Success State
          <>
            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                🎉 Strategy Activated!
              </DialogTitle>
              <DialogDescription className="text-base text-gray-600">
                Congratulations! Your{" "}
                <span className="font-semibold text-green-600">
                  {strategy.name}
                </span>{" "}
                strategy is now running and will start executing trades
                automatically.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUpIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-800">
                      ${amount} USD Investment
                    </h3>
                    <p className="text-sm text-green-600">
                      {getRiskLevelDisplayName(riskLevel)} risk •{" "}
                      {frequency.charAt(0).toUpperCase() + frequency.slice(1)}{" "}
                      frequency
                    </p>
                  </div>
                </div>

                <div className="border-t border-green-200 pt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-green-600 font-medium">Token:</span>
                      <p className="text-green-800">{tokenId.toUpperCase()}</p>
                    </div>
                    <div>
                      <span className="text-green-600 font-medium">Chain:</span>
                      <p className="text-green-800">
                        {chain
                          .split("-")
                          .map(
                            (item) =>
                              item.charAt(0).toUpperCase() + item.slice(1)
                          )
                          .join(" ")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <TrendingUpIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800 mb-1">
                      What's Next?
                    </h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>
                        • Your strategy will execute trades based on market
                        conditions
                      </li>
                      <li>• Track performance in your dashboard</li>
                      <li>• Receive notifications for major updates</li>
                      <li>• Earn PawScore rewards for successful trades!</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleSuccessClose}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium"
              >
                View My Strategies
              </Button>
            </DialogFooter>
          </>
        ) : (
          // Original Form State
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full ${colorScheme.bg} ${colorScheme.text} flex items-center justify-center`}
                >
                  {IconMap[strategy.icon as keyof typeof IconMap] || (
                    <RefreshCw size={16} />
                  )}
                </div>
                <DialogTitle>Start {strategy.name}</DialogTitle>
              </div>
              <DialogDescription>
                Configure your strategy settings to begin automated trading.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="investment">Investment Amount (USD)</Label>
                  <Input
                    id="investment"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="10"
                    step="10"
                  />
                  {strategy.minInvestment && (
                    <p className="text-xs text-slate-500 mt-1">
                      Minimum investment: $
                      {strategy.minInvestment[strategy.supportedChains[0]] ||
                        10}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select
                    value={frequency}
                    onValueChange={(value) => setFrequency(value as Frequency)}
                  >
                    <SelectTrigger id="frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Frequency</SelectLabel>
                        {frequencyOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className={"flex gap-4"}>
                  <div className={"w-1/3"}>
                    <Label htmlFor="token">Token</Label>
                    <Select value={tokenId} onValueChange={setTokenId}>
                      <SelectTrigger id="token">
                        <SelectValue placeholder="Select token" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Tokens</SelectLabel>
                          {strategy.supportedTokens.map((token) => (
                            <SelectItem key={token} value={token}>
                              {token.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className={"w-2/3"}>
                    <Label htmlFor="chain">Chain</Label>
                    <Select
                      value={chain}
                      onValueChange={(value) => setChain(value)}
                    >
                      <SelectTrigger id="frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Chains</SelectLabel>
                          {supportedChains.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option
                                .split("-")
                                .map(
                                  (item) =>
                                    item.charAt(0).toUpperCase() + item.slice(1)
                                )
                                .join(" ")}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Risk level slider for Smart DCA strategy */}
                {
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="risk-level">Risk Level</Label>
                      <span className="text-sm font-medium">
                        {getRiskLevelDisplayName(riskLevel)}
                      </span>
                    </div>
                    <Slider
                      id="risk-level"
                      min={0}
                      max={100}
                      step={1}
                      value={[riskLevelToSliderValue(riskLevel)]}
                      onValueChange={(values) =>
                        setRiskLevel(sliderValueToRiskLevel(values[0]))
                      }
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Lower Risk</span>
                      <span>Higher Risk</span>
                    </div>
                  </div>
                }

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="slippage">Slippage Tolerance (%)</Label>
                    <span className="text-sm font-medium">
                      {slippage === -1 ? "Auto Slippage" : `${slippage}%`}
                    </span>
                  </div>
                  <Slider
                    id="slippage"
                    min={-1}
                    max={10}
                    step={1}
                    value={[slippage]}
                    onValueChange={(values) => setSlippage(values[0])}
                    className="py-4"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {slippage === -1 &&
                      "Auto slippage will be applied based on risk level."}
                  </p>
                </div>
              </div>{" "}
              <div className="bg-amber-50 p-4 rounded-lg text-amber-800 text-sm">
                <p className="font-medium mb-1">Important Note</p>
                <p>
                  Past performance does not guarantee future results. Your
                  investment may lose value.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <WalletPicker callback={handleSubmit} />
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StartStrategyDialog;
