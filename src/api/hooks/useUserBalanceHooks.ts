import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../interceptors/axiosInterceptor";
import {
  AllocateFundsDto,
  ChainToken,
  DepositFundsDto,
  Token,
  WithdrawFundsDto,
} from "../types";

// Query keys for cache management
export const USER_BALANCE_KEYS = {
  all: ["user", "balance"] as const,
  balances: () => [...USER_BALANCE_KEYS.all, "all"] as const,
  chain: (chainId: number | string) =>
    [...USER_BALANCE_KEYS.all, "chain", chainId.toString()] as const,
  tokens: (chainId: number | string) =>
    [...USER_BALANCE_KEYS.all, "tokens", chainId.toString()] as const,
};

/**
 * Get all user balances across all chains
 */
export const useUserBalances = () => {
  return useQuery({
    queryKey: USER_BALANCE_KEYS.balances(),
    queryFn: async () => {
      const response = await axiosInstance.get<{ data: ChainToken[] }>(
        "/user/balance"
      );

      const data = response.data.data;
      return data.filter((chain) => chain.chainId === "injective");
    },
  });
};

/**
 * Get user balance for a specific chain
 */
export const useChainBalance = (chainId: number) => {
  return useQuery({
    queryKey: USER_BALANCE_KEYS.chain(chainId),
    queryFn: async () => {
      const response = await axiosInstance.get<ChainToken>(
        `/user/balance/${chainId}`
      );
      return response.data;
    },
    enabled: !!chainId,
  });
};

/**
 * Get available tokens for a specific chain
 */
export const useChainTokens = (chainId: number) => {
  return useQuery({
    queryKey: USER_BALANCE_KEYS.tokens(chainId),
    queryFn: async () => {
      const response = await axiosInstance.get<Token[]>(
        `/user/balance/${chainId}/tokens`
      );
      return response.data;
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
      const response = await axiosInstance.post(
        "/user/balance/deposit",
        depositData
      );
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
      const response = await axiosInstance.post(
        "/user/balance/withdraw",
        withdrawData
      );
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
      const response = await axiosInstance.post(
        "/user/balance/allocate",
        allocateData
      );
      return response.data;
    },
  });
};
