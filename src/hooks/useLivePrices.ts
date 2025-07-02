/** @format */

import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "@/api/client";

export interface PriceUpdate {
  symbol: string;
  price: number;
  timestamp: number;
  change24h?: number;
  changePercent24h?: number;
}

export interface UseLivePricesOptions {
  tokenIds: string[];
  onPriceUpdate?: (update: PriceUpdate) => void;
  updateInterval?: number; // in milliseconds, default 2000 (2 seconds)
}

export interface UseLivePricesReturn {
  prices: Record<string, PriceUpdate>;
  connectionStatus: "Connecting" | "Open" | "Closed" | "Error";
  lastUpdate: PriceUpdate | null;
  error: string | null;
}

export const useLivePrices = (
  options: UseLivePricesOptions
): UseLivePricesReturn => {
  const { tokenIds, onPriceUpdate, updateInterval = 2000 } = options;

  const [prices, setPrices] = useState<Record<string, PriceUpdate>>({});
  const [lastUpdate, setLastUpdate] = useState<PriceUpdate | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "Connecting" | "Open" | "Closed" | "Error"
  >("Closed");
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchPrices = useCallback(async () => {
    if (tokenIds.length === 0) return;

    try {
      setConnectionStatus("Open");
      setError(null);

      const pricePromises = tokenIds.map(async (tokenId) => {
        try {
          const response = await api.price.getDetails(tokenId);
          return {
            symbol: tokenId,
            price: response.data.price,
            timestamp: Date.now(),
          };
        } catch (err) {
          console.error(`Error fetching price for ${tokenId}:`, err);
          return null;
        }
      });

      const priceResults = await Promise.all(pricePromises);

      priceResults.forEach((priceData) => {
        if (!priceData) return;

        const priceUpdate: PriceUpdate = {
          symbol: priceData.symbol,
          price: priceData.price,
          timestamp: priceData.timestamp,
        };

        setPrices((prev) => ({
          ...prev,
          [priceData.symbol]: priceUpdate,
        }));

        setLastUpdate(priceUpdate);
        onPriceUpdate?.(priceUpdate);
      });
    } catch (err) {
      console.error("Error fetching prices:", err);
      setError(err instanceof Error ? err.message : String(err));
      setConnectionStatus("Error");
    }
  }, [tokenIds, onPriceUpdate]);

  useEffect(() => {
    if (tokenIds.length === 0) {
      setConnectionStatus("Closed");
      return;
    }

    setConnectionStatus("Connecting");
    fetchPrices();

    intervalRef.current = setInterval(fetchPrices, updateInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [tokenIds, fetchPrices, updateInterval]);

  return {
    prices,
    connectionStatus,
    lastUpdate,
    error,
  };
};
