/** @format */
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
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

const PaperTradeInputForm = () => {
  const [amount, setAmount] = useState("10");
  const [selectedBuyToken, setSelectedBuyToken] = useState("");
  const [selectedStrategy, setSelectedStrategy] = useState("");
  const [riskLevel, setRiskLevel] = useState(2); // Default moderate
  const [frequency, setFrequency] = useState(Frequency.DAILY); // Default frequency
  const createDcaPlanMutation = useCreateInvestmentPlan();

  const [
    { data: tokens, isLoading: isTokensLoading },
    { data: strategies, isLoading: isStrategiesLoading },
  ] = useQueries({
    queries: [
      {
        queryKey: ["available", "tokens"],
        queryFn: async () => {
          const { fetchTokens } = await import("@/lib/api/strategies");
          return await fetchTokens();
        },
      },
      {
        queryKey: ["available", "strategies"],
        queryFn: async () => {
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

  const handleStartMockTrade = async () => {
    try {
      if (!selectedStrategy) {
        toast.error("Please select a strategy");
        return;
      }
      if (!selectedBuyToken) {
        toast.error("Please select a buy token");
        return;
      }
      if (!amount || Number(amount) <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }

      const walletAddress = await getLeapWalletAddress();

      const newPlan = await createDcaPlanMutation.mutateAsync({
        amount: Number(amount),
        userWalletAddress: walletAddress,
        frequency: isGridStrategy ? Frequency.WEEKLY : frequency,
        tokenSymbol: selectedBuyToken,
        strategyId: selectedStrategy,
        recipientAddress: walletAddress,
        chain: "mock",
        riskLevel: isGridStrategy
          ? "medium_risk"
          : riskLevel === 1
          ? "no_risk"
          : riskLevel === 2
          ? "medium_risk"
          : "high_risk",
        slippage: 0.5,
        env: "paper",
      });

      toast.success("Paper Trade Started!", {
        description: `Started ${selectedStrategy} with $${amount} from USDT → ${selectedBuyToken}`,
      });

      // Reset form
      setAmount("10");
      setSelectedBuyToken("");
      setSelectedStrategy("");
      setRiskLevel(2);
      setFrequency(Frequency.DAILY);

      queryClient.setQueryData<unknown[]>(
        ["activeStrategiesAnalytics", "mock"],
        (oldData) => {
          const existing = Array.isArray(oldData) ? oldData : [];
          return [...existing, newPlan];
        }
      );

      await queryClient.invalidateQueries({
        queryKey: ["activeStrategiesAnalytics", "mock"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["user", "analytics", "overview"],
      });
      await queryClient.invalidateQueries({ queryKey: ["recentActivities"] });
      await queryClient.invalidateQueries({
        queryKey: ["user", "analytics", "activities"],
      });
    } catch (error) {
      console.error("Failed to start paper trade:", error);
      toast.error("Failed to Start Paper Trade", {
        description:
          "Please try again or contact support if the issue persists.",
      });
    }
  };

  // Default strategy
  useEffect(() => {
    if (strategies && strategies.length > 0 && !selectedStrategy) {
      const sdcaStrategy = strategies.find(
        (s) =>
          s.id === "SDCA" ||
          s.id === "S-DCA" ||
          (s.name && s.name.toLowerCase().includes("dca"))
      );
      setSelectedStrategy(sdcaStrategy ? sdcaStrategy.id : strategies[0].id);
    }
  }, [strategies, selectedStrategy]);

  // Default buy token
  useEffect(() => {
    if (tokens && tokens.length > 0 && !selectedBuyToken) {
      const injToken = tokens.find((t) => t.symbol === "INJ");
      setSelectedBuyToken(injToken ? injToken.symbol : tokens[0].symbol);
    }
  }, [tokens, selectedBuyToken]);

  console.log('tokens:', tokens);

  return (
    <Card className="w-full lg:w-full shadow-3d-soft hover:shadow-3d-hover-soft transition-all duration-300">
      <CardHeader className="pb-4 pt-6 px-6">
        <CardTitle className="text-xl font-bold text-contrast-high">
          Enter Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-6">
        {/* Amount */}
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
        </div>

        {/* Strategy */}
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
              {strategies?.map((strategy) => (
                <SelectItem key={strategy.id} value={strategy.id}>
                  {strategy.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sell + Buy Token Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Sell Token (always USDT) */}
          <div>
            <label className="text-sm font-semibold block mb-2 text-contrast-high">
              Sell Token
            </label>
            <Select value="USDT" disabled>
              <SelectTrigger className="w-full">
                <SelectValue>USDT</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USDT">USDT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Buy Token */}
          <div>
            <label className="text-sm font-semibold block mb-2 text-contrast-high">
              Buy Token
            </label>
            <Select
              value={selectedBuyToken}
              onValueChange={setSelectedBuyToken}
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
                {tokens?.map((token) => (
                  <SelectItem key={token.symbol} value={token.symbol}>
                    {token.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Risk + Frequency → only for non-grid */}
        {!isGridStrategy && (
          <>
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

            <div>
              <label className="text-sm font-semibold block mb-2 text-contrast-high">
                Frequency
              </label>
              <Select
                value={frequency}
                onValueChange={(value: string) =>
                  setFrequency(value as Frequency)
                }
              >
                <SelectTrigger className="border-2 bg-white text-contrast-high font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 shadow-lg">
                  {Object.values(Frequency).map((freq) => (
                    <SelectItem key={freq} value={freq}>
                      {formatFrequency(freq)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </CardContent>

      <CardFooter className="px-6 pt-2 pb-6">
        <Button
          onClick={handleStartMockTrade}
          disabled={
            createDcaPlanMutation.isPending ||
            !selectedStrategy ||
            !selectedBuyToken ||
            !amount ||
            Number(amount) <= 0 ||
            isStrategiesLoading ||
            isTokensLoading
          }
          className="w-full disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
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
