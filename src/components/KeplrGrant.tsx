/** @format */

import { MsgGrant } from "@injectivelabs/sdk-ts";
import { Network } from "@injectivelabs/networks";
import { getNetworkEndpoints } from "@injectivelabs/networks";
import { getGenericAuthorizationFromMessageType } from "@injectivelabs/sdk-ts";
import { Wallet } from "@injectivelabs/wallet-base";
import { MsgBroadcaster } from "@injectivelabs/wallet-core";
import { ChainId } from "@injectivelabs/ts-types";
import { Button } from "./ui/button";
import { WalletStrategy } from "@injectivelabs/wallet-strategy";

declare global {
  interface Window {
    keplr?: {
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

const KeplGrant = () => {
  const run = async () => {
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
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <Button
        onClick={run}
        className="w-full bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow transition-all duration-150"
      >
        Grant with Keplr Wallet
      </Button>
    </div>
  );
};

export default KeplGrant;
