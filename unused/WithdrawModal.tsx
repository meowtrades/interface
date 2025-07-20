/** @format */

import { useState } from "react";
import { ArrowUpFromLine } from "lucide-react";
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
import { useWithdrawFunds } from "@/api";
import { ChainToken } from "@/api/types";

type WithdrawModalProps = {
  currentToken: ChainToken;
};

const WithdrawModal = ({ currentToken }: WithdrawModalProps) => {
  const { mutate: withdrawFunds, isPending: isLoading } = useWithdrawFunds();

  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [openWithdrawDialog, setOpenWithdrawDialog] = useState(false);

  const handleWithdraw = async () => {
    if (!withdrawAddress) {
      toast.error("Please enter a valid withdrawal address");
      return;
    }

    if (
      !withdrawAmount ||
      isNaN(parseFloat(withdrawAmount)) ||
      parseFloat(withdrawAmount) <= 0
    ) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (
      currentToken.balance &&
      parseFloat(withdrawAmount) > parseFloat(currentToken.balance)
    ) {
      toast.error("Insufficient balance");
      return;
    }

    // Call withdraw function from context

    withdrawFunds(
      {
        chainId: currentToken.chainId,
        tokenSymbol: currentToken.tokenSymbol,
        amount: withdrawAmount,
        destinationAddress: withdrawAddress,
      },
      {
        onSuccess: () => {
          toast.success(
            `Withdrawal of ${withdrawAmount} ${currentToken?.tokenSymbol} to ${withdrawAddress} initiated`
          );
          setWithdrawAddress("");
          setWithdrawAmount("");
          setOpenWithdrawDialog(false);
        },
        onError: () => {
          toast.error("Withdrawal failed");
        },
      }
    );
  };

  return (
    <Dialog open={openWithdrawDialog} onOpenChange={setOpenWithdrawDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1" disabled={isLoading}>
          <ArrowUpFromLine className="mr-2 h-4 w-4" />
          Withdraw
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Withdraw {currentToken?.tokenSymbol}</DialogTitle>
          <DialogDescription>
            Enter the destination address and amount to withdraw.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="withdraw-address">Destination Address</Label>
            <Input
              id="withdraw-address"
              placeholder={`Enter ${currentToken?.tokenSymbol} address`}
              value={withdrawAddress}
              onChange={(e) => setWithdrawAddress(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="withdraw-amount">Amount</Label>
            <div className="flex items-center gap-2">
              <Input
                id="withdraw-amount"
                type="number"
                placeholder="0.00"
                max={currentToken.balance}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
              <div className="bg-slate-100 px-3 py-2 rounded text-slate-600">
                {currentToken?.tokenSymbol || ""}
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Available: {currentToken.balance}{" "}
              {currentToken?.tokenSymbol || ""}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleWithdraw}>Confirm Withdrawal</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawModal;
