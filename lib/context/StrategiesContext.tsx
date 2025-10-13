/** @format */

"use client";

/** @format */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Chain, Strategy, Token } from "../types";
import { fetchStrategies, fetchChains, fetchTokens } from "../api/strategies";
import { api } from "@/api/client";
import type { ActiveStrategyAnalytics } from "@/api/types";

type StrategiesContextType = {
  strategies: Strategy[];
  chains: Chain[];
  tokens: Token[];
  // userStrategies: UserStrategy[];
  userStrategies: ActiveStrategyAnalytics[];
  isLoading: boolean;
  error: string | null;
  selectedChain: string | null;
  selectedToken: string | null;
  setSelectedChain: (chainId: string) => void;
  setSelectedToken: (tokenId: string) => void;
  getSupportedTokensForChain: (chainId: string) => Token[];
  getSupportedChainsForToken: (tokenId: string) => Chain[];
  getStrategiesForChainAndToken: (
    chainId: string,
    tokenId: string
  ) => Strategy[];
  refreshData: () => Promise<void>;
};

// Deprecated type removed. Use ActiveStrategyAnalytics instead.

const StrategiesContext = createContext<StrategiesContextType | undefined>(
  undefined
);

export const StrategiesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [chains, setChains] = useState<Chain[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [userStrategies, setUserStrategies] = useState<
    ActiveStrategyAnalytics[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChain, setSelectedChain] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // In a real app, these would be API calls
      const [strategiesData, chainsData, tokensData, mockRes, liveRes] =
        await Promise.all([
          fetchStrategies(),
          fetchChains(),
          fetchTokens(),
          api.analytics.getActiveMockStrategies(),
          api.analytics.getActiveLiveStrategies(),
        ]);

      setStrategies(strategiesData);
      setChains(chainsData);
      setTokens(tokensData);
      const mockStrategies: ActiveStrategyAnalytics[] = mockRes.data.data || [];
      const liveStrategies: ActiveStrategyAnalytics[] = liveRes.data.data || [];
      setUserStrategies([...mockStrategies, ...liveStrategies]);

      // Set default selections if not already set
      if (!selectedChain && chainsData.length > 0) {
        setSelectedChain(chainsData[0].id);
      }
      if (!selectedToken && tokensData.length > 0) {
        setSelectedToken(tokensData[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [selectedChain, selectedToken]);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Only keep getSupportedTokensForChain as:
  const getSupportedTokensForChain = (chainId: string): Token[] => {
    return tokens.filter((token) => token.chains.includes(chainId));
  };

  // Get chains that support a specific token
  const getSupportedChainsForToken = (tokenId: string): Chain[] => {
    const token = tokens.find((t) => t.id === tokenId);
    if (!token) return [];
    return chains.filter((chain) => token.chains.includes(chain.id));
  };

  // Get strategies available for a specific chain and token
  const getStrategiesForChainAndToken = (
    chainId: string,
    tokenId: string
  ): Strategy[] => {
    return strategies.filter(
      (strategy) =>
        strategy.supportedChains.includes(chainId) &&
        strategy.supportedTokens.includes(tokenId)
    );
  };

  const refreshData = async () => {
    await loadData();
  };

  return (
    <StrategiesContext.Provider
      value={{
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
        refreshData,
      }}
    >
      {children}
    </StrategiesContext.Provider>
  );
};

export const useStrategies = () => {
  const context = useContext(StrategiesContext);
  if (context === undefined) {
    throw new Error("useStrategies must be used within a StrategiesProvider");
  }
  return context;
};
