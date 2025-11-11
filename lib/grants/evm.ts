/** @format */

import {
  INJECTIVE_NETWORK,
  INJECTIVE_EVM_TESTNET_CHAIN_ID,
  INJECTIVE_EVM_TESTNET_CHAIN_NAME,
  INJECTIVE_EVM_TESTNET_RPC_URLS,
  INJECTIVE_EVM_TESTNET_EXPLORERS,
  INJECTIVE_EVM_TESTNET_CURRENCY_SYMBOL,
  INJECTIVE_EVM_TESTNET_CURRENCY_NAME,
  INJECTIVE_EVM_TESTNET_CURRENCY_DECIMALS,
  INJECTIVE_EVM_MAINNET_CHAIN_ID,
  INJECTIVE_EVM_MAINNET_CHAIN_NAME,
  INJECTIVE_EVM_MAINNET_RPC_URLS,
  INJECTIVE_EVM_MAINNET_EXPLORERS,
  INJECTIVE_EVM_MAINNET_CURRENCY_SYMBOL,
  INJECTIVE_EVM_MAINNET_CURRENCY_NAME,
  INJECTIVE_EVM_MAINNET_CURRENCY_DECIMALS,
} from "@/configs/env";

// Helper to get the correct network configuration based on env
const getNetworkConfig = () => {
  const isMainnet = INJECTIVE_NETWORK === 'mainnet';
  
  return {
    chainIdHex: isMainnet ? INJECTIVE_EVM_MAINNET_CHAIN_ID : INJECTIVE_EVM_TESTNET_CHAIN_ID,
    chainName: isMainnet ? INJECTIVE_EVM_MAINNET_CHAIN_NAME : INJECTIVE_EVM_TESTNET_CHAIN_NAME,
    rpcUrls: (isMainnet ? INJECTIVE_EVM_MAINNET_RPC_URLS : INJECTIVE_EVM_TESTNET_RPC_URLS || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    blockExplorerUrls: (isMainnet ? INJECTIVE_EVM_MAINNET_EXPLORERS : INJECTIVE_EVM_TESTNET_EXPLORERS || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    nativeCurrencySymbol: isMainnet ? INJECTIVE_EVM_MAINNET_CURRENCY_SYMBOL : INJECTIVE_EVM_TESTNET_CURRENCY_SYMBOL,
    nativeCurrencyName: isMainnet ? INJECTIVE_EVM_MAINNET_CURRENCY_NAME : INJECTIVE_EVM_TESTNET_CURRENCY_NAME,
    nativeCurrencyDecimals: Number(isMainnet ? INJECTIVE_EVM_MAINNET_CURRENCY_DECIMALS : INJECTIVE_EVM_TESTNET_CURRENCY_DECIMALS || 18),
  };
};

// Helper to ensure MetaMask is on the correct Injective EVM network (testnet or mainnet based on env)
export const ensureMetaMaskInjectiveTestnet = async () => {
  if (typeof window === "undefined" || !window.ethereum) return;

  const config = getNetworkConfig();
  const { chainIdHex, chainName, rpcUrls, blockExplorerUrls, nativeCurrencySymbol, nativeCurrencyName, nativeCurrencyDecimals } = config;

  if (!chainIdHex || !rpcUrls.length) {
    console.warn("Injective EVM network env not set. Skipping network switch.");
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
            chainName: chainName || "Injective EVM",
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
