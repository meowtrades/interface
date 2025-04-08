
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Cat } from "lucide-react";

type StrategyPopupProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: { amount: number; token: string }) => void;
};

const StrategyPopup = ({ open, onOpenChange, onConfirm }: StrategyPopupProps) => {
  const [amount, setAmount] = useState<string>('100');
  const [token, setToken] = useState<string>('BTC');
  
  const handleSubmit = () => {
    // Simple validation
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    // Confirm and close
    onConfirm({
      amount: Number(amount),
      token
    });
    
    toast.success("Strategy started successfully!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cat className="w-5 h-5 text-meow-paw" />
            Start Your Strategy
          </DialogTitle>
          <DialogDescription>
            Enter the details below to start your trading strategy.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="token" className="text-sm font-medium col-span-1">
              Token
            </label>
            <Select value={token} onValueChange={setToken}>
              <SelectTrigger id="token" className="col-span-3">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                <SelectItem value="SOL">Solana (SOL)</SelectItem>
                <SelectItem value="DOGE">Dogecoin (DOGE)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="amount" className="text-sm font-medium col-span-1">
              Amount
            </label>
            <div className="relative col-span-3">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
              <Input
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7"
                placeholder="Enter amount"
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-gradient-to-r from-meow-paw to-meow-tabby">
            Start Strategy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StrategyPopup;
