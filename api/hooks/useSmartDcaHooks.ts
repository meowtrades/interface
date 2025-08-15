/** @format */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { CreateDcaPlanDto } from "@/api";
import { toast } from "sonner";
import { normalizeChainId } from "@/lib/utils";

// Query keys for cache management
export const SMART_DCA_KEYS = {
  all: ["services", "sdca"] as const,
  plans: () => [...SMART_DCA_KEYS.all, "plans"] as const,
  totalInvestment: () => [...SMART_DCA_KEYS.all, "total-investment"] as const,
  currentPositions: () => [...SMART_DCA_KEYS.all, "current-positions"] as const,
};

/**
 * Create a new DCA plan
 */
export const useCreateInvestmentPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planData: CreateDcaPlanDto) => {
      // Normalize chain ID for backend compatibility
      const normalizedPlanData = {
        ...planData,
        chain: normalizeChainId(planData.chain),
      };

      let response;

      switch (normalizedPlanData.strategyId) {
        case "SDCA":
          response = await api.plans.create(normalizedPlanData);
          break;

        case "GRID":
          response = await api.plans.grid.create(normalizedPlanData);
          break;

        default:
          throw new Error(`Unsupported strategy type: ${normalizedPlanData.strategyId}`);
      }

      if (!response.data) {
        throw new Error("Failed to create DCA plan");
      }
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["activeStrategiesAnalytics", "real"],
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
      const response = await api.plans.stop(planId);
      console.log(response);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["activeStrategiesAnalytics", "real"],
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
