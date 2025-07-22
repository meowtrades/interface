/** @format */

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axiosInstance from "../interceptors/axiosInterceptor";

// Types for Grid Visualization API
export interface GridLineVisualization {
  price: number;
  type: "buy" | "sell";
  status: "active" | "recently_executed";
  distanceFromCurrent: number;
  distancePercent: number;
}

export interface GridVisualizationData {
  planId: string;
  tokenSymbol: string;
  currentPrice: number;
  centerPrice: number;
  gridLines: GridLineVisualization[];
  riskLevel: string;
  investmentPerHit: number;
  executionCount: number;
  lastExecutionTime?: string;
}

export interface GridVisualizationResponse {
  message: string;
  data: GridVisualizationData;
}

export interface UserGridVisualizationsResponse {
  message: string;
  data: GridVisualizationData[];
}

export interface GridServiceHealth {
  isInitialized: boolean;
  activeTokensPolling: string[];
  totalPlansTracked: number;
  activePlansInSet: number;
  totalGridLines: number;
  recentExecutionsCount: number;
}

export interface GridServiceSummary {
  totalKeys: number;
  totalPlans: number;
  tokensTracked: string[];
  activePolling: string[];
}

export interface GridHealthResponse {
  message: string;
  data: {
    health: GridServiceHealth;
    summary: GridServiceSummary;
    activePlanIds: string[];
    timestamp: string;
  };
}

// API Functions
export const gridVisualizationApi = {
  getVisualization: (planId: string) =>
    axiosInstance.get<GridVisualizationResponse>(
      `/services/grid/visualization/${planId}`
    ),

  getAllVisualizations: () =>
    axiosInstance.get<UserGridVisualizationsResponse>(
      `/services/grid/visualizations`
    ),

  getHealth: () =>
    axiosInstance.get<GridHealthResponse>(`/services/grid/health`),
};

// React Query Hooks


export const useAllGridVisualizations = (options?: {
  enabled?: boolean;
  refetchInterval?: number;
}): UseQueryResult<GridVisualizationData[], Error> => {
  return useQuery({
    queryKey: ["allGridVisualizations"],
    queryFn: async () => {
      const response = await gridVisualizationApi.getAllVisualizations();
      return response.data.data;
    },
    enabled: options?.enabled !== false,
    refetchInterval: options?.refetchInterval || 15000, // Refresh every 15 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });
};

export const useGridServiceHealth = (options?: {
  enabled?: boolean;
  refetchInterval?: number;
}): UseQueryResult<GridHealthResponse["data"], Error> => {
  return useQuery({
    queryKey: ["gridServiceHealth"],
    queryFn: async () => {
      const response = await gridVisualizationApi.getHealth();
      return response.data.data;
    },
    enabled: options?.enabled !== false,
    refetchInterval: options?.refetchInterval || 30000, // Refresh every 30 seconds
    staleTime: 15000, // Consider data stale after 15 seconds
  });
};
