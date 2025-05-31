/** @format */

import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../interceptors/axiosInterceptor";
import { CreateMockTradeDto, MockTrade, StopMockTradeDto } from "../types";

// Query keys for cache management
export const MOCK_TRADING_KEYS = {
  all: ["mocktrades"] as const,
  list: () => [...MOCK_TRADING_KEYS.all, "list"] as const,
  details: (tradeId: string) =>
    [...MOCK_TRADING_KEYS.all, "details", tradeId] as const,
};

const queryClient = new QueryClient();

/**
 * Create a new mock trade
 */
export const useCreateMockTrade = () => {
  // const queryClient = new QueryClient();

  return useMutation({
    mutationFn: async (tradeData: CreateMockTradeDto) => {
      const response = await axiosInstance.post<MockTrade>(
        "/mocktrades",
        tradeData
      );
      return response.data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["activeStrategiesAnalytics"], // Invalidate the list of mock trades
      });
      await queryClient.refetchQueries({
        queryKey: ["activeStrategiesAnalytics"],
      });
      // Invalidate old data
    },
  });
};

/**
 * Get all active mock trades for the logged-in user
 */
export const useActiveMockTrades = () => {
  return useQuery({
    queryKey: MOCK_TRADING_KEYS.list(),
    queryFn: async () => {
      const response = await axiosInstance.get<MockTrade[]>("/mocktrades");
      return response.data;
    },
  });
};

/**
 * Get details and performance history of a specific mock trade
 */
export const useMockTradeDetails = (tradeId: string, granularity?: string) => {
  return useQuery({
    queryKey: MOCK_TRADING_KEYS.details(tradeId),
    queryFn: async () => {
      const response = await axiosInstance.get<MockTrade>(
        `/mocktrades/${tradeId}`,
        {
          params: {
            granularity,
          },
        }
      );
      return response.data;
    },
    enabled: !!tradeId,
  });
};

/**
 * Stop an active mock trade
 */
export const useStopMockTrade = () => {
  return useMutation({
    mutationFn: async ({
      tradeId,
    }: // data,
    {
      tradeId: string;
      // data: StopMockTradeDto;
    }) => {
      const response = await axiosInstance.patch<MockTrade>(
        `/mocktrades/${tradeId}/stop`
      );
      return response.data;
    },
    onSuccess: async () => {
      // Invalidate the list of mock trades to refresh data
      queryClient.invalidateQueries({
        queryKey: ["activeStrategiesAnalytics"], // Invalidate the list of mock trades
      });
      await queryClient.refetchQueries({
        queryKey: ["activeStrategiesAnalytics"],
      });
    },
  });
};
