/** @format */

import {
  getEthereumAddress,
  getGenericAuthorizationFromMessageType,
  MsgGrant,
  MsgSend,
} from "@injectivelabs/sdk-ts";
import { ChainId, EthereumChainId } from "@injectivelabs/ts-types";
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

    console.log("Leap wallet is installed");

    const walletStrategy = new WalletStrategy({
      chainId: ChainId.Testnet,
      wallet: Wallet.Leap,
      strategies: {},
      ethereumOptions: {
        ethereumChainId: EthereumChainId.Injective,
      },
    });

    await walletStrategy.enable();

    const [granter] = await walletStrategy.getAddresses();

    // console.log("Granter Address:", granter);

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
      expiration:
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).getTime() / 1000, // 30 days
    });

    // console.dir(boardcastOptions, { depth: null });

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
        msgs: [msg],
        ethereumAddress: getEthereumAddress(granter),
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
        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition-all duration-150"
      >
        Grant with Leap Wallet
      </Button>
    </div>
  );
};

export default LeapGrant;
