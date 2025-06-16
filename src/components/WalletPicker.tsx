/** @format */

import { availableWallets } from "@/lib/grants/available-wallets";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const WalletPicker = ({
  callback,
}: {
  callback: (data: unknown) => Promise<void>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isWalletGrantPending, setisWalletGrantPending] = useState(false);

  return (
    <Dialog open={isWalletGrantPending} onOpenChange={setisWalletGrantPending}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          {isLoading ? <Loader2 className="animate-spin" /> : "Start Strategy"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <h2>Select a Wallet</h2>
        {availableWallets
          .filter((wallet) => {
            return typeof window !== "undefined" && window[wallet.windowKey];
          })
          .map((wallet) => {
            return (
              <div key={wallet.name} className="wallet-option">
                <Button
                  className={`flex items-center gap-2 w-full justify-between h-16 rounded ${wallet.colorTheme}`}
                  disabled={isLoading}
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      setisWalletGrantPending(true);
                      await wallet.action();
                      setisWalletGrantPending(false);
                      toast.success(`Permission granted for ${wallet.name}`);
                      await callback(wallet.name);
                    } catch (error) {
                      toast.error("Unable to grant access to wallet");
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
