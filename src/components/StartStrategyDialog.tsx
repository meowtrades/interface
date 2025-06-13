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
import { RefreshCw, Grid, TrendingUp, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
  onStartStrategy: (data: {
    strategyId: string;
    tokenId: string;
    amount: number;
    frequency: Frequency;
    riskLevel?: RiskLevel;
  }) => Promise<void>;
}

const StartStrategyDialog = ({
  loading,
  strategy,
  open,
  onClose,
  defaultToken = "inj",
  onStartStrategy,
}: StartStrategyDialogProps) => {
  const [tokenId, setTokenId] = useState(defaultToken);
  const [amount, setAmount] = useState("1000");
  const [frequency, setFrequency] = useState(Frequency.DAILY);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(RiskLevel.MEDIUM_RISK);

  // Reset form when strategy changes
  useEffect(() => {
    if (strategy) {
      setTokenId(defaultToken);
      setAmount("1000");
      setFrequency(Frequency.DAILY);
      setRiskLevel(RiskLevel.MEDIUM_RISK);
    }
  }, [strategy, defaultToken]);

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
        return 12.5;
      case RiskLevel.LOW_RISK:
        return 37.5;
      case RiskLevel.MEDIUM_RISK:
        return 62.5;
      case RiskLevel.HIGH_RISK:
        return 87.5;
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

    // Start the strategy
    await onStartStrategy({
      strategyId: strategy.id,
      tokenId,
      amount: amountNum,
      frequency,
      ...(strategy.type === "dca" ? { riskLevel } : {}),
    });

    // toast.success(`${strategy.name} started successfully!`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
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
                  {strategy.minInvestment[strategy.supportedChains[0]] || 10}
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

            {/* Risk level slider for Smart DCA strategy */}
            {strategy.type === "dca" && (
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
            )}
          </div>

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
          <Button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? <Loader2 className="animate-spin" /> : "One Click Start"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StartStrategyDialog;
