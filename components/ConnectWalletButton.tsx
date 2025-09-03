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
import { Wallet, LogOut, Coins, ArrowLeftRight} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { walletConfigs } from "@/lib/grants/wallet-config";
import { getKeplrAddress, getLeapWalletAddress, getMetaMaskWalletAddress } from "@/lib/grants/wallet";
import { useWallet } from "@/lib/context/WalletContext";
import { useStrategies } from "@/lib/context/StrategiesContext";
import { api } from "@/api/client";
import { fetchWalletBalances } from "@/lib/utils";
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
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<{
    name: string;
    address: string;
    chain: string;
  } | null>(null);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [injBalance, setInjBalance] = useState<number | null>(null);
  const [usdtBalance, setUsdtBalance] = useState<number | null>(null);
  const [isFetchingBalances, setIsFetchingBalances] = useState(false);
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

  // Fetch balances when wallet is connected/changes
  useEffect(() => {
    const fetchBalances = async () => {
      if (!connectedWallet) {
        setInjBalance(null);
        setUsdtBalance(null);
        return;
      }
      try {
        setIsFetchingBalances(true);
        
        // Update user address in backend (optional, continue even if this fails)
        try {
          await api.user.updateAddress(connectedWallet.address);
        } catch (err) {
          console.warn("Failed to update user address in backend:", err);
        }
        
        // Fetch real balances from Injective blockchain
        const balances = await fetchWalletBalances(connectedWallet.address);
        setInjBalance(balances.inj);
        setUsdtBalance(balances.usdt);
        
      } catch (err) {
        console.error("Failed to fetch balances", err);
        // Set zero balances on error
        setInjBalance(0);
        setUsdtBalance(0);
      } finally {
        setIsFetchingBalances(false);
      }
    };
    fetchBalances();
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

  const isZero = (bal: number | string | null | undefined) => {
    if (bal === null || bal === undefined) return true;
    const num = typeof bal === "string" ? parseFloat(bal) : bal;
    return isNaN(num) || num <= 0.00001;
  };

  if (connectedWallet) {
    const handleCopyAddress = async () => {
      try {
        await navigator.clipboard.writeText(connectedWallet.address);
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
            {injBalance !== null && (
              isZero(injBalance) ? (
                <a href="https://faucet.injective.network/" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 px-2 py-1">
                  <Coins size={16} className="mr-2" />
                    Fund INJ
                  </Button>
                </a>
              ) : (
                <span className="flex items-center gap-1 text-sm font-mono bg-secondary rounded px-2 py-1">
                  {isFetchingBalances ? "INJ: ..." : `${injBalance.toFixed(3)} INJ`}
                </span>
              )
            )}
            {usdtBalance !== null && (
              isZero(usdtBalance) ? (
                <Link href="/fund-usdt">
                  <Button variant="outline" size="sm" className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 px-2 py-1">
                  <ArrowLeftRight size={16} className="mr-2" />
                    Fund USDT
                  </Button>
                </Link>
              ) : (
                <span className="flex items-center gap-1 text-sm font-mono bg-secondary rounded px-2 py-1">
                  {isFetchingBalances ? "USDT: ..." : `${usdtBalance.toFixed(2)} USDT`}
                </span>
              )
            )}
          </div>
          <Button
            variant="outline"
            size={size}
            className={`flex items-center gap-2 ${className}`}
            onClick={() => setIsAddressDialogOpen(true)}
          >
            <Wallet size={16} />
            {connectedWallet.address.slice(0, 6)}...{connectedWallet.address.slice(-4)}
          </Button>
        </div>
        <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
          <DialogContent className="w-80">
            <DialogHeader>
              <DialogTitle>Wallet Actions</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 items-center">
              <div className="flex flex-col items-center gap-1">
                <span className="font-mono text-sm break-all text-center">{connectedWallet.address}</span>
                <Button variant="ghost" size="sm" onClick={handleCopyAddress}>
                  Copy Address
                </Button>
              </div>
              <Button variant="destructive" onClick={() => { setIsAddressDialogOpen(false); handleDisconnect(); }}>
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
