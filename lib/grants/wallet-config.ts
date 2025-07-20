// Shared wallet configuration - single source of truth for all wallet UI and metadata
export type BaseWalletConfig = {
  name: string;
  description: string;
  icon: string;
  windowKey: string;
  colorTheme: string;
};

// Base wallet configurations shared across the application
export const walletConfigs: BaseWalletConfig[] = [
  {
    name: "Keplr",
    windowKey: "keplr",
    description: "Keplr wallet for Cosmos ecosystem",
    icon: "/wallets/keplr.svg",
    colorTheme: "bg-gradient-to-br from-[#23bcfe] to-[#7451fd] text-white hover:from-[#1ea7e4] hover:to-[#6642e3]",
  },
  {
    name: "Leap",
    windowKey: "leap",
    description: "Leap wallet for Cosmos ecosystem",
    icon: "/wallets/leap.svg",
    colorTheme: "bg-gradient-to-br from-[#00D4AA] to-[#00B894] text-white hover:from-[#00B894] hover:to-[#009F7F]",
  },
  {
    name: "MetaMask",
    windowKey: "ethereum",
    description: "MetaMask wallet for Ethereum ecosystem",
    icon: "/wallets/metamask.svg",
    colorTheme: "bg-gradient-to-br from-[#f6851b] to-[#e2761b] text-white hover:from-[#e2761b] hover:to-[#d16919]",
  },
];

// Utility function to filter wallets by chain
export const getWalletsForChain = (chain: string, allWallets: BaseWalletConfig[] = walletConfigs) => {
  if (chain.toLowerCase().includes('evm') || chain.toLowerCase() === 'injective-evm') {
    // For Injective EVM chain, show only MetaMask
    return allWallets.filter(wallet => wallet.name === "MetaMask");
  } else {
    // For other chains (injective, injective-testnet, etc.), show Leap and Keplr
    return allWallets.filter(wallet => wallet.name === "Leap" || wallet.name === "Keplr");
  }
}; 