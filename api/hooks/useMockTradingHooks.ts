/** @format */

// NOTE: Mock trading endpoints are not documented in the backend API.
// These hooks are commented out until backend support is implemented.

// import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
// import axiosInstance from "../interceptors/axiosInterceptor";
// import { CreateMockTradeDto, MockTrade } from "../types";

// Query keys for cache management
export const MOCK_TRADING_KEYS = {
  all: ["mocktrades"] as const,
  list: () => [...MOCK_TRADING_KEYS.all, "list"] as const,
  details: (tradeId: string) =>
    [...MOCK_TRADING_KEYS.all, "details", tradeId] as const,
};

// TODO: Implement these hooks once backend supports mock trading endpoints

// const queryClient = new QueryClient();

/**
 * Create a new mock trade
 * NOTE: Backend endpoint not implemented
 */
export const useCreateMockTrade = () => {
  throw new Error("Mock trading endpoints not implemented in backend");
  // return useMutation({
  //   mutationFn: async (tradeData: CreateMockTradeDto) => {
  //     const response = await axiosInstance.post<MockTrade>(
  //       "/mocktrades",
  //       tradeData
  //     );
  //     return response.data;
  //   },
  //   onSuccess: async () => {
  //     queryClient.invalidateQueries({
  //       queryKey: ["activeStrategiesAnalytics", "mock"],
  //     });
  //     await queryClient.refetchQueries({
  //       queryKey: ["activeStrategiesAnalytics", "mock"],
  //       exact: true,
  //     });
  //   },
  // });
};

/**
 * Get all active mock trades for the logged-in user
 * NOTE: Backend endpoint not implemented
 */
export const useActiveMockTrades = () => {
  throw new Error("Mock trading endpoints not implemented in backend");
  // return useQuery({
  //   queryKey: MOCK_TRADING_KEYS.list(),
  //   queryFn: async () => {
  //     const response = await axiosInstance.get<MockTrade[]>("/mocktrades");
  //     return response.data;
  //   },
  // });
};

/**
 * Get details and performance history of a specific mock trade
 * NOTE: Backend endpoint not implemented
 */
export const useMockTradeDetails = (tradeId: string, granularity?: string) => {
  throw new Error("Mock trading endpoints not implemented in backend");
  // return useQuery({
  //   queryKey: MOCK_TRADING_KEYS.details(tradeId),
  //   queryFn: async () => {
  //     const response = await axiosInstance.get<MockTrade>(
  //       `/mocktrades/${tradeId}`,
  //       {
  //         params: {
  //           granularity,
  //         },
  //       }
  //     );
  //     return response.data;
  //   },
  //   enabled: !!tradeId,
  // });
};

/**
 * Stop an active mock trade
 * NOTE: Backend endpoint not implemented
 */
export const useStopMockTrade = () => {
  throw new Error("Mock trading endpoints not implemented in backend");
  // return useMutation({
  //   mutationFn: async ({
  //     tradeId,
  //   }: {
  //     tradeId: string;
  //   }) => {
  //     const response = await axiosInstance.patch<MockTrade>(
  //       `/mocktrades/${tradeId}/stop`
  //     );
  //     return response.data;
  //   },
  //   onSuccess: async () => {
  //     queryClient.invalidateQueries({
  //       queryKey: ["activeStrategiesAnalytics", "mock"],
  //       exact: true,
  //     });
  //     await queryClient.refetchQueries({
  //       queryKey: ["activeStrategiesAnalytics", "mock"],
  //       exact: true,
  //     });
  //   },
  // });
};
