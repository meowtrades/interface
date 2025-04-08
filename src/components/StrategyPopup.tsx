
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { LineChart, Wallet, TrendingUp } from "lucide-react";

type StrategyPopupProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: { amount: number; token: string }) => void;
};

const StrategyPopup = ({ open, onOpenChange, onConfirm }: StrategyPopupProps) => {
  const [amount, setAmount] = useState<string>('1000');
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
      <DialogContent className="sm:max-w-[425px] bg-white border border-slate-100 shadow-lg rounded-2xl p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-meow-paw to-meow-tabby p-6 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <TrendingUp className="w-5 h-5" />
              Start Trading Strategy
            </DialogTitle>
            <DialogDescription className="text-white/90 mt-1">
              Set your preferences to begin automated trading
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="p-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              <label htmlFor="token" className="text-sm font-medium text-slate-700">
                Select Asset
              </label>
              <Select value={token} onValueChange={setToken}>
                <SelectTrigger id="token" className="w-full border-slate-200 bg-white rounded-lg">
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="BTC" className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                        <span className="text-amber-600 text-xs font-bold">₿</span>
                      </div>
                      <span>Bitcoin (BTC)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="ETH">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 text-xs font-bold">Ξ</span>
                      </div>
                      <span>Ethereum (ETH)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="SOL">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-600 text-xs font-bold">S</span>
                      </div>
                      <span>Solana (SOL)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="DOGE">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center">
                        <span className="text-yellow-600 text-xs font-bold">D</span>
                      </div>
                      <span>Dogecoin (DOGE)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium text-slate-700">
                Investment Amount
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</div>
                <Input
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-7 border-slate-200"
                  placeholder="Enter amount"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Minimum $100 investment required
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-meow-siamese/30">
                  <LineChart className="w-4 h-4 text-meow-paw" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-700">Strategy Summary</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    This strategy will automatically {token === 'BTC' ? 'buy Bitcoin' : 
                      token === 'ETH' ? 'buy Ethereum' : 
                      token === 'SOL' ? 'buy Solana' : 'buy Dogecoin'} 
                    using dollar-cost averaging across multiple exchanges for optimal pricing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="bg-slate-50 p-6 border-t border-slate-100">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-slate-200 text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-gradient-to-r from-meow-paw to-meow-tabby hover:opacity-90 gap-2"
          >
            <Wallet className="w-4 h-4" />
            Start Strategy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StrategyPopup;
