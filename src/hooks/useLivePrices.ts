/** @format */

import { useState, useEffect, useCallback, useRef } from "react";
import { HermesClient } from "@pythnetwork/hermes-client";

export interface PriceUpdate {
  symbol: string;
  price: number;
  timestamp: number;
  change24h?: number;
  changePercent24h?: number;
}

export interface UseLivePricesOptions {
  symbols: string[];
  onPriceUpdate?: (update: PriceUpdate) => void;
  updateInterval?: number; // in milliseconds, default 1000
}

export interface UseLivePricesReturn {
  prices: Record<string, PriceUpdate>;
  connectionStatus: "Connecting" | "Open" | "Closed" | "Error";
  lastUpdate: PriceUpdate | null;
  error: string | null;
}

// Pyth price feed IDs for common trading pairs
// These are the official Pyth Network price feed IDs
const PRICE_FEED_IDS: Record<string, string> = {
  "SOL/USD":
    "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d",
  "BTC/USD":
    "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
  "ETH/USD":
    "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
  "USDC/USD":
    "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
  "USDT/USD":
    "0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b",
  "AVAX/USD":
    "0x93da3352f9f1d105fdfe4971cfa80e9dd777bfc5d0f683ebb6e1294b92137bb7",
  "MATIC/USD":
    "0x5de33a9112c2b700b8d30b8a3402c103578ccfa2765696471cc672bd5cf6ac52",
  "ATOM/USD":
    "0xb00b60f88b03a6a625a8d1c048c3f66653edf217439983d037e7222c4e612819",
  // Add more pairs as needed
  INJ: "7a5bc1d2b56ad029048cd63964b3ad2776eadf812edc1a43a31406cb54bff592",
};

export const useLivePrices = (
  options: UseLivePricesOptions
): UseLivePricesReturn => {
  const { symbols, onPriceUpdate, updateInterval = 1000 } = options;

  const [prices, setPrices] = useState<Record<string, PriceUpdate>>({});
  const [lastUpdate, setLastUpdate] = useState<PriceUpdate | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "Connecting" | "Open" | "Closed" | "Error"
  >("Closed");
  const [error, setError] = useState<string | null>(null);

  const hermesClientRef = useRef<HermesClient | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const initializeClient = useCallback(async () => {
    try {
      setConnectionStatus("Connecting");
      setError(null);

      hermesClientRef.current = new HermesClient("https://hermes.pyth.network");
      setConnectionStatus("Open");
    } catch (err) {
      setError(
        `Failed to initialize Hermes client: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      setConnectionStatus("Error");
    }
  }, []);

  const fetchPrices = useCallback(async () => {
    if (!hermesClientRef.current || symbols.length === 0) return;

    try {
      const priceFeeds = symbols
        .map((symbol) => PRICE_FEED_IDS[symbol])
        .filter(Boolean);

      if (priceFeeds.length === 0) {
        console.warn("No price feed IDs found for symbols:", symbols);
        return;
      }

      const priceUpdates = await hermesClientRef.current.getLatestPriceUpdates(
        priceFeeds
      );

      priceUpdates.parsed?.forEach((priceData, index) => {
        const symbol = symbols[index];
        if (!symbol || !priceData.price) return;

        const price =
          parseFloat(priceData.price.price) *
          Math.pow(10, priceData.price.expo);
        const timestamp = Date.now();

        const priceUpdate: PriceUpdate = {
          symbol,
          price,
          timestamp,
        };

        setPrices((prev) => ({
          ...prev,
          [symbol]: priceUpdate,
        }));

        setLastUpdate(priceUpdate);
        onPriceUpdate?.(priceUpdate);
      });
    } catch (err) {
      console.error("Error fetching prices:", err);
      setError(
        `Failed to fetch prices: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  }, [symbols, onPriceUpdate]);

  useEffect(() => {
    if (symbols.length === 0) {
      setConnectionStatus("Closed");
      return;
    }

    initializeClient();
  }, [symbols, initializeClient]);
  useEffect(() => {
    if (connectionStatus === "Open" && symbols.length > 0) {
      // Fetch immediately
      fetchPrices();

      // Set up interval for continuous updates
      intervalRef.current = setInterval(fetchPrices, updateInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [connectionStatus, fetchPrices, updateInterval, symbols.length]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    prices,
    connectionStatus,
    lastUpdate,
    error,
  };
};
