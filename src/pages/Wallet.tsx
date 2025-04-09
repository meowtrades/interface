
import { useState } from 'react';
import { Wallet as WalletIcon, CreditCard, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import TokenPriceChart from '@/components/TokenPriceChart';

const Wallet = () => {
  const [selectedChain, setSelectedChain] = useState("ethereum");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [openWithdrawDialog, setOpenWithdrawDialog] = useState(false);
  const [openDepositDialog, setOpenDepositDialog] = useState(false);

  // Mock wallet data (in a real app, this would come from an API or state management)
  const walletData = {
    ethereum: {
      balance: 1.245,
      symbol: "ETH",
      usdValue: 4123.67,
      address: "0x1234...5678",
    },
    bitcoin: {
      balance: 0.089,
      symbol: "BTC",
      usdValue: 5675.32,
      address: "bc1q...9j3m",
    },
    solana: {
      balance: 45.76,
      symbol: "SOL",
      usdValue: 3216.42,
      address: "GVw1...7Kpq",
    }
  };

  const handleChainChange = (value) => {
    setSelectedChain(value);
  };

  const handleDeposit = () => {
    if (!depositAmount || isNaN(parseFloat(depositAmount)) || parseFloat(depositAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // In a real app, this would call an API to handle the deposit
    toast.success(`Deposit of ${depositAmount} ${walletData[selectedChain].symbol} initiated`);
    setDepositAmount("");
    setOpenDepositDialog(false);
  };

  const handleWithdraw = () => {
    if (!withdrawAddress) {
      toast.error("Please enter a valid withdrawal address");
      return;
    }

    if (!withdrawAmount || isNaN(parseFloat(withdrawAmount)) || 
        parseFloat(withdrawAmount) <= 0 || 
        parseFloat(withdrawAmount) > walletData[selectedChain].balance) {
      toast.error("Please enter a valid amount");
      return;
    }

    // In a real app, this would call an API to handle the withdrawal
    toast.success(`Withdrawal of ${withdrawAmount} ${walletData[selectedChain].symbol} to ${withdrawAddress} initiated`);
    setWithdrawAddress("");
    setWithdrawAmount("");
    setOpenWithdrawDialog(false);
  };

  const currentWallet = walletData[selectedChain];

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Wallet</h1>
        <p className="text-slate-600">Manage your crypto assets</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main wallet card */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">Your Balance</CardTitle>
                <CardDescription>Select chain to view balance</CardDescription>
              </div>
              <Select onValueChange={handleChainChange} defaultValue={selectedChain}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select chain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Blockchains</SelectLabel>
                    <SelectItem value="ethereum">Ethereum</SelectItem>
                    <SelectItem value="bitcoin">Bitcoin</SelectItem>
                    <SelectItem value="solana">Solana</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="pb-0">
            <div className="flex flex-col items-start p-6 bg-slate-50 rounded-lg mb-6">
              <div className="flex items-center gap-3 mb-1">
                <div className="h-9 w-9 rounded-full bg-meow-paw/20 flex items-center justify-center">
                  <WalletIcon size={18} className="text-meow-paw" />
                </div>
                <span className="text-sm text-slate-600">Current Balance</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-end gap-1 sm:gap-3">
                <h2 className="text-3xl sm:text-4xl font-bold">
                  {currentWallet.balance} {currentWallet.symbol}
                </h2>
                <p className="text-slate-500 text-lg sm:mb-1">
                  (${currentWallet.usdValue.toLocaleString()})
                </p>
              </div>
            </div>

            {/* Token Price Chart */}
            <TokenPriceChart token={selectedChain as 'ethereum' | 'bitcoin' | 'solana'} height={250} />

            <div className="mt-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <Dialog open={openDepositDialog} onOpenChange={setOpenDepositDialog}>
                  <DialogTrigger asChild>
                    <Button className="flex-1 bg-meow-paw hover:bg-meow-paw/90">
                      <ArrowDownToLine className="mr-2 h-4 w-4" />
                      Deposit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Deposit {currentWallet.symbol}</DialogTitle>
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
                            value={currentWallet.address} 
                            readOnly
                            className="flex-1 bg-slate-50"
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(currentWallet.address);
                              toast.success("Address copied to clipboard");
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
                            {currentWallet.symbol}
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleDeposit}>Confirm Deposit</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={openWithdrawDialog} onOpenChange={setOpenWithdrawDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1">
                      <ArrowUpFromLine className="mr-2 h-4 w-4" />
                      Withdraw
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Withdraw {currentWallet.symbol}</DialogTitle>
                      <DialogDescription>
                        Enter the destination address and amount to withdraw.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="withdraw-address">Destination Address</Label>
                        <Input 
                          id="withdraw-address"
                          placeholder={`Enter ${currentWallet.symbol} address`}
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
                            max={currentWallet.balance}
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                          />
                          <div className="bg-slate-100 px-3 py-2 rounded text-slate-600">
                            {currentWallet.symbol}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500">
                          Available: {currentWallet.balance} {currentWallet.symbol}
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleWithdraw}>Confirm Withdrawal</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction history card */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-xl">Transaction History</CardTitle>
            <CardDescription>Recent wallet activity</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {[
                {id: 1, type: "deposit", amount: "0.45 ETH", time: "2 hours ago"},
                {id: 2, type: "withdraw", amount: "0.12 ETH", time: "1 day ago"},
                {id: 3, type: "deposit", amount: "0.75 ETH", time: "3 days ago"},
              ].map((tx) => (
                <div key={tx.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      tx.type === "deposit" 
                        ? "bg-green-100 text-green-600" 
                        : "bg-amber-100 text-amber-600"
                    }`}>
                      {tx.type === "deposit" 
                        ? <ArrowDownToLine size={14} /> 
                        : <ArrowUpFromLine size={14} />
                      }
                    </div>
                    <div>
                      <div className="font-medium capitalize">{tx.type}</div>
                      <div className="text-xs text-slate-500">{tx.time}</div>
                    </div>
                  </div>
                  <div className="font-medium">
                    {tx.type === "deposit" ? "+" : "-"}{tx.amount}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button variant="link" className="w-full">View All Transactions</Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Wallet;
