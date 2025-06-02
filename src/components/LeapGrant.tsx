/** @format */

import {
  getEthereumAddress,
  getGenericAuthorizationFromMessageType,
  MsgGrant,
  MsgSend,
} from "@injectivelabs/sdk-ts";
import { ChainId } from "@injectivelabs/ts-types";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";
import { WalletStrategy } from "@injectivelabs/wallet-strategy";
import { Wallet } from "@injectivelabs/wallet-base";
import { MsgBroadcaster } from "@injectivelabs/wallet-core";
import { Button } from "./ui/button";

declare global {
  interface Window {
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

const LeapGrant = () => {
  const run = async () => {
    if (!window.leap) {
      console.error("Leap wallet is not installed or not available.");
      return;
    }

    const walletStrategy = new WalletStrategy({
      chainId: ChainId.Testnet,
      wallet: Wallet.Leap,
      strategies: undefined,
    });

    await walletStrategy.enable();

    const [granter] = await walletStrategy.getAddresses();

    console.log("Granter Address:", granter);

    console.log(
      "Authorization: ",
      getGenericAuthorizationFromMessageType(
        "/injective.exchange.v1beta1.MsgCreateSpotMarketOrder"
      )
    );

    const msg = MsgGrant.fromJSON({
      granter,
      grantee: "inj1g8lwgz26ej7crwt906wp6wsnwjteh2qk0h4n2n",
      authorization: getGenericAuthorizationFromMessageType(
        "/injective.exchange.v1beta1.MsgCreateSpotMarketOrder"
      ),
      expiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).getTime(), // 30 days
    });

    const boardcastOptions = {
      walletStrategy,
      network: Network.Testnet,
      endpoints: getNetworkEndpoints(Network.Testnet),
    };

    console.dir(boardcastOptions, { depth: null });

    const broadcaster = new MsgBroadcaster(boardcastOptions);

    try {
      const results = await broadcaster.broadcast({
        msgs: [msg],
        injectiveAddress: granter,
        ethereumAddress: getEthereumAddress(granter),
      });

      console.log("Grant Status:", results);
    } catch (error) {
      console.error("Error broadcasting grant:", error);
    }
  };

  return (
    <div>
      Check console for grant status!
      <Button onClick={run}>Run Grant</Button>
    </div>
  );
};

export default LeapGrant;
