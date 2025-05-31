/** @format */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../interceptors/axiosInterceptor";
import {
  CreateDcaPlanDto,
  DcaPosition,
  DcaPlan,
  TotalInvestment,
} from "../types";
import { toast } from "sonner";

// Query keys for cache management
export const SMART_DCA_KEYS = {
  all: ["services", "sdca"] as const,
  plans: () => [...SMART_DCA_KEYS.all, "plans"] as const,
  totalInvestment: (userId: string) =>
    [...SMART_DCA_KEYS.all, "total-investment", userId] as const,
  currentPositions: (userId: string) =>
    [...SMART_DCA_KEYS.all, "current-positions", userId] as const,
};

/**
 * Create a new DCA plan
 */
export const useCreateDcaPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planData: CreateDcaPlanDto) => {
      const response = await axiosInstance.post<DcaPlan>(
        "/services/s-dca/create-plan",
        planData
      );
      return response.data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["activeStrategiesAnalytics"], // Invalidate the list of DCA plans
      });
      await queryClient.refetchQueries({
        queryKey: ["activeStrategiesAnalytics"],
      });
    },
  });
};

/**
 * Stop a specific DCA plan
 */
export const useStopDcaPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planId: string) => {
      const response = await axiosInstance.post(
        `/services/s-dca/stop-plan/${planId}`
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

      toast.success("Plan stopped successfully");
    },
  });
};

/**
 * Stop all DCA plans for a user
 */
export const useStopAllDcaPlans = () => {
  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await axiosInstance.post(
        `/services/s-dca/stop-all-plans/${userId}`
      );
      return response.data;
    },
  });
};

/**
 * Get all DCA plans for a user
 */
export const useUserDcaPlans = () => {
  return useQuery({
    queryKey: SMART_DCA_KEYS.plans(),
    queryFn: async () => {
      const response = await axiosInstance.get<DcaPlan[]>(
        `/services/s-dca/plans`
      );
      return response.data;
    },
  });
};

/**
 * Get user's total investment across all DCA plans
 */
export const useUserTotalInvestment = (userId: string) => {
  return useQuery({
    queryKey: SMART_DCA_KEYS.totalInvestment(userId),
    queryFn: async () => {
      const response = await axiosInstance.get<TotalInvestment>(
        `/services/s-dca/total-investment/${userId}`
      );
      return response.data;
    },
    enabled: !!userId,
  });
};

/**
 * Get user's current positions in native tokens
 */
export const useUserCurrentPositions = (userId: string) => {
  return useQuery({
    queryKey: SMART_DCA_KEYS.currentPositions(userId),
    queryFn: async () => {
      const response = await axiosInstance.get<DcaPosition[]>(
        `/services/s-dca/current-positions/${userId}`
      );
      return response.data;
    },
    enabled: !!userId,
  });
};
