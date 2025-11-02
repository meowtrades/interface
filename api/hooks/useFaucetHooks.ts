import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../interceptors/axiosInterceptor";
import queryClient from "../queryClient";

interface ClaimFaucetRequest {
  walletAddress: string;
}

interface ClaimFaucetResponse {
  success: boolean;
  message: string;
  data: {
    txHash: string;
    amount: string;
  };
}

interface CheckClaimResponse {
  success: boolean;
  hasClaimed: boolean;
  claim: {
    userId: string;
    walletAddress: string;
    amount: number;
    claimedAt: string;
    txHash?: string;
  } | null;
}

interface FaucetStatsResponse {
  success: boolean;
  data: {
    totalClaims: number;
    totalDistributed: number;
    amountPerClaim: string;
    enabled: boolean;
  };
}

/**
 * Hook to claim tokens from the faucet (requires authentication)
 */
export const useClaimFaucet = () => {
  return useMutation<ClaimFaucetResponse, Error, ClaimFaucetRequest>({
    mutationFn: async (data: ClaimFaucetRequest) => {
      const response = await axiosInstance.post("/faucet/claim", data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate relevant queries after successful claim
      queryClient.invalidateQueries({ queryKey: ["faucet-claim"] });
      queryClient.invalidateQueries({ queryKey: ["faucet-stats"] });
    },
  });
};

/**
 * Hook to check if the authenticated user has claimed from the faucet
 */
export const useCheckFaucetClaim = () => {
  return useQuery<CheckClaimResponse, Error>({
    queryKey: ["faucet-claim"],
    queryFn: async () => {
      const response = await axiosInstance.get("/faucet/check");
      return response.data;
    },
  });
};

/**
 * Hook to get faucet statistics
 */
export const useFaucetStats = () => {
  return useQuery<FaucetStatsResponse, Error>({
    queryKey: ["faucet-stats"],
    queryFn: async () => {
      const response = await axiosInstance.get("/faucet/stats");
      return response.data;
    },
  });
};

