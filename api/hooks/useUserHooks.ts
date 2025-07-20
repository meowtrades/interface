import { useQuery } from "@tanstack/react-query";
import { User } from "../types";
import { api } from "../client";

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
      const response = await api.user.getCurrentUser();
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
