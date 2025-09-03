/** @format */

import {
  INJECTIVE_EVM_TESTNET_CHAIN_ID,
  INJECTIVE_EVM_TESTNET_CHAIN_NAME,
  INJECTIVE_EVM_TESTNET_RPC_URLS,
  INJECTIVE_EVM_TESTNET_EXPLORERS,
  INJECTIVE_EVM_TESTNET_CURRENCY_SYMBOL,
  INJECTIVE_EVM_TESTNET_CURRENCY_NAME,
  INJECTIVE_EVM_TESTNET_CURRENCY_DECIMALS,
} from "@/configs/env";

// Helper to ensure MetaMask is on Injective EVM Testnet. If not present, it will attempt to add it.
export const ensureMetaMaskInjectiveTestnet = async () => {
  if (typeof window === "undefined" || !window.ethereum) return;

  const chainIdHex = INJECTIVE_EVM_TESTNET_CHAIN_ID as string; // e.g. '0x...'
  const chainName = INJECTIVE_EVM_TESTNET_CHAIN_NAME as string; // e.g. 'Injective EVM Testnet'
  const rpcUrls = (INJECTIVE_EVM_TESTNET_RPC_URLS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const blockExplorerUrls = (INJECTIVE_EVM_TESTNET_EXPLORERS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const nativeCurrencySymbol = INJECTIVE_EVM_TESTNET_CURRENCY_SYMBOL || "INJ";
  const nativeCurrencyName = INJECTIVE_EVM_TESTNET_CURRENCY_NAME || "Injective";
  const nativeCurrencyDecimals = Number(INJECTIVE_EVM_TESTNET_CURRENCY_DECIMALS || 18);

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
  } catch (switchError: unknown) {
    // 4902: Unrecognized chain, try to add
    if (typeof switchError === 'object' && switchError !== null && 'code' in switchError && switchError.code === 4902) {
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
