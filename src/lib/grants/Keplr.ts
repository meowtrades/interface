/** @format */

import { api } from "@/api";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";
import {
  MsgGrant,
  getGenericAuthorizationFromMessageType,
} from "@injectivelabs/sdk-ts";
import { ChainId } from "@injectivelabs/ts-types";
import { Wallet } from "@injectivelabs/wallet-base";
import { MsgBroadcaster } from "@injectivelabs/wallet-core";
import { WalletStrategy } from "@injectivelabs/wallet-strategy";

export const getKeplrGrant = async () => {
  if (window.keplr) {
    console.log("Keplr is installed");
  }

  const walletStrategy = new WalletStrategy({
    chainId: ChainId.Testnet,
    wallet: Wallet.Keplr,
    strategies: {},
  });

  await walletStrategy.enable();

  const [granter] = await walletStrategy.getAddresses();

  console.log("Granter Address:", granter);
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const expirationInSeconds = 30 * 24 * 60 * 60; // 30 days

  const msg = MsgGrant.fromJSON({
    granter: granter,
    grantee: "inj1g8lwgz26ej7crwt906wp6wsnwjteh2qk0h4n2n",
    authorization: getGenericAuthorizationFromMessageType(
      "/injective.exchange.v1beta1.MsgCreateSpotMarketOrder"
    ),
    expiration: nowInSeconds + expirationInSeconds,
  });

  const broadcaster = new MsgBroadcaster({
    walletStrategy,
    simulateTx: true,
    network: Network.Testnet,
    endpoints: getNetworkEndpoints(Network.Testnet),
  });

  try {
    const results = await broadcaster.broadcast({
      msgs: [msg],
      injectiveAddress: granter,
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
