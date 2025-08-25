import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { Frequency } from "@/lib/types";
import { toast } from "sonner";
import { getLeapWalletAddress } from "@/lib/grants/wallet";
import { queryClient, useCreateInvestmentPlan } from "@/api";
import { useQueries } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { formatFrequency } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

const PaperTradeInputForm = () => {
  const [amount, setAmount] = useState("10");
  const [selectedToken, setSelectedToken] = useState("");
  const [selectedStrategy, setSelectedStrategy] = useState("");
  const [riskLevel, setRiskLevel] = useState(2); // Default to moderate (2)
  const [frequency, setFrequency] = useState(Frequency.DAILY); // Default frequency
  const createDcaPlanMutation = useCreateInvestmentPlan();

  const handleStartMockTrade = async () => {
    try {
      // Validation
      if (!selectedStrategy) {
        toast.error("Please select a strategy");
        return;
      }
      if (!selectedToken) {
        toast.error("Please select a token");
        return;
      }
      if (!amount || Number(amount) <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }

      const walletAddress = await getLeapWalletAddress();

      await createDcaPlanMutation.mutateAsync({
        amount: Number(amount),
        userWalletAddress: walletAddress,
        frequency: isGridStrategy ? Frequency.WEEKLY : frequency,
        tokenSymbol: selectedToken,
        strategyId: selectedStrategy,
        recipientAddress: walletAddress,
        chain: "mock", // This is the key - marks it as paper trading
        riskLevel: isGridStrategy
          ? "medium_risk"
          :riskLevel === 1
            ? "no_risk"
            : riskLevel === 2
              ? "medium_risk"
              : "high_risk",
        slippage: 0.5, // Default slippage for paper trading,
        env: "paper",
      });

      toast.success("Paper Trade Started!", {
        description: `Successfully started ${selectedStrategy} strategy with $${amount} for ${selectedToken}`,
        duration: 5000,
      });

      // Reset form fields after successful creation
      setAmount("10");
      setSelectedToken("");
      setSelectedStrategy("");
      setRiskLevel(2);
      setFrequency(Frequency.DAILY);

      // Immediately invalidate and refetch queries for instant UI update
      await Promise.all([
        // Primary query for active paper trades - force refetch
        queryClient.invalidateQueries({
          queryKey: ["activeStrategiesAnalytics", "mock"],
        }),
        queryClient.refetchQueries({
          queryKey: ["activeStrategiesAnalytics", "mock"],
        }),
        // Additional related queries
        queryClient.invalidateQueries({
          queryKey: ["user", "analytics", "overview"],
        }),
        queryClient.invalidateQueries({ queryKey: ["recentActivities"] }),
        queryClient.invalidateQueries({
          queryKey: ["user", "analytics", "activities"],
        }),
        // Invalidate all strategy-related queries
        queryClient.invalidateQueries({
          queryKey: ["activeStrategiesAnalytics"],
        }),
      ]);
    } catch (error) {
      console.error("Failed to start paper trade:", error);
      toast.error("Failed to Start Paper Trade", {
        description:
          "Please try again or contact support if the issue persists.",
        duration: 5000,
      });
    }
  };

  const [
    { data: tokens, isLoading: isTokensLoading },
    { data: strategies, isLoading: isStrategiesLoading },
  ] = useQueries({
    queries: [
      {
        queryKey: ["available", "tokens"],
        queryFn: async () => {
          // Use mock data instead of real API for now
          const { fetchTokens } = await import("@/lib/api/strategies");
          return await fetchTokens();
        },
      },
      {
        queryKey: ["available", "strategies"],
        queryFn: async () => {
          // Use mock data instead of real API for now
          const { fetchStrategies } = await import("@/lib/api/strategies");
          return await fetchStrategies();
        },
      },
    ],
  });

  //Check for Grid Strategy
  const isGridStrategy = strategies?.find(
    (s) => s.id === selectedStrategy
  )?.name
    ?.toLowerCase()
    .includes("grid");

  // Set default selections when data loads
  useEffect(() => {
    if (strategies && strategies.length > 0 && !selectedStrategy) {
      // Try to find "SDCA" or "S-DCA", otherwise use first strategy
      const sdcaStrategy = strategies.find(
        (s) =>
          s.id === "SDCA" ||
          s.id === "S-DCA" ||
          (s.name && s.name.toLowerCase().includes("dca"))
      );
      setSelectedStrategy(sdcaStrategy ? sdcaStrategy.id : strategies[0].id);
    }
  }, [strategies, selectedStrategy]);

  useEffect(() => {
    if (tokens && tokens.length > 0 && !selectedToken) {
      // Try to find "INJ", otherwise use the first token
      const injToken = tokens.find((t) => t.symbol === "INJ");
      setSelectedToken(injToken ? injToken.symbol : tokens[0].symbol);
    }
  }, [tokens, selectedToken]);

  return (
    <Card className="w-full lg:w-full shadow-3d-soft hover:shadow-3d-hover-soft transition-all duration-300">
      <CardHeader className="pb-4 pt-6 px-6">
        <CardTitle className="text-xl font-bold text-contrast-high">
          Enter Details
        </CardTitle>
        {/* <CardDescription className="text-contrast-medium">
          Simulate how a strategy would perform with virtual funds
        </CardDescription> */}
      </CardHeader>
      <CardContent className="space-y-6 px-6">
        <div>
          <label className="text-sm font-semibold block mb-2 text-contrast-high">
            Amount
          </label>
          <Input
            type="number"
            min="10"
            max="1000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="focus:border-blue-500 focus:ring-2 focus:ring-blue-200 border-2 bg-white text-contrast-high font-medium"
            placeholder="Enter amount"
          />
          {/* <p className="text-xs text-contrast-medium mt-2">
              Default mock amount is $10
            </p> */}
        </div>

        <div>
          <label className="text-sm font-semibold block mb-2 text-contrast-high">
            Strategy
          </label>
          <Select
            value={selectedStrategy}
            onValueChange={setSelectedStrategy}
            disabled={isStrategiesLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  isStrategiesLoading
                    ? "Loading strategies..."
                    : "Select strategy"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {strategies?.map((strategy, index) => (
                <SelectItem
                  key={`strategy-${strategy.id}-${index}`}
                  value={strategy.id}
                >
                  {strategy.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-semibold block mb-2 text-contrast-high">
            Token
          </label>
          <Select
            value={selectedToken}
            onValueChange={setSelectedToken}
            disabled={isTokensLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  isTokensLoading ? "Loading tokens..." : "Select token"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {tokens?.map((token, index) => (
                <SelectItem
                  key={`token-${token.symbol}-${index}`}
                  value={token.symbol}
                >
                  {token.name} ({token.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* ✅ Show these fields ONLY if not grid */}
        {!isGridStrategy && (      
        <div>
          <label className="text-sm font-semibold block mb-2 text-contrast-high">
            Risk Level
          </label>
          <Slider
            value={[riskLevel]}
            onValueChange={(value: number[]) => setRiskLevel(value[0])}
            min={1}
            max={3}
            step={1}
            className="w-full py-2"
          />
          <div className="flex justify-between text-xs text-contrast-medium mt-2 font-medium">
            <span>Conservative</span>
            <span>Moderate</span>
            <span>Aggressive</span>
          </div>
        </div>
        )}
        {/* ✅ Show these fields ONLY if not grid */}
        {!isGridStrategy && (
        <div>
          <label className="text-sm font-semibold block mb-2 text-contrast-high">
            Frequency
          </label>
          <Select
            value={frequency}
            onValueChange={(value: string) => setFrequency(value as Frequency)}
          >
            <SelectTrigger className="border-2 bg-white text-contrast-high font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 shadow-lg">
              {Object.values(Frequency).map((freq, index) => (
                <SelectItem
                  key={`freq-${freq}-${index}`}
                  value={freq}
                  className="text-contrast-high font-medium"
                >
                  {formatFrequency(freq)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        )}

        {/* <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 text-contrast-high">
          <AlertCircle size={20} className="text-blue-600 flex-shrink-0" />
          <p className="text-sm font-medium">
            This is a simulation using historical data. Past performance does
            not guarantee future results.
          </p>
        </div> */}
      </CardContent>

      <CardFooter className="px-6 pt-2 pb-6">
        <Button
          onClick={handleStartMockTrade}
          disabled={
            createDcaPlanMutation.isPending ||
            !selectedStrategy ||
            !selectedToken ||
            !amount ||
            Number(amount) <= 0 ||
            isStrategiesLoading ||
            isTokensLoading
          }
          className="w-full  disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {createDcaPlanMutation.isPending
            ? "Starting Paper Trade..."
            : isStrategiesLoading || isTokensLoading
              ? "Loading options..."
              : "Start Paper Trade"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaperTradeInputForm;
