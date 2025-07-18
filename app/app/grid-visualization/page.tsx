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
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Grid className="w-8 h-8 text-blue-600" />
              Grid Trading Visualization
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time monitoring of your grid trading strategies
            </p>
          </div>{" "}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLivePriceTest}
              className={testLivePriceApi ? "bg-blue-50 border-blue-200" : ""}
            >
              <TestTube className="w-4 h-4 mr-2" />
              Test Live Price API {testLivePriceApi ? "ON" : "OFF"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAutoRefresh}
              className={autoRefresh ? "bg-green-50 border-green-200" : ""}
            >
              <Activity
                className={`w-4 h-4 mr-2 ${autoRefresh ? "animate-pulse" : ""}`}
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
                className={`w-4 h-4 mr-2 ${isRefetching ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button asChild size="sm">
              <Link href="/strategies">
                <Settings className="w-4 h-4 mr-2" />
                Manage Strategies
              </Link>
            </Button>
          </div>
        </div>
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalPlans}
              </div>
              <div className="text-sm text-muted-foreground">Active Plans</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.totalExecutions}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Executions
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                ${stats.totalInvestment.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Invested
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {stats.activeTokens}
              </div>
              <div className="text-sm text-muted-foreground">Active Tokens</div>
            </CardContent>
          </Card>{" "}
        </div>
        {/* Live Price API Test Panel */}
        {testLivePriceApi && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <TestTube className="w-5 h-5" />
                Live Price API Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    Connection Status:
                  </span>
                  {connectionStatus === "Open" && (
                    <Badge className="bg-green-100 text-green-800">
                      <Wifi className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  )}
                  {connectionStatus === "Connecting" && (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                      Connecting
                    </Badge>
                  )}
                  {connectionStatus === "Error" && (
                    <Badge className="bg-red-100 text-red-800">
                      <WifiOff className="w-3 h-3 mr-1" />
                      Error
                    </Badge>
                  )}
                  {connectionStatus === "Closed" && (
                    <Badge className="bg-gray-100 text-gray-800">
                      <WifiOff className="w-3 h-3 mr-1" />
                      Closed
                    </Badge>
                  )}
                </div>

                {priceApiError && (
                  <div className="bg-red-100 border border-red-200 rounded p-2">
                    <p className="text-sm text-red-700">{priceApiError}</p>
                  </div>
                )}

                {Object.keys(prices).length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(prices).map(([symbol, priceData]) => (
                      <div key={symbol} className="bg-white p-3 rounded border">
                        <div className="font-medium">{symbol}</div>
                        <div className="text-lg font-bold">
                          ${priceData.price.toFixed(4)}
                        </div>
                        <div className="text-xs text-gray-500">
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
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <AlertCircle className="w-5 h-5" />
                    Error Loading Grid Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-red-600 mb-4">
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
                  <Card key={i}>
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
              <Card>
                <CardContent className="p-12 text-center">
                  <Grid className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Grid Strategies Found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    You don&apos;t have any active grid trading strategies yet.
                  </p>
                  <Button asChild>
                    <Link href="/strategies">
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
                    {" "}
                    <LiveGridVisualization data={plan} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="health">
            <GridServiceHealthMonitor />
          </TabsContent>
        </Tabs>{" "}
        {/* Footer Info */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-blue-700">
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Live Price API Connection - Real-time price feeds every 2
                  seconds
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-600">
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
