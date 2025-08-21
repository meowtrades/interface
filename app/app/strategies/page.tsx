/** @format */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StrategySimulationDialog from "@/components/StrategySimulationDialog";
import StrategyCard from "@/components/StrategyCard";
import { useStrategies } from "@/lib/context/StrategiesContext";
import { Strategy } from "@/lib/types";
import {
  RefreshCw,
  Grid,
  TrendingUp,
  Activity,
  Search,
  BarChart3,
} from "lucide-react";
import { api, useStopDcaPlan } from "@/api";
import { useQuery } from "@tanstack/react-query";

const StrategiesContent = () => {
  const {
    strategies,
    chains,
    isLoading,
    error,
    selectedChain,
    selectedToken,
    setSelectedChain,
    setSelectedToken,
    getSupportedTokensForChain,
    getStrategiesForChainAndToken,
  } = useStrategies();

  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "available";
  const [simulationDialogOpen, setSimulationDialogOpen] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(
    null
  );

  const stopDcaPlanMutation = useStopDcaPlan();

  const {
    data: activeMockStrategiesAnalytics,
    isLoading: isFetchingActiveMockStrategies,
  } = useQuery({
    queryKey: ["activeStrategiesAnalytics", "mock"],
    queryFn: async () => {
      const {
        data: { data },
      } = await api.analytics.getActiveMockStrategies();

      console.log("activeMockStrategiesAnalytics", data);
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const {
    data: activeRealStrategiesAnalytics,
    isLoading: isFetchingActiveRealStrategies,
  } = useQuery({
    queryKey: ["activeStrategiesAnalytics", "real"],
    queryFn: async () => {
      const {
        data: { data },
      } = await api.analytics.getActiveLiveStrategies();
      return data;
    },
    refetchOnWindowFocus: false,
  });

  // console.log("activeStrategiesAnalytics", activeRealStrategiesAnalytics);

  const { data: trendingStrategyId } = useQuery({
    queryKey: ["trendingStrategyId"],
    queryFn: async () => {
      const response = await api.available.getTrendingStrategy();
      return response.data.strategy.id;
    },
    refetchOnWindowFocus: false,
  });

  // Get supported tokens for the current chain
  const supportedTokens = selectedChain
    ? getSupportedTokensForChain(selectedChain)
    : [];

  // Get supported chains for the current token

  // Get strategies for the current chain and token
  const availableStrategies =
    selectedChain && selectedToken
      ? getStrategiesForChainAndToken(selectedChain, selectedToken)
      : [];

  // Get active user strategies
  // const activeStrategies = userStrategies.filter((us) => us.active);

  const handleViewDetails = (strategyId: string) => {
    const strategy = strategies.find((s) => s.id === strategyId);
    if (strategy) {
      setSelectedStrategy(strategy);
      setSimulationDialogOpen(true);
    }
  };

  const handleChainChange = (value: string) => {
    setSelectedChain(value);
  };

  const handleTokenChange = (value: string) => {
    setSelectedToken(value);
  };

  // Handle closing the simulation dialog
  const handleSimulationClose = () => {
    setSimulationDialogOpen(false);
  };

  // Switch to the available strategies tab
  const switchToAvailableTab = () => {
    router.push("/app/strategies?tab=available");
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        Error loading strategy data: {error}
      </div>
    );
  }

  console.log(availableStrategies, trendingStrategyId);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Trading Strategies
        </h1>
        <p className="text-muted-foreground">
          Explore and launch one-click trading strategies.
        </p>
      </div>

      {/* Filter controls */}
      <div className="mb-6 flex flex-wrap gap-3 items-center">
        {/* <div className="text-sm font-medium text-slate-700">Filter by:</div> */}

        <Select
          onValueChange={handleChainChange}
          value={selectedChain || undefined}
          disabled={isLoading}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select chain" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Blockchains</SelectLabel>
              {chains.map((chain) => (
                <SelectItem key={chain.id} value={chain.id}>
                  {chain.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          onValueChange={handleTokenChange}
          value={selectedToken || undefined}
          disabled={isLoading}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select token" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Tokens</SelectLabel>
              {supportedTokens.map((token) => (
                <SelectItem key={token.id} value={token.id}>
                  {token.symbol}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={tab} className="mb-8 w-full">
        <div className="max-w-full">
          <TabsList className="text-xs">
            <TabsTrigger
              onClick={() => router.push("/app/strategies?tab=available")}
              value="available"
            >
              Available
            </TabsTrigger>
            <TabsTrigger
              onClick={() => router.push("/app/strategies?tab=active")}
              value="active"
            >
              Live ({activeRealStrategiesAnalytics?.length ?? 0})
            </TabsTrigger>
            <TabsTrigger
              onClick={() => router.push("/app/strategies?tab=paper")}
              value="paper"
            >
              Paper ({activeMockStrategiesAnalytics?.length ?? 0})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="available" className="pt-6">
          {isFetchingActiveMockStrategies ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
          ) : availableStrategies.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {availableStrategies.map((strategy) => (
                <StrategyCard
                  key={strategy.id}
                  trending={strategy.id === trendingStrategyId}
                  strategy={strategy}
                  selectedToken={selectedToken || "btc"}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <Card className="border-2 border-dashed border-border bg-card hover:shadow-card-hover transition-shadow duration-200">
              <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
                <div className="h-16 w-16 rounded-full bg-secondary text-primary flex items-center justify-center mb-6">
                  <Search size={24} />
                </div>
                <h3 className="text-subtitle font-semibold text-foreground mb-3">
                  No Strategies Found
                </h3>
                <p className="text-body text-muted-foreground mb-6 max-w-sm leading-relaxed">
                  There are no strategies available for the selected chain and
                  token combination.
                </p>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-card transition-all duration-200 hover:shadow-card-hover"
                  onClick={() => setSelectedChain(chains[0]?.id)}
                >
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="active" className="pt-6">
          {isFetchingActiveRealStrategies ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Skeleton className="h-80 w-full" />
              <Skeleton className="h-80 w-full" />
            </div>
          ) : activeRealStrategiesAnalytics!.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {activeRealStrategiesAnalytics!.map((userStrategy) => {
                return (
                  <div
                    key={userStrategy._id}
                    className="border rounded-lg p-6 bg-white"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          {userStrategy.strategyTemplate.id === "SDCA" && (
                            <RefreshCw size={20} />
                          )}
                          {userStrategy.strategyTemplate.id === "Grid" && (
                            <Grid size={20} />
                          )}
                          {userStrategy.strategyTemplate.id ===
                            "TrendingUp" && <TrendingUp size={20} />}
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {userStrategy.strategyTemplate.name}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {userStrategy.chain} • {userStrategy.token.symbol}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          userStrategy.profitPercentage >= 0
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {userStrategy.profitPercentage >= 0 ? "+" : ""}
                        {userStrategy.profitPercentage}%
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-slate-50 p-3 rounded">
                        <div className="text-sm text-slate-500">Invested</div>
                        <div className="font-medium">
                          ${userStrategy.totalInvested}{" "}
                        </div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded">
                        <div className="text-sm text-slate-500">
                          Current Position
                        </div>
                        <div className="font-medium">
                          ${userStrategy.currentValue}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() =>
                          stopDcaPlanMutation.mutate(userStrategy._id)
                        }
                        className="flex-1"
                        variant="destructive"
                      >
                        Stop Strategy
                      </Button>
                      <Link
                        href={`/app/strategies/${userStrategy._id}`}
                        // state={{ planId: userStrategy._id }}
                        className="flex-1"
                      >
                        <Button className="w-full" variant="outline">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <Card className="border-2 border-dashed border-border bg-card hover:shadow-card-hover transition-shadow duration-200">
              <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
                <div className="h-16 w-16 rounded-full bg-secondary text-primary flex items-center justify-center mb-6">
                  <Activity size={24} />
                </div>
                <h3 className="text-subtitle font-semibold text-foreground mb-3">
                  No Live Strategies
                </h3>
                <p className="text-body text-muted-foreground mb-6 max-w-sm leading-relaxed">
                  You haven&apos;t started any live strategies yet. Go to the
                  Available Strategies tab to get started.
                </p>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-card transition-all duration-200 hover:shadow-card-hover"
                  onClick={switchToAvailableTab}
                >
                  View Available Strategies
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="paper" className="pt-6">
          {isFetchingActiveMockStrategies ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Skeleton className="h-80 w-full" />
              <Skeleton className="h-80 w-full" />
            </div>
          ) : activeMockStrategiesAnalytics!.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {activeMockStrategiesAnalytics!.map((userStrategy) => {
                return (
                  <div
                    key={userStrategy._id}
                    className="border rounded-lg p-6 bg-white"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          {userStrategy.strategyTemplate.id === "SDCA" && (
                            <RefreshCw size={20} />
                          )}
                          {userStrategy.strategyTemplate.id === "GRID" && (
                            <Grid size={20} />
                          )}
                          {userStrategy.strategyTemplate.id ===
                            "TrendingUp" && <TrendingUp size={20} />}
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {userStrategy.strategyTemplate.name}
                          </h3>
                          <p className="text-sm text-slate-500">
                            Paper Trade • {userStrategy.token.symbol}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          userStrategy.profitPercentage >= 0
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {userStrategy.profitPercentage >= 0 ? "+" : ""}
                        {userStrategy.profitPercentage}%
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-slate-50 p-3 rounded">
                        <div className="text-sm text-slate-500">Invested</div>
                        <div className="font-medium">
                          ${userStrategy.totalInvested}{" "}
                        </div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded">
                        <div className="text-sm text-slate-500">
                          Current Position
                        </div>
                        <div className="font-medium">
                          ${userStrategy.currentValue}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() =>
                          stopDcaPlanMutation.mutate(userStrategy._id)
                        }
                        className="flex-1"
                        variant="destructive"
                      >
                        Stop Strategy
                      </Button>
                      <Link
                        href={`/app/strategies/${userStrategy._id}`}
                        className="flex-1"
                      >
                        <Button className="w-full" variant="outline">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <Card className="border-2 border-dashed border-border bg-card hover:shadow-card-hover transition-shadow duration-200">
              <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
                <div className="h-16 w-16 rounded-full bg-secondary text-primary flex items-center justify-center mb-6">
                  <BarChart3 size={24} />
                </div>
                <h3 className="text-subtitle font-semibold text-foreground mb-3">
                  No Paper Trades
                </h3>
                <p className="text-body text-muted-foreground mb-6 max-w-sm leading-relaxed">
                  You haven&apos;t started any paper trades. Go to the Available
                  Strategies tab to get started.
                </p>
                <Link href="/app/paper-trades">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-card transition-all duration-200 hover:shadow-card-hover">
                    View Available Strategies
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Simulation dialog */}
      {selectedStrategy && (
        <StrategySimulationDialog
          strategy={selectedStrategy}
          open={simulationDialogOpen}
          onClose={handleSimulationClose}
          defaultToken={selectedToken || "btc"}
        />
      )}
    </div>
  );
};

const Strategies = () => {
  return (
    <AppLayout>
      <StrategiesContent />
    </AppLayout>
  );
};

export default Strategies;
