import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../client";
import { DcaPlan } from "../types";

// Query keys for cache management
export const ADMIN_KEYS = {
  all: ["admin"] as const,
  activePlans: () => [...ADMIN_KEYS.all, "active-plans"] as const,
};

/**
 * Get all active DCA plans across all users (admin only)
 */
export const useAllActivePlans = () => {
  return useQuery({
    queryKey: ADMIN_KEYS.activePlans(),
    queryFn: async () => {
      const response = await api.admin.getActivePlans();
      return response.data;
    },
  });
};

/**
 * Stop all DCA plans across all users (admin only)
 */
export const useStopAllPlans = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await api.admin.stopAllPlans();
      return response.data;
    },
  });
};

/**
 * Allocate credits to user wallet (admin only)
 */
export const useAllocateCredits = () => {
  return useMutation({
    mutationFn: async (data: {
      email: string;
      chainId: string;
      amount: number;
      tokenSymbol: string;
    }) => {
      const response = await api.admin.allocateCredits(data);
      return response.data;
    },
  });
};
