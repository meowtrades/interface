/** @format */

import React, { useState, useEffect, useMemo } from "react";
import { GridVisualizationData } from "@/api/hooks/useGridVisualization";
import { useLivePrices, PriceUpdate } from "@/hooks/useLivePrices";
import { CanvasGridChart, PricePoint } from "./CanvasGridChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Wifi,
  WifiOff,
  RefreshCw,
  Maximize2,
  Minimize2,
} from "lucide-react";

interface LiveGridVisualizationProps {
  data: GridVisualizationData;
  maxPricePoints?: number;
  height?: number;
  onPriceUpdate?: (update: PriceUpdate) => void;
}

export const LiveGridVisualization: React.FC<LiveGridVisualizationProps> = ({
  data,
  maxPricePoints = 200,
  height = 400,
  onPriceUpdate,
}) => {
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentLivePrice, setCurrentLivePrice] = useState(data.currentPrice);

  const { prices, connectionStatus, lastUpdate, error } = useLivePrices({
    symbols: [data.tokenSymbol],
    onPriceUpdate: (update) => {
      if (update.symbol === data.tokenSymbol) {
        setCurrentLivePrice(update.price);

        // Add to price history
        setPriceHistory((prev) => {
          const newHistory = [
            ...prev,
            {
              timestamp: update.timestamp,
              price: update.price,
            },
          ];

          // Keep only the last N points
          if (newHistory.length > maxPricePoints) {
            return newHistory.slice(-maxPricePoints);
          }

          return newHistory;
        });

        onPriceUpdate?.(update);
      }
    },
  });

  // Initialize price history with current price if empty
  useEffect(() => {
    if (priceHistory.length === 0) {
      setPriceHistory([
        {
          timestamp: Date.now(),
          price: data.currentPrice,
        },
      ]);
    }
  }, [data.currentPrice, priceHistory.length]);

  const currentPrice = useMemo(() => {
    return prices[data.tokenSymbol]?.price || currentLivePrice;
  }, [prices, data.tokenSymbol, currentLivePrice]);

  const priceChange = useMemo(() => {
    if (priceHistory.length < 2) return 0;
    const firstPrice = priceHistory[0].price;
    return currentPrice - firstPrice;
  }, [priceHistory, currentPrice]);

  const priceChangePercent = useMemo(() => {
    if (priceHistory.length < 2) return 0;
    const firstPrice = priceHistory[0].price;
    return ((currentPrice - firstPrice) / firstPrice) * 100;
  }, [priceHistory, currentPrice]);

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "LOW_RISK":
        return "bg-green-100 text-green-800";
      case "MEDIUM_RISK":
        return "bg-yellow-100 text-yellow-800";
      case "HIGH_RISK":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case "Open":
        return <Wifi className="h-4 w-4 text-green-500" />;
      case "Connecting":
        return <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />;
      case "Error":
        return <WifiOff className="h-4 w-4 text-red-500" />;
      default:
        return <WifiOff className="h-4 w-4 text-gray-500" />;
    }
  };

  const chartHeight = isFullscreen ? window.innerHeight - 200 : height;
  const chartWidth = isFullscreen ? window.innerWidth - 100 : 800;

  return (
    <Card className={`${isFullscreen ? "fixed inset-4 z-50 bg-white" : ""}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-4">
          <CardTitle className="text-xl font-bold">
            {data.tokenSymbol} Grid Trading
          </CardTitle>
          <Badge className={getRiskLevelColor(data.riskLevel)}>
            {data.riskLevel.replace("_", " ")}
          </Badge>
          <div className="flex items-center space-x-2">
            {getConnectionStatusIcon()}
            <span className="text-sm text-gray-600 capitalize">
              {connectionStatus}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Price Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Current Price</p>
            <p className="text-2xl font-bold">${currentPrice.toFixed(4)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">24h Change</p>
            <div className="flex items-center justify-center space-x-1">
              {priceChange >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={`font-semibold ${
                  priceChange >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {priceChangePercent.toFixed(2)}%
              </span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Grid Lines</p>
            <p className="text-lg font-semibold">{data.gridLines.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Executions</p>
            <div className="flex items-center justify-center space-x-1">
              <Activity className="h-4 w-4 text-blue-500" />
              <span className="font-semibold">{data.executionCount}</span>
            </div>
          </div>{" "}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <WifiOff className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700 font-medium">
                Connection Error
              </span>
            </div>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        )}

        {/* Chart */}
        <div className="flex justify-center">
          <CanvasGridChart
            data={data}
            priceHistory={priceHistory}
            currentPrice={currentPrice}
            width={chartWidth}
            height={chartHeight}
            className="border rounded-lg"
          />
        </div>

        {/* Grid Lines Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-green-700 mb-2">Buy Orders</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {data.gridLines
                .filter((line) => line.type === "buy")
                .sort((a, b) => b.price - a.price)
                .slice(0, 5)
                .map((line, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span
                      className={
                        line.status === "active"
                          ? "text-green-700"
                          : "text-gray-500"
                      }
                    >
                      ${line.price.toFixed(4)}
                    </span>
                    <Badge
                      variant={
                        line.status === "active" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {line.status}
                    </Badge>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-red-700 mb-2">Sell Orders</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {data.gridLines
                .filter((line) => line.type === "sell")
                .sort((a, b) => a.price - b.price)
                .slice(0, 5)
                .map((line, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span
                      className={
                        line.status === "active"
                          ? "text-red-700"
                          : "text-gray-500"
                      }
                    >
                      ${line.price.toFixed(4)}
                    </span>
                    <Badge
                      variant={
                        line.status === "active" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {line.status}
                    </Badge>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Last Update Info */}
        {lastUpdate && (
          <div className="text-sm text-gray-600 text-center">
            Last update: {new Date(lastUpdate.timestamp).toLocaleTimeString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
