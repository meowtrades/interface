"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { Wallet, LogOut, Coins, ArrowLeftRight } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { walletConfigs } from "@/lib/grants/wallet-config";
import {
  useInjectiveWallet,
  type WalletType,
} from "@/lib/context/InjectiveWalletContext";
import Link from "next/link";

interface ConnectWalletButtonProps {
  variant?: "default" | "secondary" | "outline";
  size?: "default" | "sm" | "lg";
  className?: string;
}

const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({
  variant = "secondary",
  size = "default",
  className = "",
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);

  const {
    isConnected,
    isConnecting,
    walletState,
    balances,
    isFetchingBalances,
    connectWallet,
    disconnectWallet,
  } = useInjectiveWallet();

  const handleWalletConnect = async (walletType: WalletType) => {
    await connectWallet(walletType);
    setIsDialogOpen(false);
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setIsAddressDialogOpen(false);
  };

  const availableWallets = walletConfigs.filter((wallet) => {
    return typeof window !== "undefined" && wallet.windowKey in window;
  });

  const isZero = (bal: number | null | undefined) => {
    if (bal === null || bal === undefined) return true;
    return bal <= 0.00001;
  };

  if (isConnected && walletState) {
    const handleCopyAddress = async () => {
      try {
        await navigator.clipboard.writeText(walletState.address);
        toast.success("Address copied to clipboard");
      } catch {
        toast.error("Failed to copy address");
      }
    };

    return (
      <>
        <div className="flex items-center gap-2">
          {/* Balances or Fund Buttons */}
          <div className="flex items-center gap-2">
            {((balances?.usdt !== undefined && isZero(balances.usdt)) ||
              (balances?.inj !== undefined && isZero(balances.inj))) && (
              <Link href="/faucet">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 px-2 py-1"
                >
                  <ArrowLeftRight size={16} className="mr-2" />
                  Faucet
                </Button>
              </Link>
            )}
            {balances?.inj !== undefined &&
              (isZero(balances.inj) ? null : (
                <span className="flex items-center gap-1 text-sm font-mono bg-secondary rounded px-2 py-1">
                  {isFetchingBalances
                    ? "INJ: ..."
                    : `${balances.inj.toFixed(3)} INJ`}
                </span>
              ))}
            {balances?.usdt !== undefined &&
              (isZero(balances.usdt) ? null : (
                <span className="flex items-center gap-1 text-sm font-mono bg-secondary rounded px-2 py-1">
                  {isFetchingBalances
                    ? "USDT: ..."
                    : `${balances.usdt.toFixed(2)} USDT`}
                </span>
              ))}
          </div>
          <Button
            variant="outline"
            size={size}
            className={`flex items-center gap-2 ${className}`}
            onClick={() => setIsAddressDialogOpen(true)}
          >
            <Wallet size={16} />
            {walletState.address.slice(0, 6)}...{walletState.address.slice(-4)}
          </Button>
        </div>
        <Dialog
          open={isAddressDialogOpen}
          onOpenChange={setIsAddressDialogOpen}
        >
          <DialogContent className="w-80">
            <DialogHeader>
              <DialogTitle>Wallet Actions</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 items-center">
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500">
                  Connected with {walletState.walletType}
                </span>
                <span className="font-mono text-sm break-all text-center">
                  {walletState.address}
                </span>
                <Button variant="ghost" size="sm" onClick={handleCopyAddress}>
                  Copy Address
                </Button>
              </div>
              <Button variant="destructive" onClick={handleDisconnect}>
                <LogOut size={16} className="mr-2" /> Disconnect
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`flex items-center gap-2 ${className}`}
        >
          <Wallet size={16} />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Your Wallet</DialogTitle>
          <DialogDescription>
            Choose a wallet to connect. Keplr and Leap will connect to
            Injective, MetaMask will connect to Injective EVM.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {availableWallets.length > 0 ? (
            availableWallets.map((wallet) => (
              <Button
                key={wallet.name}
                className={`flex items-center gap-3 w-full justify-between h-16 rounded transition-all duration-200 ${wallet.colorTheme}`}
                disabled={isConnecting}
                onClick={() => handleWalletConnect(wallet.name as WalletType)}
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
                <div className="text-sm opacity-80">
                  {wallet.name === "MetaMask" ? "Injective EVM" : "Injective"}
                </div>
              </Button>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No compatible wallets found.</p>
              <p className="text-sm text-gray-400 mt-1">
                Please install Keplr, Leap, or MetaMask wallet extension.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectWalletButton;
