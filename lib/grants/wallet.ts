/** @format */

import { ChainId, EthereumChainId } from "@injectivelabs/ts-types";
import { Wallet } from "@injectivelabs/wallet-base";
import { WalletStrategy } from "@injectivelabs/wallet-strategy";
import { getInjectiveAddress } from "@injectivelabs/sdk-ts";
import { ensureMetaMaskInjectiveTestnet } from "./evm";

export const getKeplrAddress = async () => {
  if (typeof window !== "undefined" && window.keplr) {
    console.log("Keplr is installed");
  }

  const walletStrategy = new WalletStrategy({
    chainId: ChainId.Testnet,
    wallet: Wallet.Keplr,
    strategies: {},
  });

  await walletStrategy.enable();
  const [address] = await walletStrategy.getAddresses();
  return address;
};

export const getLeapWalletAddress = async () => {
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

  return granter;
};

export const getMetaMaskWalletAddress = async () => {
  if (typeof window !== "undefined" && window.ethereum) {
    console.log("MetaMask is installed");
  }

  // Ensure the user is on Injective EVM Testnet (add if missing, then switch)
  await ensureMetaMaskInjectiveTestnet();

  const walletStrategy = new WalletStrategy({
    chainId: ChainId.Testnet,
    wallet: Wallet.Metamask,
    strategies: {},
    ethereumOptions: {
      ethereumChainId: EthereumChainId.TestnetEvm,
    },
  });

  await walletStrategy.enable();

  const [granter] = await walletStrategy.getAddresses();

  // For MetaMask, convert the Ethereum address to Injective format
  const injectiveAddress = getInjectiveAddress(granter);

  return injectiveAddress;
};
