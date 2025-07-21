/** @format */

import { getAvailableWalletsForChain } from "@/lib/grants/available-wallets";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { MANAGEMENT_FEE } from "@/lib/constants";

const WalletPicker = ({
  callback,
  disabled = false,
  enteredBalance,
  chain = "injective", // Default to injective chain
}: {
  callback: (data: unknown) => Promise<void>;
  disabled?: boolean;
  enteredBalance?: number;
  chain?: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isWalletGrantPending, setisWalletGrantPending] = useState(false);

  // Get wallets based on the selected chain
  const walletsForChain = getAvailableWalletsForChain(chain);

  return (
    <Dialog open={isWalletGrantPending} onOpenChange={setisWalletGrantPending}>
      <DialogTrigger asChild>
        <Button
          disabled={disabled}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-sm hover:shadow-md transition-all duration-200"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : "Start Strategy"}
        </Button>
      </DialogTrigger>{" "}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a Wallet</DialogTitle>
        </DialogHeader>
        {walletsForChain
          .filter((wallet) => {
            return typeof window !== "undefined" && wallet.windowKey in window;
          })
          .map((wallet) => {
            return (
              <div key={wallet.name} className="wallet-option">
                <Button
                  variant="ghost"
                  className={`flex items-center gap-2 w-full justify-between h-16 rounded transition-all duration-200 ${wallet.colorTheme}`}
                  disabled={isLoading}
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      setisWalletGrantPending(true);
                      await wallet.action(enteredBalance || 0);
                      setisWalletGrantPending(false);
                      toast.success(`Permission granted for ${wallet.name}`);
                      await callback(wallet.name);
                    } catch (error) {
                      console.error("Wallet grant error:", error);

                      // Check if it's an insufficient balance error
                      if (
                        error instanceof Error &&
                        error.message.includes("Insufficient USDT balance")
                      ) {
                        const totalRequired =
                          (enteredBalance || 0) * (1 + MANAGEMENT_FEE);
                        toast.error("Insufficient Balance", {
                          description: `You need $${totalRequired.toFixed(
                            2
                          )} USDT (including ${(MANAGEMENT_FEE * 100).toFixed(
                            1
                          )}% management fee) to start this strategy. Please add funds to your wallet.`,
                          duration: 6000,
                        });
                      } else {
                        toast.error("Unable to grant access to wallet");
                      }
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                >
                  <div className="flex items-center gap-3 text-lg">
                    <img src={wallet.icon} alt={`${wallet.name} icon`} />
                    <span>{wallet.name}</span>
                  </div>
                  {isLoading ? <Loader2 className="animate-spin" /> : null}
                </Button>
              </div>
            );
          })}
      </DialogContent>
    </Dialog>
  );
};

export default WalletPicker;
