export const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
export const INJECTIVE_EVM_TESTNET_CHAIN_ID = "0x59f"; // e.g. '0x1234'
export const INJECTIVE_EVM_TESTNET_CHAIN_NAME = "Injective EVM Testnet";
export const INJECTIVE_EVM_TESTNET_RPC_URLS =
  "https://k8s.testnet.json-rpc.injective.network/";
export const INJECTIVE_EVM_TESTNET_EXPLORERS =
  "https://testnet.blockscout.injective.network/";
export const INJECTIVE_EVM_TESTNET_CURRENCY_SYMBOL = "INJ";
export const INJECTIVE_EVM_TESTNET_CURRENCY_NAME = "Injective";
export const INJECTIVE_EVM_TESTNET_CURRENCY_DECIMALS = 18;

// Derived values
export const AUTH_URL = API_URL.split("/api")[0];
export const WS_URL: string = AUTH_URL.replace("http", "ws") + "/ws";
