import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../interceptors/axiosInterceptor";
import { AdminStats, DcaPlan } from "../types";

// Query keys for cache management
export const ADMIN_KEYS = {
  all: ["admin"] as const,
  activePlans: () => [...ADMIN_KEYS.all, "active-plans"] as const,
  stats: () => [...ADMIN_KEYS.all, "stats"] as const,
};

/**
 * Get all active DCA plans across all users (admin only)
 */
export const useAllActivePlans = () => {
  return useQuery({
    queryKey: ADMIN_KEYS.activePlans(),
    queryFn: async () => {
      const response = await axiosInstance.get<DcaPlan[]>(
        "/admin/active-plans"
      );
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
      const response = await axiosInstance.post("/admin/stop-all-plans");
      return response.data;
    },
  });
};
