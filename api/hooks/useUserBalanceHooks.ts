import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../client";
import {
  AllocateFundsDto,
  DepositFundsDto,
  WithdrawFundsDto,
} from "../types";

// Query keys for cache management
export const USER_BALANCE_KEYS = {
  all: ["user", "balance"] as const,
  balances: () => [...USER_BALANCE_KEYS.all, "all"] as const,
  chain: (chainId: string) =>
    [...USER_BALANCE_KEYS.all, "chain", chainId] as const,
  tokens: (chainId: string) =>
    [...USER_BALANCE_KEYS.all, "tokens", chainId] as const,
};

/**
 * Get all user balances across all chains
 */
export const useUserBalances = () => {
  return useQuery({
    queryKey: USER_BALANCE_KEYS.balances(),
    queryFn: async () => {
      const response = await api.balances.get();
      return response.data.balances;
    },
  });
};

/**
 * Get user balance for a specific chain
 */
export const useChainBalance = (chainId: string) => {
  return useQuery({
    queryKey: USER_BALANCE_KEYS.chain(chainId),
    queryFn: async () => {
      const response = await api.balances.getByChain(chainId);
      return response.data;
    },
    enabled: !!chainId,
  });
};

/**
 * Get available tokens for a specific chain
 */
export const useChainTokens = (chainId: string) => {
  return useQuery({
    queryKey: USER_BALANCE_KEYS.tokens(chainId),
    queryFn: async () => {
      const response = await api.balances.getChainTokens(chainId);
      return response.data.tokens;
    },
    enabled: !!chainId,
  });
};

/**
 * Deposit funds to user's balance
 */
export const useDepositFunds = () => {
  return useMutation({
    mutationFn: async (depositData: DepositFundsDto) => {
      const response = await api.balances.deposit(depositData);
      return response.data;
    },
  });
};

/**
 * Withdraw funds from user's balance
 */
export const useWithdrawFunds = () => {
  return useMutation({
    mutationFn: async (withdrawData: WithdrawFundsDto) => {
      const response = await api.balances.withdraw(withdrawData);
      return response.data;
    },
  });
};

/**
 * Allocate funds to a strategy
 */
export const useAllocateFunds = () => {
  return useMutation({
    mutationFn: async (allocateData: AllocateFundsDto) => {
      const response = await api.balances.allocate(allocateData);
      return response.data;
    },
  });
};
