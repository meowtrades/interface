import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../interceptors/axiosInterceptor";
import { User } from "../types";
import { api } from "../client";
import { authClient } from "@/lib/auth";

export const USER_KEYS = {
  all: ["users"] as const,
  details: (address: string) => [...USER_KEYS.all, "details", address] as const,
  me: () => [...USER_KEYS.all, "me"] as const,
  transactions: () => [...USER_KEYS.all, "transactions"] as const,
  xp: () => [...USER_KEYS.all, "xp"] as const,
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: USER_KEYS.me(),
    queryFn: async () => {
      const response = await axiosInstance.get<User>("/user/me");
      return response.data;
    },
  });
};

export const useCurrentUserXp = () => {
  const { data: currentUser } = useCurrentUser();

  return useQuery({
    queryKey: USER_KEYS.xp(),
    queryFn: async () => {
      if (!currentUser?.address) return 0;
      
      const response = await api.xp.leaderboard();
      const leaderboard = response.data;
      
      // Find current user in leaderboard by address
      const currentUserEntry = leaderboard.find(
        (entry) => entry.address === currentUser.address
      );
      
      return currentUserEntry?.xp || 0;
    },
    enabled: !!currentUser?.address,
    refetchOnWindowFocus: false,
  });
};

// Commented out unused hook - uncomment if needed
// export const useUserTransactions = () => {
//   return useQuery({
//     queryKey: USER_KEYS.transactions(),
//     queryFn: async () => {
//       const response = await axiosInstance.get<any>("/user/transactions");
//       return response.data;
//     },
//   });
// };
