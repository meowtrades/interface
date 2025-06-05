/** @format */

import {
  getEthereumAddress,
  getInjectiveAddress,
  MsgGrant,
} from "@injectivelabs/sdk-ts";
import { Network } from "@injectivelabs/networks";
import { getNetworkEndpoints } from "@injectivelabs/networks";
import { getGenericAuthorizationFromMessageType } from "@injectivelabs/sdk-ts";
import { Wallet } from "@injectivelabs/wallet-base";
import { BaseWalletStrategy, MsgBroadcaster } from "@injectivelabs/wallet-core";
import { PrivateKeyWalletStrategy } from "@injectivelabs/wallet-private-key";
import { ChainId, EthereumChainId } from "@injectivelabs/ts-types";
import { Button } from "./ui/button";

declare global {
  interface Window {
    ethereum?: {
      request: (args: {
        method: string;
        params?: unknown[];
      }) => Promise<unknown>;
      isMetaMask?: boolean;
    };
  }
}

const MetaMaskGrant = () => {
  const run = async () => {
    if (window.ethereum) {
      console.log("MetaMask is installed");
    }

    const walletStrategy = new BaseWalletStrategy({
      chainId: ChainId.Testnet,
      wallet: Wallet.PrivateKey,
      strategies: {
        [Wallet.PrivateKey]: new PrivateKeyWalletStrategy({
          chainId: ChainId.Testnet,
          ethereumOptions: {
            ethereumChainId: EthereumChainId.Sepolia,
          },
          metadata: {
            privateKey: {
              privateKey: import.meta.env.VITE_PRIVATE_KEY_INJECTIVE,
            },
          },
        }),
      },
    });

    await walletStrategy.enable();

    const [granter] = await walletStrategy.getAddresses();

    console.log("Granter Address:", granter);
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const expirationInSeconds = 30 * 24 * 60 * 60; // 30 days

    const msg = MsgGrant.fromJSON({
      granter: getInjectiveAddress(granter),
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
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition-all duration-150"
      >
        Grant with MetaMask
      </Button>
    </div>
  );
};

export default MetaMaskGrant;
