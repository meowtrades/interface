/** @format */

"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { toast } from "sonner";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  useInjectiveWallet,
  type WalletType,
} from "@/lib/context/InjectiveWalletContext";
import { walletConfigs, getWalletsForChain } from "@/lib/grants/wallet-config";
import Image from "next/image";

interface WalletAddressPickerProps {
  onAddressSelected: (address: string) => void;
  children: React.ReactNode;
  chain?: string;
}

const WalletAddressPicker = ({
  onAddressSelected,
  children,
  chain = "injective",
}: WalletAddressPickerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loadingWallet, setLoadingWallet] = useState<string | null>(null);

  const { isConnected, walletState, connectWallet } = useInjectiveWallet();

  // Filter wallet options based on chain
  const walletsForChain = getWalletsForChain(chain);
  const availableWallets = walletsForChain.filter((wallet) => {
    return typeof window !== "undefined" && wallet.windowKey in window;
  });

  const handleWalletSelect = async (walletType: WalletType) => {
    try {
      setIsLoading(true);
      setLoadingWallet(walletType);

      // If already connected to the same wallet, use existing address
      if (isConnected && walletState?.walletType === walletType) {
        onAddressSelected(walletState.address);
        setIsDialogOpen(false);
        toast.success(`Address selected from ${walletType}`);
        return;
      }

      // Otherwise, connect to the wallet
      await connectWallet(walletType);

      // After connection, the walletState will be updated
      // We need to wait a tick for the state to update
      setTimeout(() => {
        if (walletState?.address) {
          onAddressSelected(walletState.address);
          setIsDialogOpen(false);
          toast.success(`Address selected from ${walletType}`);
        }
      }, 100);
    } catch (error) {
      console.error("Error getting wallet address:", error);
      toast.error(`Failed to get address from ${walletType}`);
    } finally {
      setIsLoading(false);
      setLoadingWallet(null);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Your Wallet</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {availableWallets.length > 0 ? (
            availableWallets.map((wallet) => (
              <Button
                key={wallet.name}
                className={`flex items-center gap-2 w-full justify-between h-16 rounded ${wallet.colorTheme}`}
                disabled={isLoading}
                onClick={() => handleWalletSelect(wallet.name as WalletType)}
              >
                <div className="flex items-center gap-3 text-lg">
                  <Image
                    width={32}
                    height={32}
                    src={wallet.icon}
                    alt={`${wallet.name} icon`}
                    className="w-8 h-8"
                  />
                  <span>{wallet.name}</span>
                </div>
                {loadingWallet === wallet.name ? (
                  <Loader2 className="animate-spin" />
                ) : null}
              </Button>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No compatible wallets found.</p>
              <p className="text-sm text-gray-400 mt-1">
                {chain.toLowerCase().includes("evm")
                  ? "Please install MetaMask wallet extension."
                  : "Please install Keplr or Leap wallet extension."}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletAddressPicker;
