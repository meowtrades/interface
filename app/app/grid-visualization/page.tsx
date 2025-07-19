/** @format */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { useAllGridVisualizations } from "@/api/hooks/useGridVisualization";
import { LiveGridVisualization } from "@/components/LiveGridVisualization";
import GridServiceHealthMonitor from "@/components/GridServiceHealthMonitor";
import { useLivePrices } from "@/hooks/useLivePrices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Grid,
  Activity,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Settings,
  Wifi,
  WifiOff,
  TestTube,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/design-system";

const GridVisualization: React.FC = () => {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [testLivePriceApi, setTestLivePriceApi] = useState(false);

  const {
    data: gridData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useAllGridVisualizations({
    enabled: autoRefresh,
    refetchInterval: autoRefresh ? 10000 : undefined,
  });

  // Test Live Price API integration
  const {
    prices,
    connectionStatus,
    error: priceApiError,
  } = useLivePrices({
    tokenIds: testLivePriceApi ? ["SOL", "BTC"] : [],
    onPriceUpdate: (update) => {
      console.log("Live price update:", update);
    },
  });

  const handleRefresh = () => {
    refetch();
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  const toggleLivePriceTest = () => {
    setTestLivePriceApi(!testLivePriceApi);
  };

  const getTotalStats = () => {
    if (!gridData)
      return {
        totalPlans: 0,
        totalExecutions: 0,
        totalInvestment: 0,
        activeTokens: 0,
      };

    return {
      totalPlans: gridData.length,
      totalExecutions: gridData.reduce(
        (sum, plan) => sum + plan.executionCount,
        0
      ),
      totalInvestment: gridData.reduce(
        (sum, plan) => sum + plan.investmentPerHit * plan.executionCount,
        0
      ),
      activeTokens: new Set(gridData.map((plan) => plan.tokenSymbol)).size,
    };
  };

  const stats = getTotalStats();

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-display font-bold text-foreground mb-2">
              Grid Visualization
            </h1>
            <p className="text-body text-muted-foreground">
              Real-time monitoring of your grid trading strategies
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLivePriceTest}
              className={cn(
                testLivePriceApi && "bg-info/10 border-info/20 text-info"
              )}
            >
              <TestTube className="w-4 h-4 mr-2" />
              Test Live Price API {testLivePriceApi ? "ON" : "OFF"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAutoRefresh}
              className={cn(
                autoRefresh && "bg-success/10 border-success/20 text-success"
              )}
            >
              <Activity
                className={cn("w-4 h-4 mr-2", autoRefresh && "animate-pulse")}
              />
              Auto Refresh {autoRefresh ? "ON" : "OFF"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefetching}
            >
              <RefreshCw
                className={cn("w-4 h-4 mr-2", isRefetching && "animate-spin")}
              />
              Refresh
            </Button>
            <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/app/strategies">
                <Settings className="w-4 h-4 mr-2" />
                Manage Strategies
              </Link>
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border border-border bg-card hover:shadow-card-hover transition-shadow duration-200">
            <CardContent className="p-4 text-center">
              <div className="text-title font-semibold text-primary metric-display">
                {stats.totalPlans}
              </div>
              <div className="text-caption text-muted-foreground">Active Plans</div>
            </CardContent>
          </Card>
          <Card className="border border-border bg-card hover:shadow-card-hover transition-shadow duration-200">
            <CardContent className="p-4 text-center">
              <div className="text-title font-semibold text-success metric-display">
                {stats.totalExecutions}
              </div>
              <div className="text-caption text-muted-foreground">
                Total Executions
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border bg-card hover:shadow-card-hover transition-shadow duration-200">
            <CardContent className="p-4 text-center">
              <div className="text-title font-semibold text-foreground metric-display">
                {formatCurrency(stats.totalInvestment)}
              </div>
              <div className="text-caption text-muted-foreground">
                Total Invested
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border bg-card hover:shadow-card-hover transition-shadow duration-200">
            <CardContent className="p-4 text-center">
              <div className="text-title font-semibold text-warning metric-display">
                {stats.activeTokens}
              </div>
              <div className="text-caption text-muted-foreground">Active Tokens</div>
            </CardContent>
          </Card>
        </div>

        {/* Live Price API Test Panel */}
        {testLivePriceApi && (
          <Card className="border border-info/20 bg-info/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-info">
                <TestTube className="w-5 h-5" />
                Live Price API Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-caption font-medium text-foreground">
                    Connection Status:
                  </span>
                  {connectionStatus === "Open" && (
                    <Badge className="bg-success/10 text-success border-success/20">
                      <Wifi className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  )}
                  {connectionStatus === "Connecting" && (
                    <Badge className="bg-warning/10 text-warning border-warning/20">
                      <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                      Connecting
                    </Badge>
                  )}
                  {connectionStatus === "Error" && (
                    <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                      <WifiOff className="w-3 h-3 mr-1" />
                      Error
                    </Badge>
                  )}
                  {connectionStatus === "Closed" && (
                    <Badge className="bg-muted text-muted-foreground border-border">
                      <WifiOff className="w-3 h-3 mr-1" />
                      Closed
                    </Badge>
                  )}
                </div>

                {priceApiError && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded p-3">
                    <p className="text-caption text-destructive">{priceApiError}</p>
                  </div>
                )}

                {Object.keys(prices).length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(prices).map(([symbol, priceData]) => (
                      <div key={symbol} className="bg-card border border-border p-3 rounded">
                        <div className="text-body font-medium text-foreground">{symbol}</div>
                        <div className="text-title font-bold text-primary metric-display">
                          {formatCurrency(priceData.price)}
                        </div>
                        <div className="text-caption text-muted-foreground">
                          {new Date(priceData.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Tabs defaultValue="visualizations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="visualizations"
              className="flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Grid Visualizations
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Service Health
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visualizations" className="space-y-6">
            {error ? (
              <Card className="border-destructive/20 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="w-5 h-5" />
                    Error Loading Grid Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-body text-destructive mb-4">
                    Failed to load grid visualization data. Please try
                    refreshing the page.
                  </p>
                  <Button onClick={handleRefresh} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : isLoading ? (
              <div className="space-y-6">
                {[1, 2].map((i) => (
                  <Card key={i} className="border border-border bg-card">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((j) => (
                          <div key={j} className="text-center space-y-2">
                            <Skeleton className="h-4 w-20 mx-auto" />
                            <Skeleton className="h-8 w-24 mx-auto" />
                          </div>
                        ))}
                      </div>
                      <Skeleton className="h-[400px] w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : !gridData || gridData.length === 0 ? (
              <Card className="border border-border bg-card">
                <CardContent className="p-12 text-center">
                  <Grid className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-subtitle font-semibold text-foreground mb-2">
                    No Grid Strategies Found
                  </h3>
                  <p className="text-body text-muted-foreground mb-6">
                    You don&apos;t have any active grid trading strategies yet.
                  </p>
                  <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href="/app/strategies">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Create Your First Grid Strategy
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {gridData.map((plan) => (
                  <div key={plan.planId}>
                    <LiveGridVisualization data={plan} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="health">
            <GridServiceHealthMonitor />
          </TabsContent>
        </Tabs>

        {/* Footer Info */}
        <Card className="border border-border bg-muted/30">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-primary">
                <Activity className="w-4 h-4" />
                <span className="text-caption font-medium">
                  Live Price API Connection - Real-time price feeds every 2
                  seconds
                </span>
              </div>
              <div className="flex items-center gap-4 text-caption text-muted-foreground">
                <span>Canvas-based TradingView-style charts</span>
                <span>•</span>
                <span>Grid line visualization</span>
                <span>•</span>
                <span>Server-Sent Events (SSE)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default GridVisualization;
