/** @format */

// Helper to ensure MetaMask is on Injective EVM Testnet. If not present, it will attempt to add it.
export const ensureMetaMaskInjectiveTestnet = async () => {
  if (typeof window === "undefined" || !window.ethereum) return;

  const chainIdHex = process.env.NEXT_PUBLIC_INJECTIVE_EVM_TESTNET_CHAIN_ID as string; // e.g. '0x...'
  const chainName = process.env.NEXT_PUBLIC_INJECTIVE_EVM_TESTNET_CHAIN_NAME as string; // e.g. 'Injective EVM Testnet'
  const rpcUrls = (process.env.NEXT_PUBLIC_INJECTIVE_EVM_TESTNET_RPC_URLS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const blockExplorerUrls = (process.env.NEXT_PUBLIC_INJECTIVE_EVM_TESTNET_EXPLORERS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const nativeCurrencySymbol = process.env.NEXT_PUBLIC_INJECTIVE_EVM_TESTNET_CURRENCY_SYMBOL || "INJ";
  const nativeCurrencyName = process.env.NEXT_PUBLIC_INJECTIVE_EVM_TESTNET_CURRENCY_NAME || "Injective";
  const nativeCurrencyDecimals = Number(process.env.NEXT_PUBLIC_INJECTIVE_EVM_TESTNET_CURRENCY_DECIMALS || 18);

  if (!chainIdHex || !rpcUrls.length) {
    console.warn("Injective EVM Testnet env not set. Skipping network switch.");
    return;
  }

  try {
    // Try to switch first
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
  } catch (switchError: any) {
    // 4902: Unrecognized chain, try to add
    if (switchError?.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: chainIdHex,
            chainName: chainName || "Injective EVM Testnet",
            rpcUrls,
            nativeCurrency: {
              name: nativeCurrencyName,
              symbol: nativeCurrencySymbol,
              decimals: nativeCurrencyDecimals,
            },
            blockExplorerUrls: blockExplorerUrls.length ? blockExplorerUrls : undefined,
          },
        ],
      });

      // Retry switch after add
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      });
    } else {
      throw switchError;
    }
  }
};

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}


