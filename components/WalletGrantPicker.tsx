/** @format */

"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { MANAGEMENT_FEE } from "@/lib/constants";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import {
  useInjectiveWallet,
  type WalletType,
} from "@/lib/context/InjectiveWalletContext";
import { walletConfigs, getWalletsForChain } from "@/lib/grants/wallet-config";
import {
  getKeplrGrant,
  getLeapGrant,
  getMetaMaskGrant,
} from "@/lib/grants/auth-z";

interface WalletGrantPickerProps {
  callback: (walletType: string) => Promise<void>;
  disabled?: boolean;
  enteredBalance?: number;
  chain?: string;
  useMyAddress?: boolean;
  onWalletAddressReceived?: (address: string) => void;
}

const WalletGrantPicker = ({
  callback,
  disabled = false,
  enteredBalance,
  chain = "injective",
  useMyAddress = false,
  onWalletAddressReceived,
}: WalletGrantPickerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isWalletGrantPending, setisWalletGrantPending] = useState(false);
  const [loadingWallet, setLoadingWallet] = useState<string | null>(null);

  const { isConnected, walletState, connectWallet } = useInjectiveWallet();

  // Get grant function based on wallet type
  const getGrantFunction = (walletType: WalletType) => {
    switch (walletType) {
      case "Keplr":
        return getKeplrGrant;
      case "Leap":
        return getLeapGrant;
      case "MetaMask":
        return getMetaMaskGrant;
      default:
        throw new Error(`Unknown wallet: ${walletType}`);
    }
  };

  // Get wallets based on the selected chain
  const walletsForChain = getWalletsForChain(chain);
  const availableWallets = walletsForChain.filter((wallet) => {
    return typeof window !== "undefined" && wallet.windowKey in window;
  });

  const handleQuickGrant = async () => {
    if (!isConnected || !walletState) {
      setisWalletGrantPending(true);
      return;
    }

    setIsLoading(true);
    try {
      // If useMyAddress is true, provide the address
      if (useMyAddress && onWalletAddressReceived) {
        onWalletAddressReceived(walletState.address);
      }

      // Attempt grant with connected wallet
      const grantFn = getGrantFunction(walletState.walletType);
      await grantFn(enteredBalance || 0);

      toast.success(`Permission granted for ${walletState.walletType}`);
      await callback(walletState.walletType);
    } catch (error) {
      // If quick path fails, fall back to dialog
      const msg = error instanceof Error ? error.message : String(error);
      if (msg?.includes("USDT balance not found")) {
        toast.error("USDT not found", {
          description:
            "We couldn't find USDT in your wallet. Please deposit USDT and try again.",
          duration: 6000,
        });
      } else if (msg?.includes("Insufficient USDT balance")) {
        const totalRequired = (enteredBalance || 0) * (1 + MANAGEMENT_FEE);
        toast.error("Insufficient Balance", {
          description: `You need $${totalRequired.toFixed(
            2
          )} USDT (including ${(MANAGEMENT_FEE * 100).toFixed(
            1
          )}% management fee) to start this strategy. Please add funds to your wallet.`,
          duration: 6000,
        });
      } else if (
        !msg?.toLowerCase().includes("rejected") &&
        !msg?.toLowerCase().includes("user cancelled")
      ) {
        // For other errors, show dialog for manual wallet selection
        setisWalletGrantPending(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletGrant = async (walletType: WalletType) => {
    try {
      setIsLoading(true);
      setLoadingWallet(walletType);
      setisWalletGrantPending(true);

      // First, ensure wallet is connected
      if (!isConnected || walletState?.walletType !== walletType) {
        await connectWallet(walletType);
      }

      // If useMyAddress is true, provide the address
      if (useMyAddress && onWalletAddressReceived && walletState) {
        onWalletAddressReceived(walletState.address);
      }

      // Grant phase
      try {
        const grantFn = getGrantFunction(walletType);
        await grantFn(enteredBalance || 0);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);

        if (msg?.includes("USDT balance not found")) {
          toast.error("USDT not found", {
            description:
              "We couldn't find USDT in your wallet. Please deposit USDT and try again.",
            duration: 6000,
          });
          return;
        } else if (msg?.includes("Insufficient USDT balance")) {
          const totalRequired = (enteredBalance || 0) * (1 + MANAGEMENT_FEE);
          toast.error("Insufficient Balance", {
            description: `You need $${totalRequired.toFixed(
              2
            )} USDT (including ${(MANAGEMENT_FEE * 100).toFixed(
              1
            )}% management fee) to start this strategy. Please add funds to your wallet.`,
            duration: 6000,
          });
          return;
        } else if (
          msg?.toLowerCase().includes("rejected") ||
          msg?.toLowerCase().includes("user cancelled")
        ) {
          toast.message(`${walletType} request was cancelled`);
          return;
        } else {
          toast.error(`Unable to grant access to ${walletType}`);
          return;
        }
      }

      setisWalletGrantPending(false);
      toast.success(`Permission granted for ${walletType}`);
      await callback(walletType);
    } catch (error) {
      console.error("Wallet grant error:", error);
    } finally {
      setLoadingWallet(null);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isWalletGrantPending} onOpenChange={setisWalletGrantPending}>
      <div>
        <Button
          disabled={disabled}
          loading={isLoading}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-sm hover:shadow-md transition-all duration-200"
          onClick={handleQuickGrant}
        >
          Start Strategy
        </Button>
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a Wallet</DialogTitle>
        </DialogHeader>
        {availableWallets.map((wallet) => {
          return (
            <div key={wallet.name} className="wallet-option">
              <Button
                variant="ghost"
                className={`flex items-center gap-2 w-full h-16 rounded transition-all duration-200 ${wallet.colorTheme}`}
                disabled={isLoading}
                onClick={() => handleWalletGrant(wallet.name as WalletType)}
              >
                <div className="flex items-center gap-3 text-lg">
                  <Image
                    width={32}
                    height={32}
                    src={wallet.icon}
                    alt={`${wallet.name} icon`}
                  />
                  <span>{wallet.name}</span>
                </div>
                <span className="ml-auto w-4 h-4 flex items-center justify-center">
                  {loadingWallet === wallet.name ? (
                    <Loader2 className="animate-spin" />
                  ) : null}
                </span>
              </Button>
            </div>
          );
        })}
      </DialogContent>
    </Dialog>
  );
};

export default WalletGrantPicker;
