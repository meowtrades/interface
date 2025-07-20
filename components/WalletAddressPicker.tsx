/** @format */

import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { getKeplrAddress, getLeapWalletAddress, getMetaMaskWalletAddress } from "@/lib/grants/wallet";
import { walletConfigs, getWalletsForChain, BaseWalletConfig } from "@/lib/grants/wallet-config";

interface WalletAddressPickerProps {
  onAddressSelected: (address: string) => void;
  children: React.ReactNode;
  chain?: string; // Add chain prop
}

const WalletAddressPicker = ({ onAddressSelected, children, chain = "injective" }: WalletAddressPickerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loadingWallet, setLoadingWallet] = useState<string | null>(null);

  // Extended wallet options with address retrieval functions
  type WalletAddressOption = BaseWalletConfig & {
    getAddress: () => Promise<string>;
  };

  const allWalletOptions: WalletAddressOption[] = walletConfigs.map(config => {
    let getAddress: () => Promise<string>;
    
    switch (config.name) {
      case "Keplr":
        getAddress = getKeplrAddress;
        break;
      case "Leap":
        getAddress = getLeapWalletAddress;
        break;
      case "MetaMask":
        getAddress = getMetaMaskWalletAddress;
        break;
      default:
        throw new Error(`Unknown wallet: ${config.name}`);
    }
    
    return { ...config, getAddress };
  });

  // Filter wallet options based on chain
  const getWalletOptionsForChain = () => {
    const availableWallets = getWalletsForChain(chain);
    return allWalletOptions.filter(wallet => 
      availableWallets.some(available => available.name === wallet.name)
    );
  };

  const walletOptions = getWalletOptionsForChain();

  const handleWalletSelect = async (wallet: typeof walletOptions[0]) => {
    try {
      setIsLoading(true);
      setLoadingWallet(wallet.name);
      
      const address = await wallet.getAddress();
      onAddressSelected(address);
      setIsDialogOpen(false);
      toast.success(`Address selected from ${wallet.name}`);
    } catch (error) {
      console.error("Error getting wallet address:", error);
      toast.error(`Failed to get address from ${wallet.name}`);
    } finally {
      setIsLoading(false);
      setLoadingWallet(null);
    }
  };

  const availableWallets = walletOptions.filter((wallet) => {
    return typeof window !== "undefined" && wallet.windowKey in window;
  });

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
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
                onClick={() => handleWalletSelect(wallet)}
              >
                <div className="flex items-center gap-3 text-lg">
                  <img src={wallet.icon} alt={`${wallet.name} icon`} className="w-8 h-8" />
                  <span>{wallet.name}</span>
                </div>
                {loadingWallet === wallet.name ? <Loader2 className="animate-spin" /> : null}
              </Button>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No compatible wallets found.</p>
              <p className="text-sm text-gray-400 mt-1">
                {chain.toLowerCase().includes('evm') 
                  ? "Please install MetaMask wallet extension."
                  : "Please install Keplr or Leap wallet extension."
                }
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletAddressPicker; 