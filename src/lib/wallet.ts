/** @format */

import { ChainId } from "@injectivelabs/ts-types";
import { Wallet } from "@injectivelabs/wallet-base";
import { WalletStrategy } from "@injectivelabs/wallet-strategy";

export const getLeapWalletAddress = async () => {
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

  return granter;
};
