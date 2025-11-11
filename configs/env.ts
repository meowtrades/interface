export const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

// Network selection - 'testnet' or 'mainnet'
export const INJECTIVE_NETWORK =
  process.env.NEXT_PUBLIC_INJECTIVE_NETWORK || "testnet";

// Testnet Configuration
export const INJECTIVE_EVM_TESTNET_CHAIN_ID = "0x59f";
export const INJECTIVE_EVM_TESTNET_CHAIN_NAME = "Injective EVM Testnet";
export const INJECTIVE_EVM_TESTNET_RPC_URLS =
  "https://k8s.testnet.json-rpc.injective.network/";
export const INJECTIVE_EVM_TESTNET_EXPLORERS =
  "https://testnet.blockscout.injective.network/";
export const INJECTIVE_EVM_TESTNET_CURRENCY_SYMBOL = "INJ";
export const INJECTIVE_EVM_TESTNET_CURRENCY_NAME = "Injective";
export const INJECTIVE_EVM_TESTNET_CURRENCY_DECIMALS = 18;

// Mainnet Configuration
export const INJECTIVE_EVM_MAINNET_CHAIN_ID = "0x6f0"; // 1776 in hex
export const INJECTIVE_EVM_MAINNET_CHAIN_NAME = "Injective EVM";
export const INJECTIVE_EVM_MAINNET_RPC_URLS =
  "https://sentry.evm-rpc.injective.network/";
export const INJECTIVE_EVM_MAINNET_EXPLORERS =
  "https://blockscout.injective.network/";
export const INJECTIVE_EVM_MAINNET_CURRENCY_SYMBOL = "INJ";
export const INJECTIVE_EVM_MAINNET_CURRENCY_NAME = "Injective";
export const INJECTIVE_EVM_MAINNET_CURRENCY_DECIMALS = 18;

// Derived values
export const AUTH_URL = API_URL.split("/api")[0];
export const WS_URL: string = AUTH_URL.replace("http", "ws") + "/ws";
