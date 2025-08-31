"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { Wallet, LogOut } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { walletConfigs } from "@/lib/grants/wallet-config";
import { getKeplrAddress, getLeapWalletAddress, getMetaMaskWalletAddress } from "@/lib/grants/wallet";
import { useWallet } from "@/lib/context/WalletContext";
import { useStrategies } from "@/lib/context/StrategiesContext";

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
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<{
    name: string;
    address: string;
    chain: string;
  } | null>(null);
  const { setSelectedChain: setWalletChain } = useWallet();
  const { setSelectedChain: setStrategyChain } = useStrategies();

  // Load wallet connection state from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("connectedWallet");
      if (saved) {
        const walletData = JSON.parse(saved);
        setConnectedWallet(walletData);
        setWalletChain(walletData.chain);
        setTimeout(() => {
          setStrategyChain(walletData.chain);
        }, 100);
      }
    }
  }, [setWalletChain, setStrategyChain]);

  // Sync with StrategiesContext whenever connectedWallet changes
  useEffect(() => {
    if (connectedWallet) {
      const timer = setTimeout(() => {
        setStrategyChain(connectedWallet.chain);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [connectedWallet, setStrategyChain]);

  // Save wallet connection state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (connectedWallet) {
        localStorage.setItem("connectedWallet", JSON.stringify(connectedWallet));
      } else {
        localStorage.removeItem("connectedWallet");
      }
    }
  }, [connectedWallet]);

  const handleWalletConnect = async (walletName: string) => {
    try {
      setIsConnecting(true);
      let address: string;
      let chain: string;

      switch (walletName) {
        case "Keplr":
        case "Leap":
          chain = "injective";
          setWalletChain(chain);
          setStrategyChain(chain);
          address = walletName === "Keplr"
            ? await getKeplrAddress()
            : await getLeapWalletAddress();
          break;

        case "MetaMask":
          chain = "injective-evm";
          setWalletChain(chain);
          setStrategyChain(chain);
          address = await getMetaMaskWalletAddress();
          break;

        default:
          throw new Error(`Unsupported wallet: ${walletName}`);
      }

      setConnectedWallet({ name: walletName, address, chain });
      setIsDialogOpen(false);

      // Multiple attempts to ensure strategy chain is set correctly
      setTimeout(() => {
        setStrategyChain(chain);
      }, 200);
      setTimeout(() => {
        setStrategyChain(chain);
      }, 500);
      setTimeout(() => {
        setStrategyChain(chain);
      }, 1000);

      toast.success(`Connected to ${walletName} on ${chain}`);
    } catch (error) {
      console.error("Wallet connection error:", error);
      toast.error(`Failed to connect to ${walletName}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setConnectedWallet(null);
    toast.success("Wallet disconnected");
  };

  const availableWallets = walletConfigs.filter((wallet) => {
    return typeof window !== "undefined" && wallet.windowKey in window;
  });

  if (connectedWallet) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size={size}
          className={`flex items-center gap-2 ${className}`}
          onClick={handleDisconnect}
        >
          <Wallet size={16} />
          {connectedWallet.address.slice(0, 6)}...{connectedWallet.address.slice(-4)}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDisconnect}
          className="px-2"
          title="Disconnect wallet"
        >
          <LogOut size={14} />
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={`flex items-center gap-2 ${className}`}>
          <Wallet size={16} />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Your Wallet</DialogTitle>
          <DialogDescription>
            Choose a wallet to connect. Keplr and Leap will connect to Injective, MetaMask will connect to Injective EVM.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {availableWallets.length > 0 ? (
            availableWallets.map((wallet) => (
              <Button
                key={wallet.name}
                className={`flex items-center gap-3 w-full justify-between h-16 rounded transition-all duration-200 ${wallet.colorTheme}`}
                disabled={isConnecting}
                onClick={() => handleWalletConnect(wallet.name)}
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
