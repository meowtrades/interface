/** @format */

"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Strategy, Frequency, RiskLevel } from "@/lib/types";
import type { Token } from "@/lib/types";
import {
  RefreshCw,
  Grid,
  TrendingUp,
  TrendingUp as TrendingUpIcon,
} from "lucide-react";
import { toast } from "sonner";
import { FrequencyOption } from "@/api";
import WalletPicker from "./WalletPicker";
import WalletAddressPicker from "./WalletAddressPicker";
import { MANAGEMENT_FEE } from "@/lib/constants";
import { validateInjecitveWalletAddress } from "@/lib/validate-address";
import { formatFrequency } from "@/lib/utils";
import { useStrategies } from "@/lib/context/StrategiesContext";

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
  { value: Frequency.TEST_MINUTE, label: "Minute" },
  { value: Frequency.TEST_10_SECONDS, label: "10 Seconds" },
];

// Get default investment amount based on strategy type
const getDefaultAmount = (strategy: Strategy): string => {
  switch (strategy.type) {
    case "dca":
      return "10";
    case "grid":
      return "100";
    case "momentum":
      return "50";
    case "custom":
      return "25";
    default:
      return "100";
  }
};

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
    recipientAddress?: string;
    riskLevel?: RiskLevel;
    selectedWallet?: string;
  }) => Promise<void>;
}

const StartStrategyDialog = ({
  strategy,
  open,
  onClose,
  defaultToken = "inj",
  supportedChains,
  onStartStrategy,
}: StartStrategyDialogProps) => {
  const [tokenId, setTokenId] = useState("inj");
  const [amount, setAmount] = useState(getDefaultAmount(strategy));
  const [frequency, setFrequency] = useState(Frequency.DAILY);
  const [recipientAddress, setRecipientAddress] = useState<string>();
  const [chain, setChain] = useState("injective"); // Default to TEST_MINUTE for simplicity
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(RiskLevel.MEDIUM_RISK);
  const [slippage, setSlippage] = useState(-1); // Default to -1 for auto slippage
  const [showSuccess, setShowSuccess] = useState(false);
  const [isRecipientAddressValid, setIsRecipientAddressValid] = useState(false);
  const [useMyAddress, setUseMyAddress] = useState(true); // Default checked

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { selectedChain } = useStrategies();

  // Reset form when strategy changes
  useEffect(() => {
    if (strategy) {
      setTokenId(defaultToken);
      setAmount(getDefaultAmount(strategy));
      setFrequency(Frequency.DAILY);
      setRiskLevel(RiskLevel.MEDIUM_RISK);
      setShowSuccess(false);
      setUseMyAddress(true); // Reset to default checked
      setRecipientAddress("");
      setIsRecipientAddressValid(false);
    }
  }, [strategy, defaultToken]);

  // Reset success state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setShowSuccess(false);
    }
  }, [open]);

  // Handle wallet address when using "my address"
  useEffect(() => {
    if (useMyAddress && chain) {
    } else if (!useMyAddress) {
      setRecipientAddress("");
      setIsRecipientAddressValid(false);
    }
  }, [useMyAddress, chain]);

  // On dialog open, set chain to wallet chain if connected (from localStorage or context).
  // Chain selector should be locked to wallet's chain if connected.
  // Token selector should show tokens for the current chain.
  useEffect(() => {
    const connectedChain = localStorage.getItem("connectedChain");
    if (connectedChain) {
      setChain(connectedChain);
    } else if (selectedChain) {
      setChain(selectedChain);
    }
  }, [selectedChain]);

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
  const handleSubmit = async (selectedWallet?: string) => {
    // Validate amount
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Validate recipient address for SDCA strategy
    if (strategy.id === "SDCA") {
      // Only validate if not using "my address" - when using "my address",
      // the wallet connection will provide the address
      if (!useMyAddress && (!recipientAddress || !isRecipientAddressValid)) {
        toast.error("Please enter a valid recipient address");
        return;
      }
    }

    try {
      // Start the strategy
      await onStartStrategy({
        strategyId: strategy.id,
        tokenId,
        chain,
        amount: amountNum,
        frequency,
        recipientAddress,
        slippage, // Default to -1 for auto slippage
        riskLevel,
        selectedWallet,
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

      if (error instanceof Error) {
        if (error.message.includes("USDT balance not found")) {
          toast.error("USDT not found", {
            description:
              "We couldn't find USDT in your wallet. Please deposit USDT and try again.",
            duration: 6000,
          });
          return;
        }

        // Check if it's an insufficient balance error
        if (error.message.includes("Insufficient USDT balance")) {
          const totalRequired = amountNum * (1 + MANAGEMENT_FEE);
          toast.error("Insufficient Balance", {
            description: `You need $${totalRequired.toFixed(
              2
            )} USDT (including ${(MANAGEMENT_FEE * 100).toFixed(
              1
            )}% management fee) to start this strategy. Please add funds to your wallet.`,
            duration: 6000,
          });
          return;
        }
      }

      toast.error("Failed to activate strategy. Please try again.");
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose();
    const params = new URLSearchParams(searchParams);
    params.set("tab", "active");
    router.push(`${pathname}?${params.toString()}`);
  };
  // Force tokens to INJ-only selection
  const filteredTokens: Token[] = [
    { id: "inj", symbol: "INJ", name: "Injective", icon: "/icons/injective.svg", chains: ["injective", "injective-evm"], decimals: 18 }
  ];

  // Get wallet chain from localStorage or context
  let walletChain: string | null = null;
  if (typeof window !== "undefined") {
    const savedWallet = localStorage.getItem("connectedWallet");
    if (savedWallet) {
      try {
        const parsed = JSON.parse(savedWallet);
        walletChain = parsed?.chain ?? null;
      } catch {
        // ignore corrupted localStorage entry
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] max-h-[85vh] overflow-y-auto bg-gradient-to-b from-white to-slate-50">
        {showSuccess ? ( // Success State
          <>
            {" "}
            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                🎉 Strategy Activated!
              </DialogTitle>
              <DialogDescription className="text-base text-gray-600">
                Congratulations! Your{" "}
                <span className="font-semibold text-green-600">
                  {strategy.name}
                </span>{" "}
                is now running and will start executing trades automatically.
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
                      {formatFrequency(frequency)} frequency
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
                      What&apos;s Next?
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
                <DialogTitle className="text-xl font-bold text-contrast-high">
                  Start {strategy.name}
                </DialogTitle>
              </div>
              <DialogDescription className="text-contrast-medium">
                Configure your strategy settings to begin automated trading.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-4">
                {" "}
                <div>
                  <Label
                    htmlFor="investment"
                    className="text-sm font-semibold text-contrast-high"
                  >
                    Investment Amount (USD)
                  </Label>
                  <Input
                    id="investment"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="10"
                    step="10"
                    className="mt-1 border-2 bg-white text-contrast-high font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                  {strategy.minInvestment && (
                    <p className="text-xs text-contrast-medium mt-2">
                      Minimum investment: $
                      {strategy.minInvestment[strategy.supportedChains[0]] ||
                        10}
                    </p>
                  )}
                  <p className="text-xs text-blue-600 mt-1 font-medium">
                    Balance required on each execution: $
                    {(parseFloat(amount || "0") * (1 + MANAGEMENT_FEE)).toFixed(
                      2
                    )}{" "}
                    (includes {(MANAGEMENT_FEE * 100).toFixed(1)}% platform fee)
                  </p>
                </div>
                <div className={"flex gap-4"}>
                  <div className={"w-1/3"}>
                    <Label
                      htmlFor="token"
                      className="text-sm font-semibold text-contrast-high"
                    >
                      Token
                    </Label>
                    <Select value={tokenId} onValueChange={setTokenId}>
                      <SelectTrigger
                        id="token"
                        className="mt-1 border-2 bg-white text-contrast-high font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      >
                        <SelectValue placeholder="Select token" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 shadow-lg">
                        <SelectGroup>
                          <SelectLabel className="text-contrast-medium font-semibold">
                            Tokens
                          </SelectLabel>
                          {filteredTokens.map((token: Token) => (
                            <SelectItem
                              key={token.id}
                              value={token.id}
                              className="text-contrast-high font-medium"
                            >
                              {token.symbol}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className={"w-2/3"}>
                    <Label
                      htmlFor="chain"
                      className="text-sm font-semibold text-contrast-high"
                    >
                      Chain
                    </Label>
                    <Select
                      value={walletChain || chain}
                      onValueChange={(value: string) => setChain(value)}
                      disabled={!!walletChain}
                    >
                      <SelectTrigger
                        id="chain"
                        className="mt-1 border-2 bg-white text-contrast-high font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      >
                        <SelectValue placeholder="Select chain" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 shadow-lg">
                        <SelectGroup>
                          <SelectLabel className="text-contrast-medium font-semibold">
                            Chains
                          </SelectLabel>
                          {supportedChains.map((option) => (
                            <SelectItem
                              key={option}
                              value={option}
                              className="text-contrast-high font-medium"
                            >
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
                <div>
                  <Label
                    htmlFor="frequency"
                    className="text-sm font-semibold text-contrast-high"
                  >
                    Frequency
                  </Label>
                  <Select
                    value={frequency}
                    onValueChange={(value: string) =>
                      setFrequency(value as Frequency)
                    }
                  >
                    <SelectTrigger
                      id="frequency"
                      className="mt-1 border-2 bg-white text-contrast-high font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-2 shadow-lg">
                      <SelectGroup>
                        <SelectLabel className="text-contrast-medium font-semibold">
                          Frequency
                        </SelectLabel>
                        {frequencyOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="text-contrast-high font-medium"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                {strategy.id === "SDCA" && (
                  <div>
                    <Label
                      htmlFor="recipient"
                      className="text-sm font-semibold text-contrast-high"
                    >
                      Recipient Address
                    </Label>
                    <div className="space-y-3 mt-1">
                      {/* Checkbox for "Use my address" */}
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="use-my-address"
                          checked={useMyAddress}
                          onCheckedChange={(checked) =>
                            setUseMyAddress(checked as boolean)
                          }
                          className="border-2"
                        />
                        <Label
                          htmlFor="use-my-address"
                          className="text-sm font-medium text-contrast-high cursor-pointer"
                        >
                          Use my wallet address
                        </Label>
                      </div>

                      {/* Input field shown only when checkbox is unchecked */}
                      {!useMyAddress && (
                        <div className="flex space-x-2">
                          <Input
                            id="recipient"
                            type="text"
                            className={`flex-1 border-2 bg-white text-contrast-high font-medium ${
                              isRecipientAddressValid
                                ? "border-green-500 focus:ring-green-200"
                                : "border-red-500 focus:ring-red-200"
                            } focus:ring-2`}
                            placeholder="Enter recipient address"
                            value={recipientAddress || ""}
                            onChange={(e) => {
                              setRecipientAddress(e.target.value);

                              if (
                                !validateInjecitveWalletAddress(e.target.value)
                              ) {
                                setIsRecipientAddressValid(false);
                                return;
                              }

                              setIsRecipientAddressValid(true);
                            }}
                          />
                          <WalletAddressPicker
                            chain={chain}
                            onAddressSelected={(addr) => {
                              setRecipientAddress(addr);
                              if (validateInjecitveWalletAddress(addr)) {
                                setIsRecipientAddressValid(true);
                              }
                            }}
                          >
                            <Button variant="secondary" className="font-medium">
                              Pick Address
                            </Button>
                          </WalletAddressPicker>
                        </div>
                      )}

                      {/* Show wallet address when using my address */}
                      {useMyAddress && recipientAddress && (
                        <div className="p-2 bg-green-50 border border-green-200 rounded-md">
                          <p className="text-sm text-green-700 font-medium">
                            Using wallet address: {recipientAddress}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {/* Risk level slider for Smart DCA strategy */}
                {
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label
                        htmlFor="risk-level"
                        className="text-sm font-semibold text-contrast-high"
                      >
                        Risk Level
                      </Label>
                      <span className="text-sm font-semibold text-contrast-medium">
                        {getRiskLevelDisplayName(riskLevel)}
                      </span>
                    </div>
                    <Slider
                      id="risk-level"
                      min={0}
                      max={100}
                      step={1}
                      value={[riskLevelToSliderValue(riskLevel)]}
                      onValueChange={(values: number[]) =>
                        setRiskLevel(sliderValueToRiskLevel(values[0]))
                      }
                      className="py-2"
                    />
                    <div className="flex justify-between text-xs text-contrast-medium font-medium">
                      <span>Lower Risk</span>
                      <span>Higher Risk</span>
                    </div>
                  </div>
                }
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label
                      htmlFor="slippage"
                      className="text-sm font-semibold text-contrast-high"
                    >
                      Slippage Tolerance (%)
                    </Label>
                    <span className="text-sm font-semibold text-contrast-medium">
                      {slippage === -1 ? "Auto Slippage" : `${slippage}%`}
                    </span>
                  </div>
                  <Slider
                    id="slippage"
                    min={-1}
                    max={10}
                    step={1}
                    value={[slippage]}
                    onValueChange={(values: number[]) => setSlippage(values[0])}
                    className="py-2"
                  />
                  <span className="text-xs text-contrast-medium mt-2 font-medium">(max: 10%)</span>
                  <p className="text-xs text-contrast-medium mt-2 font-medium">
                    {slippage === -1 &&
                      "Auto slippage will be applied based on risk level."}
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-lg text-amber-800 text-sm border border-amber-200">
                <p className="font-semibold mb-1">⚠️ Important Note</p>
                <p className="font-medium text-xs">
                  Past performance does not guarantee future results. Your
                  investment may lose value.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="font-medium"
              >
                Cancel
              </Button>
              <WalletPicker
                disabled={
                  strategy.id === "SDCA" &&
                  !useMyAddress &&
                  !isRecipientAddressValid
                }
                callback={(walletName) => handleSubmit((walletName as string) || undefined)}
                enteredBalance={parseFloat(amount)}
                chain={chain}
                useMyAddress={strategy.id === "SDCA" ? useMyAddress : false}
                onWalletAddressReceived={(address) => {
                  if (strategy.id === "SDCA" && useMyAddress) {
                    setRecipientAddress(address);
                    setIsRecipientAddressValid(
                      validateInjecitveWalletAddress(address)
                    );
                  }
                }}
              />
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StartStrategyDialog;