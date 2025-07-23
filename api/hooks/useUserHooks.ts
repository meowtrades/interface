/** @format */

import { useQuery } from "@tanstack/react-query";
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
      const response = await api.xp.getUserXp();
      return response.data.xp.xp;
    },
    enabled: !!currentUser,
    refetchOnWindowFocus: false,
  });
};
