// Query keys for cache management
export const USER_BALANCE_KEYS = {
  all: ["user", "balance"] as const,
  chain: (chainId: string) =>
    [...USER_BALANCE_KEYS.all, "chain", chainId] as const,
  tokens: (chainId: string) =>
    [...USER_BALANCE_KEYS.all, "tokens", chainId] as const,
};
