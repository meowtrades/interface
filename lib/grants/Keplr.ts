"use client"

import { api } from "@/api";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";
import {
  MsgGrant,
  getGenericAuthorizationFromMessageType,
} from "@injectivelabs/sdk-ts";
import { Wallet } from "@injectivelabs/wallet-base";
import { MsgBroadcaster } from "@injectivelabs/wallet-core";
import { ChainId, EthereumChainId } from "@injectivelabs/ts-types";
import { WalletStrategy } from "@injectivelabs/wallet-strategy";
import { checkMinimumUSDTBalance } from "../utils";
import { MANAGEMENT_FEE } from "../constants";

declare global {
  interface Window {
    keplr: unknown;
  }
}

export const getKeplrGrant = async (enteredBalance: number) => {
  if (typeof window !== 'undefined' && window.keplr) {
    console.log("Keplr is installed");
  }

  const walletStrategy = new WalletStrategy({
    chainId: ChainId.Testnet,
    wallet: Wallet.Keplr,
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
    grantee: "inj1g8lwgz26ej7crwt906wp6wsnwjteh2qk0h4n2n",
    authorization: getGenericAuthorizationFromMessageType(
      "/injective.exchange.v1beta1.MsgCreateSpotMarketOrder"
    ),
    expiration: nowInSeconds + expirationInSeconds,
  });

  const msgSendGrant = MsgGrant.fromJSON({
    granter: granter,
    grantee: "inj1g8lwgz26ej7crwt906wp6wsnwjteh2qk0h4n2n",
    messageType: "/cosmos.bank.v1beta1.MsgSend",
    expiration: nowInSeconds + expirationInSeconds,
  });

  const broadcaster = new MsgBroadcaster({
    walletStrategy,
    simulateTx: true,
    network: Network.Testnet,
    ethereumChainId: EthereumChainId.TestnetEvm,
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
