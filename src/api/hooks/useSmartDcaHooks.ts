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
import { getKeplrGrant } from "@/lib/grants/Keplr";

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
      let response;

      switch (planData.strategyId) {
        case "SDCA":
          response = await axiosInstance.post<DcaPlan>(
            "/services/s-dca/create-plan",
            planData
          );
          break;

        case "GRID":
          response = await axiosInstance.post<DcaPlan>(
            "/services/grid/create-plan",
            planData
          );
          break;
      }

      if (!response.data) {
        throw new Error("Failed to create DCA plan");
      }
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["activeStrategiesAnalytics", "real"], // Invalidate the list of DCA plans
        exact: true,
      });
      await queryClient.resetQueries({
        queryKey: ["activeStrategiesAnalytics", "real"],
        exact: true,
      });

      toast.success("DCA plan created successfully");
    },
    onError: (error: Error) => {
      console.error("Error creating DCA plan:", error);
      toast.error(error.message || "Failed to create DCA plan");
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
      console.log("Stopping DCA plan with ID:", planId);

      const response = await axiosInstance.post(
        `/services/s-dca/stop-plan/${planId}`
      );

      console.log(response);
      return response.data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["activeStrategiesAnalytics", "real"], // Invalidate the list of real trades
        exact: true,
      });

      await queryClient.refetchQueries({
        queryKey: ["activeStrategiesAnalytics", "real"],
        exact: true,
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
