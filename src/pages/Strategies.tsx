import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
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
import { RefreshCw, Grid, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserDcaPlans } from "@/api";

const Strategies = () => {
  const {
    strategies,
    chains,
    tokens,
    userStrategies,
    isLoading,
    error,
    selectedChain,
    selectedToken,
    setSelectedChain,
    setSelectedToken,
    getSupportedTokensForChain,
    getSupportedChainsForToken,
    getStrategiesForChainAndToken,
  } = useStrategies();

  const [simulationDialogOpen, setSimulationDialogOpen] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(
    null
  );

  const { data: dcaActiveStrategies } = useUserDcaPlans();

  console.log(dcaActiveStrategies);

  // Get supported tokens for the current chain
  const supportedTokens = selectedChain
    ? getSupportedTokensForChain(selectedChain)
    : [];

  // Get supported chains for the current token
  const supportedChains = selectedToken
    ? getSupportedChainsForToken(selectedToken)
    : [];

  // Get strategies for the current chain and token
  const availableStrategies =
    selectedChain && selectedToken
      ? getStrategiesForChainAndToken(selectedChain, selectedToken)
      : [];

  // Get active user strategies
  const activeStrategies = userStrategies.filter((us) => us.active);

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

  // Switch to available strategies tab
  const switchToAvailableTab = () => {
    const availableTabTrigger = document.querySelector(
      '[data-state="inactive"][value="available"]'
    );
    if (availableTabTrigger && availableTabTrigger instanceof HTMLElement) {
      availableTabTrigger.click();
    }
  };

  if (error) {
    return (
      <AppLayout>
        <div className="p-4 bg-red-50 text-red-600 rounded-md">
          Error loading strategy data: {error}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Trading Strategies</h1>
        <p className="text-slate-600">
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

      <Tabs defaultValue="available" className="mb-8">
        <TabsList>
          <TabsTrigger value="available">Available Strategies</TabsTrigger>
          <TabsTrigger value="active">
            Active Strategies ({dcaActiveStrategies?.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="pt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
          ) : availableStrategies.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {availableStrategies.map((strategy) => (
                <StrategyCard
                  key={strategy.id}
                  strategy={strategy}
                  selectedToken={selectedToken || "btc"}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-50 rounded-lg">
              <h3 className="text-lg font-medium mb-2">No strategies found</h3>
              <p className="text-slate-600 mb-4">
                There are no strategies available for the selected chain and
                token combination.
              </p>
              <Button
                variant="outline"
                onClick={() => setSelectedChain(chains[0]?.id)}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="pt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Skeleton className="h-80 w-full" />
              <Skeleton className="h-80 w-full" />
            </div>
          ) : activeStrategies.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {dcaActiveStrategies?.map((userStrategy) => {
                const strategy = strategies.find((s) => s.id === "smart-dca");
                const token = tokens.find((t) => t.id === "inj");
                const chain = chains.find((c) => c.id === "injective");

                if (!strategy || !token || !chain) return null;

                const currentValue =
                  userStrategy.totalInvested + userStrategy.amount;

                const profitPercentage =
                  ((currentValue - userStrategy.initialAmount) /
                    userStrategy.initialAmount) *
                  100;

                return (
                  <div
                    key={userStrategy._id}
                    className="border rounded-lg p-6 bg-white"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          {strategy.icon === "RefreshCw" && (
                            <RefreshCw size={20} />
                          )}
                          {strategy.icon === "Grid" && <Grid size={20} />}
                          {strategy.icon === "TrendingUp" && (
                            <TrendingUp size={20} />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{strategy.name}</h3>
                          <p className="text-sm text-slate-500">
                            {chain.name} • {token.symbol}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          profitPercentage >= 0
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {profitPercentage >= 0 ? "+" : ""}
                        {profitPercentage}%
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-slate-50 p-3 rounded">
                        <div className="text-sm text-slate-500">Invested</div>
                        <div className="font-medium">
                          {currentValue} {token.symbol}
                        </div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded">
                        <div className="text-sm text-slate-500">
                          Current Value
                        </div>
                        <div className="font-medium">
                          {currentValue} {token.symbol}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button className="flex-1" variant="destructive">
                        Stop Strategy
                      </Button>
                      <Link
                        to={`/app/strategies/${userStrategy._id}`}
                        state={{ planId: userStrategy._id }}
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
            <div className="p-12 text-center bg-slate-50 rounded-lg">
              <h3 className="text-lg font-medium mb-2">No active strategies</h3>
              <p className="text-slate-600 mb-4">
                You haven't started any strategies yet. Go to the Available
                Strategies tab to get started.
              </p>
              <Button variant="outline" onClick={switchToAvailableTab}>
                View Available Strategies
              </Button>
            </div>
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
    </AppLayout>
  );
};

export default Strategies;
