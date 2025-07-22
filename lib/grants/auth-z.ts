/** @format */

"use client";

import { api } from "@/api";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";
import {
  MsgGrant,
  getGenericAuthorizationFromMessageType,
  getInjectiveAddress,
} from "@injectivelabs/sdk-ts";
import { Wallet } from "@injectivelabs/wallet-base";
import { MsgBroadcaster } from "@injectivelabs/wallet-core";
import { ChainId, EthereumChainId } from "@injectivelabs/ts-types";
import { WalletStrategy } from "@injectivelabs/wallet-strategy";
import { checkMinimumUSDTBalance } from "../utils";
import { MANAGEMENT_FEE } from "../constants";

if (typeof window !== "undefined") {
  window.Buffer = Buffer;
}

declare global {
  interface Window {
    keplr: unknown;
    ethereum?: {
      request: (args: {
        method: string;
        params?: unknown[];
      }) => Promise<unknown>;
      isMetaMask?: boolean;
    };
    leap?: {
      enable: (chainId: string) => Promise<void>;
      getAccounts: () => Promise<{ address: string }[]>;
      signAndBroadcast: (
        chainId: string,
        address: string,
        txs: unknown[],
        options: { amount: { denom: string; amount: string }[]; gas: string }
      ) => Promise<{ transactionHash: string }>;
    };
  }
}

const grantee = "inj1g8lwgz26ej7crwt906wp6wsnwjteh2qk0h4n2n";

export const getKeplrGrant = async (enteredBalance: number) => {
  if (typeof window !== "undefined" && window.keplr) {
    console.log("Keplr is installed");
  }

  const walletStrategy = new WalletStrategy({
    chainId: ChainId.Testnet,
    wallet: Wallet.Keplr,
    strategies: {},
  });

  await walletStrategy.enable();

  const [granter] = await walletStrategy.getAddresses();

  const requiredBalance = enteredBalance + enteredBalance * MANAGEMENT_FEE;

  await checkMinimumUSDTBalance(granter, requiredBalance);

  console.log("Granter Address:", granter);
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const expirationInSeconds = 30 * 24 * 60 * 60; // 30 days

  const sportMarketOrderGrant = MsgGrant.fromJSON({
    granter: granter,
    grantee: grantee,
    authorization: getGenericAuthorizationFromMessageType(
      "/injective.exchange.v1beta1.MsgCreateSpotMarketOrder"
    ),
    expiration: nowInSeconds + expirationInSeconds,
  });

  const msgSendGrant = MsgGrant.fromJSON({
    granter: granter,
    grantee: grantee,
    messageType: "/cosmos.bank.v1beta1.MsgSend",
    expiration: nowInSeconds + expirationInSeconds,
  });

  const broadcaster = new MsgBroadcaster({
    walletStrategy,
    simulateTx: true,
    network: Network.Testnet,
    chainId: ChainId.Testnet,
    // ethereumChainId: EthereumChainId.TestnetEvm,
    endpoints: getNetworkEndpoints(Network.Testnet),
  });

  try {
    const results = await broadcaster.broadcast({
      msgs: [sportMarketOrderGrant, msgSendGrant],
      injectiveAddress: granter,
      memo: "Granting permissions for trading and sending",
    });

    console.log("Grant Status:", results);
  } catch (error) {
    console.error("Error broadcasting grant:", error);
    throw error;
  }

  // Update user's wallet address in the backend
  const res = await api.user.updateAddress(granter);

  if (res.status === 200) {
    console.log("User wallet address updated successfully:", res.data);
  } else {
    console.error("Failed to update user wallet address:", res.data);
    throw new Error("Failed to update user wallet address");
  }
};

export const getLeapGrant = async (enteredBalance: number) => {
  if (typeof window !== "undefined" && window.leap) {
    console.log("Leap is installed");
  }

  const walletStrategy = new WalletStrategy({
    chainId: ChainId.Testnet,
    wallet: Wallet.Leap,
    strategies: {},
  });

  await walletStrategy.enable();

  const [granter] = await walletStrategy.getAddresses();

  const requiredBalance = enteredBalance + enteredBalance * MANAGEMENT_FEE; // Default to 0.01 if not provided

  await checkMinimumUSDTBalance(granter, requiredBalance);

  console.log("Granter Address:", granter);
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const expirationInSeconds = 30 * 24 * 60 * 60; // 30 days

  const sportMarketOrderGrant = MsgGrant.fromJSON({
    granter: granter,
    grantee: grantee,
    authorization: getGenericAuthorizationFromMessageType(
      "/injective.exchange.v1beta1.MsgCreateSpotMarketOrder"
    ),
    expiration: nowInSeconds + expirationInSeconds,
  });

  const msgSendGrant = MsgGrant.fromJSON({
    granter: granter,
    grantee: grantee,
    messageType: "/cosmos.bank.v1beta1.MsgSend",
    expiration: nowInSeconds + expirationInSeconds,
  });

  const broadcaster = new MsgBroadcaster({
    walletStrategy,
    simulateTx: true,
    network: Network.Testnet,
    // ethereumChainId: EthereumChainId.TestnetEvm,
    endpoints: getNetworkEndpoints(Network.Testnet),
  });

  try {
    const results = await broadcaster.broadcast({
      msgs: [sportMarketOrderGrant, msgSendGrant],
      injectiveAddress: granter,
      memo: "Granting permissions for trading and sending",
    });

    console.log("Grant Status:", results);
  } catch (error) {
    console.error("Error broadcasting grant:", error);
    throw error;
  }

  // Update user's wallet address in the backend
  const res = await api.user.updateAddress(granter);

  if (res.status === 200) {
    console.log("User wallet address updated successfully:", res.data);
  } else {
    console.error("Failed to update user wallet address:", res.data);
    throw new Error("Failed to update user wallet address");
  }
};

export const getMetaMaskGrant = async (enteredBalance: number) => {
  if (typeof window !== "undefined" && window.ethereum) {
    console.log("MetaMask is installed");
  }

  const walletStrategy = new WalletStrategy({
    chainId: ChainId.Testnet,
    wallet: Wallet.Metamask,
    strategies: {},
    ethereumOptions: {
      ethereumChainId: EthereumChainId.Injective,
    },
  });

  await walletStrategy.enable();

  const [granter] = await walletStrategy.getAddresses();

  // Convert Ethereum address to Injective address first
  const injectiveAddress = getInjectiveAddress(granter);

  const requiredBalance = enteredBalance + enteredBalance * MANAGEMENT_FEE;

  // Use the converted Injective address for balance checking
  await checkMinimumUSDTBalance(injectiveAddress, requiredBalance);

  console.log("Granter Address:", granter);
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const expirationInSeconds = 30 * 24 * 60 * 60; // 30 days

  console.log("Injective Address:", injectiveAddress);

  const sportMarketOrderGrant = MsgGrant.fromJSON({
    granter: injectiveAddress,
    grantee: grantee,
    authorization: getGenericAuthorizationFromMessageType(
      "/injective.exchange.v1beta1.MsgCreateSpotMarketOrder"
    ),
    expiration: nowInSeconds + expirationInSeconds,
  });

  const msgSendGrant = MsgGrant.fromJSON({
    granter: injectiveAddress,
    grantee: grantee,
    messageType: "/cosmos.bank.v1beta1.MsgSend",
    expiration: nowInSeconds + expirationInSeconds,
  });

  const broadcaster = new MsgBroadcaster({
    walletStrategy,
    simulateTx: true,
    network: Network.Testnet,
    endpoints: getNetworkEndpoints(Network.Testnet),
    chainId: ChainId.Testnet,
    ethereumChainId: EthereumChainId.Injective,
  });

  try {
    const results = await broadcaster.broadcast({
      msgs: [sportMarketOrderGrant, msgSendGrant],
      injectiveAddress,
      ethereumAddress: granter,
      memo: "Granting permissions for trading and sending",
    });

    console.log("Grant Status:", results);
  } catch (error) {
    console.error("Error broadcasting grant:", error);
    throw error;
  }

  // Update user's wallet address in the backend
  const res = await api.user.updateAddress(injectiveAddress);

  if (res.status === 200) {
    console.log("User wallet address updated successfully:", res.data);
  } else {
    console.error("Failed to update user wallet address:", res.data);
    throw new Error("Failed to update user wallet address");
  }
};
