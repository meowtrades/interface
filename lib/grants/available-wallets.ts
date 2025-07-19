"use client"

import { getKeplrGrant, getLeapGrant, getMetaMaskGrant } from "./auth-z";
import { walletConfigs, getWalletsForChain, BaseWalletConfig } from "./wallet-config";

// Extended configuration for wallet grants
export type AvailableWallets = BaseWalletConfig & {
  action: (enteredBalance: number) => Promise<void>;
};

// Create grant-enabled wallets by extending base configurations
const createGrantWallets = (): AvailableWallets[] => {
  return walletConfigs.map(config => {
    let action: (enteredBalance: number) => Promise<void>;
    
    switch (config.name) {
      case "Keplr":
        action = getKeplrGrant;
        break;
      case "Leap":
        action = getLeapGrant;
        break;
      case "MetaMask":
        action = getMetaMaskGrant;
        break;
      default:
        throw new Error(`Unknown wallet: ${config.name}`);
    }
    
    return { ...config, action };
  });
};

const allWallets = createGrantWallets();

export const getAvailableWalletsForChain = (chain: string): AvailableWallets[] => {
  const walletsForChain = getWalletsForChain(chain);
  return allWallets.filter(wallet => 
    walletsForChain.some(baseWallet => baseWallet.name === wallet.name)
  );
};

// Keep the original export for backward compatibility
export const availableWallets: AvailableWallets[] = allWallets;
