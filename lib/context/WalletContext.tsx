"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Chain, Token, UserWallet } from '../types';
import { fetchChains, fetchTokens } from '../api/strategies';
import { fetchUserWallets, depositToWallet, withdrawFromWallet } from '../api/wallet';

type WalletContextType = {
  wallets: UserWallet[];
  isLoading: boolean;
  error: string | null;
  selectedChain: string | null;
  setSelectedChain: (chainId: string) => void;
  getWalletsForChain: (chainId: string) => UserWallet[];
  deposit: (chainId: string, tokenId: string, amount: number) => Promise<boolean>;
  withdraw: (chainId: string, tokenId: string, address: string, amount: number) => Promise<boolean>;
  getTotalBalanceUsd: () => number;
  refreshWallets: () => Promise<void>;
  chains: Chain[];
  tokens: Token[];
  getSupportedTokensForChain: (chainId: string) => Token[];
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallets, setWallets] = useState<UserWallet[]>([]);
  const [chains, setChains] = useState<Chain[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChain, setSelectedChain] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // In a real app, these would be API calls
      const [chainsData, tokensData, walletsData] = await Promise.all([
        fetchChains(),
        fetchTokens(),
        fetchUserWallets(),
      ]);
      
      setChains(chainsData);
      setTokens(tokensData);
      setWallets(walletsData);
      
      // Set default selection if not already set
      if (!selectedChain && chainsData.length > 0) {
        setSelectedChain(chainsData[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Get wallets for a specific chain
  const getWalletsForChain = (chainId: string): UserWallet[] => {
    return wallets.filter(wallet => wallet.chainId === chainId);
  };

  // Get tokens supported by a specific chain
  const getSupportedTokensForChain = (chainId: string): Token[] => {
    return tokens.filter(token => token.chains.includes(chainId));
  };

  // Deposit funds to a wallet
  const deposit = async (chainId: string, tokenId: string, amount: number): Promise<boolean> => {
    try {
      const result = await depositToWallet(chainId, tokenId, amount);
      if (result) {
        // Refresh wallets after deposit
        await loadData();
      }
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    }
  };

  // Withdraw funds from a wallet
  const withdraw = async (
    chainId: string,
    tokenId: string,
    address: string,
    amount: number
  ): Promise<boolean> => {
    try {
      const result = await withdrawFromWallet(chainId, tokenId, address, amount);
      if (result) {
        // Refresh wallets after withdrawal
        await loadData();
      }
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    }
  };

  // Calculate total balance in USD
  const getTotalBalanceUsd = (): number => {
    return wallets.reduce((total, wallet) => total + wallet.usdValue, 0);
  };

  const refreshWallets = async () => {
    await loadData();
  };

  return (
    <WalletContext.Provider
      value={{
        wallets,
        isLoading,
        error,
        selectedChain,
        setSelectedChain,
        getWalletsForChain,
        deposit,
        withdraw,
        getTotalBalanceUsd,
        refreshWallets,
        chains,
        tokens,
        getSupportedTokensForChain,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}; 