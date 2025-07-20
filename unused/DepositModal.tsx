import { useState } from "react";
import { ArrowDownToLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ChainToken, useDepositFunds } from "@/api";

type DepositModalProps = {
  currentToken: ChainToken;
};

const DepositModal = ({ currentToken }: DepositModalProps) => {
  const { mutate: depositFunds, isPending: isLoading } = useDepositFunds();

  const [depositAmount, setDepositAmount] = useState("");
  const [openDepositDialog, setOpenDepositDialog] = useState(false);

  const handleDeposit = async () => {
    if (
      !depositAmount ||
      isNaN(parseFloat(depositAmount)) ||
      parseFloat(depositAmount) <= 0
    ) {
      toast.error("Please enter a valid amount");
      return;
    }

    depositFunds(
      {
        chainId: currentToken.chainId,
        tokenSymbol: currentToken.tokenSymbol,
        amount: depositAmount,
        txHash: "",
      },
      {
        onSuccess: () => {
          toast.success(
            `Deposit of ${depositAmount} ${currentToken?.tokenSymbol} initiated`
          );
          setDepositAmount("");
          setOpenDepositDialog(false);
        },
        onError: () => {
          toast.error("Deposit failed");
        },
      }
    );
  };

  return (
    <Dialog open={openDepositDialog} onOpenChange={setOpenDepositDialog}>
      <DialogTrigger asChild>
        <Button
          className="flex-1 bg-meow-paw hover:bg-meow-paw/90"
          disabled={isLoading}
        >
          <ArrowDownToLine className="mr-2 h-4 w-4" />
          Deposit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deposit {currentToken?.tokenSymbol}</DialogTitle>
          <DialogDescription>
            Send funds to the address below to deposit into your wallet.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="deposit-address">Your deposit address</Label>
            <div className="flex items-center gap-2">
              <Input
                id="deposit-address"
                value={""}
                readOnly
                className="flex-1 bg-slate-50"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (currentToken?.tokenSymbol) {
                    navigator.clipboard.writeText(currentToken.tokenSymbol);
                    toast.success("Address copied to clipboard");
                  }
                }}
              >
                Copy
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="deposit-amount">Amount to deposit</Label>
            <div className="flex items-center gap-2">
              <Input
                id="deposit-amount"
                type="number"
                placeholder="0.00"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
              <div className="bg-slate-100 px-3 py-2 rounded text-slate-600">
                {currentToken?.tokenSymbol || ""}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleDeposit}>Confirm Deposit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DepositModal;
