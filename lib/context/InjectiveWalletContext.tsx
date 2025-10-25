/** @format */

"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { WalletStrategy } from "@injectivelabs/wallet-strategy";
import { Wallet } from "@injectivelabs/wallet-base";
import { ChainId, EthereumChainId } from "@injectivelabs/ts-types";
import { getInjectiveAddress } from "@injectivelabs/sdk-ts";
import { toast } from "sonner";
import { ensureMetaMaskInjectiveTestnet } from "@/lib/grants/evm";
import { fetchWalletBalances } from "@/lib/utils";
import { api } from "@/api/client";

// Wallet types supported
export type WalletType = "Keplr" | "Leap" | "MetaMask";

// Chain types supported
export type ChainType = "injective" | "injective-evm";

// Wallet state
export interface WalletState {
  walletType: WalletType;
  address: string; // Injective format address
  chain: ChainType;
  ethereumAddress?: string; // Only for MetaMask
}

// Balance information
export interface WalletBalances {
  inj: number;
  usdt: number;
}

// Context type
interface InjectiveWalletContextType {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  walletState: WalletState | null;
  balances: WalletBalances | null;
  isFetchingBalances: boolean;

  // Wallet strategy instance (for signing transactions)
  walletStrategy: WalletStrategy | null;

  // Actions
  connectWallet: (walletType: WalletType) => Promise<void>;
  disconnectWallet: () => void;
  refreshBalances: () => Promise<void>;

  // Utility
  getWalletAddress: () => string | null;
  getChain: () => ChainType | null;
}

const InjectiveWalletContext = createContext<
  InjectiveWalletContextType | undefined
>(undefined);

// LocalStorage keys
const STORAGE_KEY_WALLET_TYPE = "injective_wallet_type";
const STORAGE_KEY_CHAIN = "injective_wallet_chain";

export const InjectiveWalletProvider: React.FC<{
  children: React.ReactNode;
  enableAutoReconnect?: boolean; // Optional: disable auto-reconnect
}> = ({ children, enableAutoReconnect = false }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletState, setWalletState] = useState<WalletState | null>(null);
  const [balances, setBalances] = useState<WalletBalances | null>(null);
  const [isFetchingBalances, setIsFetchingBalances] = useState(false);
  const [walletStrategy, setWalletStrategy] = useState<WalletStrategy | null>(
    null
  );

  // Track if we've attempted auto-reconnect
  const hasAttemptedReconnect = useRef(false);

  /**
   * Get wallet type from wallet name
   */
  const getWalletEnum = (walletType: WalletType): Wallet => {
    switch (walletType) {
      case "Keplr":
        return Wallet.Keplr;
      case "Leap":
        return Wallet.Leap;
      case "MetaMask":
        return Wallet.Metamask;
      default:
        throw new Error(`Unsupported wallet: ${walletType}`);
    }
  };

  /**
   * Determine chain based on wallet type
   */
  const getChainForWallet = (walletType: WalletType): ChainType => {
    return walletType === "MetaMask" ? "injective-evm" : "injective";
  };

  /**
   * Create wallet strategy instance
   */
  const createWalletStrategy = async (
    walletType: WalletType
  ): Promise<WalletStrategy> => {
    const wallet = getWalletEnum(walletType);
    const chain = getChainForWallet(walletType);

    // For MetaMask, ensure correct network
    if (walletType === "MetaMask") {
      await ensureMetaMaskInjectiveTestnet();
    }

    const strategy = new WalletStrategy({
      chainId: ChainId.Testnet,
      wallet,
      strategies: {},
      ...(walletType === "MetaMask" && {
        ethereumOptions: {
          ethereumChainId: EthereumChainId.Injective,
        },
      }),
    });

    // Enable the wallet with proper error handling
    try {
      await strategy.enable();
    } catch (error) {
      console.error(`Failed to enable ${walletType}:`, error);
      throw error;
    }

    // For Leap, add a small delay to ensure wallet is fully initialized
    if (walletType === "Leap") {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    return strategy;
  };

  /**
   * Fetch wallet balances
   */
  const fetchBalances = useCallback(async (address: string) => {
    setIsFetchingBalances(true);
    try {
      const balances = await fetchWalletBalances(address);
      setBalances(balances);
    } catch (error) {
      console.error("Failed to fetch balances:", error);
      setBalances({ inj: 0, usdt: 0 });
    } finally {
      setIsFetchingBalances(false);
    }
  }, []);

  /**
   * Connect wallet
   */
  const connectWallet = useCallback(
    async (walletType: WalletType) => {
      // Prevent multiple simultaneous connection attempts
      if (isConnecting) {
        console.warn("Connection already in progress");
        return;
      }

      setIsConnecting(true);

      try {
        const strategy = await createWalletStrategy(walletType);

        // Get addresses with timeout to prevent hanging
        const addresses = await Promise.race([
          strategy.getAddresses(),
          new Promise<string[]>((_, reject) =>
            setTimeout(
              () => reject(new Error("Wallet connection timeout")),
              30000
            )
          ),
        ]);

        if (!addresses || addresses.length === 0) {
          throw new Error("No addresses returned from wallet");
        }

        const [rawAddress] = addresses;

        // Validate address
        if (!rawAddress || rawAddress.trim() === "") {
          throw new Error("Invalid address received from wallet");
        }

        const chain = getChainForWallet(walletType);

        let injectiveAddress: string;
        let ethereumAddress: string | undefined;

        // Handle address conversion for MetaMask
        if (walletType === "MetaMask") {
          ethereumAddress = rawAddress;
          injectiveAddress = getInjectiveAddress(rawAddress);
        } else {
          injectiveAddress = rawAddress;
        }

        console.log(`${walletType} connected:`, injectiveAddress);

        // Create wallet state
        const newWalletState: WalletState = {
          walletType,
          address: injectiveAddress,
          chain,
          ethereumAddress,
        };

        // Update state
        setWalletState(newWalletState);
        setWalletStrategy(strategy);
        setIsConnected(true);

        // Persist wallet type and chain
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY_WALLET_TYPE, walletType);
          localStorage.setItem(STORAGE_KEY_CHAIN, chain);
        }

        // Fetch balances
        await fetchBalances(injectiveAddress);

        toast.success(`Connected to ${walletType}`, {
          description: `Chain: ${chain}`,
        });
      } catch (error) {
        console.error(`${walletType} connection error:`, error);
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";

        // Clean up on error - do this FIRST
        setWalletState(null);
        setWalletStrategy(null);
        setIsConnected(false);
        setIsConnecting(false); // Reset immediately

        // Only show toast for manual connections (not auto-reconnect)
        if (!hasAttemptedReconnect.current || isConnected) {
          if (
            errorMsg.toLowerCase().includes("rejected") ||
            errorMsg.toLowerCase().includes("user cancelled") ||
            errorMsg.toLowerCase().includes("user rejected") ||
            errorMsg.toLowerCase().includes("request rejected")
          ) {
            toast.error("Connection cancelled");
          } else if (errorMsg.toLowerCase().includes("timeout")) {
            toast.error(`${walletType} connection timeout`, {
              description:
                "Please try again and approve the connection in your wallet.",
            });
          } else if (errorMsg.toLowerCase().includes("no addresses")) {
            toast.error(`${walletType} returned no addresses`, {
              description:
                "Please make sure your wallet is unlocked and try again.",
            });
          } else {
            toast.error(`Failed to connect to ${walletType}`, {
              description: errorMsg,
            });
          }
        }

        // Re-throw error for auto-reconnect to handle
        throw error;
      } finally {
        // Ensure connecting state is always reset
        setIsConnecting(false);
      }
    },
    [fetchBalances, isConnecting, isConnected]
  );

  /**
   * Disconnect wallet
   */
  const disconnectWallet = useCallback(() => {
    setWalletState(null);
    setWalletStrategy(null);
    setBalances(null);
    setIsConnected(false);

    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY_WALLET_TYPE);
      localStorage.removeItem(STORAGE_KEY_CHAIN);
      // Also clear legacy keys
      localStorage.removeItem("connectedWallet");
      localStorage.removeItem("connectedChain");
    }

    toast.success("Wallet disconnected");
  }, []);

  /**
   * Refresh balances
   */
  const refreshBalances = useCallback(async () => {
    if (walletState?.address) {
      await fetchBalances(walletState.address);
    }
  }, [walletState, fetchBalances]);

  /**
   * Get wallet address
   */
  const getWalletAddress = useCallback(() => {
    return walletState?.address || null;
  }, [walletState]);

  /**
   * Get chain
   */
  const getChain = useCallback(() => {
    return walletState?.chain || null;
  }, [walletState]);

  /**
   * Auto-reconnect on mount (optional, disabled by default)
   */
  useEffect(() => {
    // Skip if auto-reconnect is disabled
    if (!enableAutoReconnect) {
      return;
    }

    const attemptReconnect = async () => {
      if (
        hasAttemptedReconnect.current ||
        typeof window === "undefined" ||
        isConnecting ||
        isConnected
      ) {
        return;
      }

      hasAttemptedReconnect.current = true;

      const savedWalletType = localStorage.getItem(
        STORAGE_KEY_WALLET_TYPE
      ) as WalletType | null;

      if (!savedWalletType) {
        return;
      }

      // Check if wallet extension is available
      const windowKey =
        savedWalletType === "Keplr"
          ? "keplr"
          : savedWalletType === "Leap"
            ? "leap"
            : "ethereum";

      if (!(windowKey in window)) {
        console.warn(
          `Wallet ${savedWalletType} not available for reconnection`
        );
        // Clear stale data
        localStorage.removeItem(STORAGE_KEY_WALLET_TYPE);
        localStorage.removeItem(STORAGE_KEY_CHAIN);
        return;
      }

      console.log(`Attempting to reconnect to ${savedWalletType}...`);

      try {
        await connectWallet(savedWalletType);
      } catch (error) {
        console.error("Auto-reconnect failed:", error);
        // Clear stale data on failure
        localStorage.removeItem(STORAGE_KEY_WALLET_TYPE);
        localStorage.removeItem(STORAGE_KEY_CHAIN);
        // Reset connecting state to allow manual reconnection
        setIsConnecting(false);
      }
    };

    // Add a small delay to ensure wallet extensions are fully loaded
    const timer = setTimeout(() => {
      attemptReconnect();
    }, 1000); // Increased delay to 1s to ensure extensions are ready

    return () => clearTimeout(timer);
  }, [enableAutoReconnect]); // Only depend on the prop

  /**
   * Periodic balance refresh (every 30 seconds)
   */
  useEffect(() => {
    if (!isConnected || !walletState?.address) {
      return;
    }

    const interval = setInterval(() => {
      refreshBalances();
    }, 30000);

    return () => clearInterval(interval);
  }, [isConnected, walletState, refreshBalances]);

  return (
    <InjectiveWalletContext.Provider
      value={{
        isConnected,
        isConnecting,
        walletState,
        balances,
        isFetchingBalances,
        walletStrategy,
        connectWallet,
        disconnectWallet,
        refreshBalances,
        getWalletAddress,
        getChain,
      }}
    >
      {children}
    </InjectiveWalletContext.Provider>
  );
};

/**
 * Hook to use Injective wallet context
 */
export const useInjectiveWallet = () => {
  const context = useContext(InjectiveWalletContext);
  if (context === undefined) {
    throw new Error(
      "useInjectiveWallet must be used within an InjectiveWalletProvider"
    );
  }
  return context;
};
