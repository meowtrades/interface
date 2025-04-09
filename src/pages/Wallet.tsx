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
import { useWallet } from '@/lib/context/WalletContext';
import { Skeleton } from '@/components/ui/skeleton';

const Wallet = () => {
  const {
    wallets,
    chains,
    tokens,
    isLoading,
    error,
    selectedChain,
    setSelectedChain,
    getSupportedTokensForChain,
    deposit,
    withdraw,
  } = useWallet();

  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [openWithdrawDialog, setOpenWithdrawDialog] = useState(false);
  const [openDepositDialog, setOpenDepositDialog] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);

  // Get the current chain
  const currentChain = chains.find(chain => chain.id === selectedChain) || chains[0];

  // Get supported tokens for the current chain
  const supportedTokens = getSupportedTokensForChain(currentChain?.id || '');

  // Set default token if not set
  if (!selectedTokenId && supportedTokens.length > 0) {
    setSelectedTokenId(supportedTokens[0].id);
  }

  // Get current wallet for selected chain and token
  const currentWallet = wallets.find(
    wallet => wallet.chainId === currentChain?.id && wallet.tokenId === selectedTokenId
  );
  
  // Find the current token
  const currentToken = tokens.find(token => token.id === selectedTokenId);

  const handleChainChange = (value: string) => {
    setSelectedChain(value);
    
    // Reset selected token
    const tokens = getSupportedTokensForChain(value);
    if (tokens.length > 0) {
      setSelectedTokenId(tokens[0].id);
    } else {
      setSelectedTokenId(null);
    }
  };

  const handleTokenChange = (value: string) => {
    setSelectedTokenId(value);
  };

  const handleDeposit = async () => {
    if (!selectedChain || !selectedTokenId) {
      toast.error("Please select a chain and token");
      return;
    }

    if (!depositAmount || isNaN(parseFloat(depositAmount)) || parseFloat(depositAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Call deposit function from context
    const result = await deposit(selectedChain, selectedTokenId, parseFloat(depositAmount));
    if (result) {
      toast.success(`Deposit of ${depositAmount} ${currentToken?.symbol} initiated`);
      setDepositAmount("");
      setOpenDepositDialog(false);
    } else {
      toast.error("Deposit failed");
    }
  };

  const handleWithdraw = async () => {
    if (!selectedChain || !selectedTokenId) {
      toast.error("Please select a chain and token");
      return;
    }

    if (!withdrawAddress) {
      toast.error("Please enter a valid withdrawal address");
      return;
    }

    if (!withdrawAmount || isNaN(parseFloat(withdrawAmount)) || parseFloat(withdrawAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (currentWallet && parseFloat(withdrawAmount) > currentWallet.balance) {
      toast.error("Insufficient balance");
      return;
    }

    // Call withdraw function from context
    const result = await withdraw(
      selectedChain,
      selectedTokenId,
      withdrawAddress,
      parseFloat(withdrawAmount)
    );
    
    if (result) {
      toast.success(`Withdrawal of ${withdrawAmount} ${currentToken?.symbol} to ${withdrawAddress} initiated`);
      setWithdrawAddress("");
      setWithdrawAmount("");
      setOpenWithdrawDialog(false);
    } else {
      toast.error("Withdrawal failed");
    }
  };

  if (error) {
    return (
      <AppLayout>
        <div className="p-4 bg-red-50 text-red-600 rounded-md">
          Error loading wallet data: {error}
        </div>
      </AppLayout>
    );
  }

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
                <CardDescription>Select chain and token to view balance</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select onValueChange={handleChainChange} value={selectedChain || undefined} disabled={isLoading}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Select chain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Blockchains</SelectLabel>
                      {chains.map(chain => (
                        <SelectItem key={chain.id} value={chain.id}>
                          {chain.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                
                <Select onValueChange={handleTokenChange} value={selectedTokenId || undefined} disabled={isLoading}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tokens</SelectLabel>
                      {supportedTokens.map(token => (
                        <SelectItem key={token.id} value={token.id}>
                          {token.symbol}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-start p-6 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3 mb-1">
                <div className="h-9 w-9 rounded-full bg-meow-paw/20 flex items-center justify-center">
                  <WalletIcon size={18} className="text-meow-paw" />
                </div>
                <span className="text-sm text-slate-600">Current Balance</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-end gap-1 sm:gap-3">
                {isLoading ? (
                  <>
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-6 w-24" />
                  </>
                ) : (
                  <>
                    <h2 className="text-3xl sm:text-4xl font-bold">
                      {currentWallet ? currentWallet.balance : 0} {currentToken?.symbol || ''}
                    </h2>
                    <p className="text-slate-500 text-lg sm:mb-1">
                      (${currentWallet ? currentWallet.usdValue.toLocaleString() : '0.00'})
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="mt-6 mb-2">
              <div className="flex flex-col sm:flex-row gap-3">
                <Dialog open={openDepositDialog} onOpenChange={setOpenDepositDialog}>
                  <DialogTrigger asChild>
                    <Button className="flex-1 bg-meow-paw hover:bg-meow-paw/90" disabled={isLoading}>
                      <ArrowDownToLine className="mr-2 h-4 w-4" />
                      Deposit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Deposit {currentToken?.symbol}</DialogTitle>
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
                            value={currentWallet?.address || ''} 
                            readOnly
                            className="flex-1 bg-slate-50"
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              if (currentWallet?.address) {
                                navigator.clipboard.writeText(currentWallet.address);
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
                            {currentToken?.symbol || ''}
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
                    <Button variant="outline" className="flex-1" disabled={isLoading}>
                      <ArrowUpFromLine className="mr-2 h-4 w-4" />
                      Withdraw
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Withdraw {currentToken?.symbol}</DialogTitle>
                      <DialogDescription>
                        Enter the destination address and amount to withdraw.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="withdraw-address">Destination Address</Label>
                        <Input 
                          id="withdraw-address"
                          placeholder={`Enter ${currentToken?.symbol} address`}
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
                            max={currentWallet?.balance}
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                          />
                          <div className="bg-slate-100 px-3 py-2 rounded text-slate-600">
                            {currentToken?.symbol || ''}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500">
                          Available: {currentWallet ? currentWallet.balance : 0} {currentToken?.symbol || ''}
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
            {isLoading ? (
              <div className="p-4 space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : (
              <div className="py-2">
                <p className="text-center py-8 text-slate-500">No recent transactions</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Wallet;
