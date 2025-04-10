import { useEffect, useState } from "react";
import { LoaderPinwheel, Wallet as WalletIcon } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserBalances, ChainToken } from "@/api";
import WithdrawModal from "@/components/WithdrawModal";
import DepositModal from "@/components/DepositModal";

const Wallet = () => {
  const { data: userBalances, isLoading, error } = useUserBalances();

  const [selectedChain, setSelectedChain] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState<ChainToken | null>(null);

  const availableChains = [
    ...new Set(userBalances?.map((chainToken) => chainToken.chainId)),
  ];

  const supportedTokens = selectedChain
    ? userBalances?.filter((chainToken) => chainToken.chainId === selectedChain)
    : [];

  const handleChainChange = (value: string) => {
    setSelectedChain(value);

    // Reset selected token
    const tokens = userBalances?.filter(
      (chainToken) => chainToken.chainId === value
    );

    if (tokens.length > 0) {
      setSelectedToken(tokens[0]);
    } else {
      setSelectedToken(null);
    }
  };

  const handleTokenChange = (value: string) => {
    const token = supportedTokens.find((token) => token.tokenSymbol === value);
    if (token) {
      setSelectedToken(token);
    }
  };

  useEffect(() => {
    if (!selectedChain && !isLoading) {
      handleChainChange(availableChains[0]);
    }
  }, [selectedChain, isLoading]);

  if (error) {
    return (
      <AppLayout>
        <div className="p-4 bg-red-50 text-red-600 rounded-md">
          Error loading wallet data: {error.message}
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
                <CardDescription>
                  Select chain and token to view balance
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  onValueChange={handleChainChange}
                  value={selectedChain || undefined}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Select chain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Blockchains</SelectLabel>
                      {availableChains.map((id) => (
                        <SelectItem key={id} value={id}>
                          {
                            userBalances?.find(
                              (chainToken) => chainToken.chainId === id
                            )?.chainName
                          }
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select
                  onValueChange={handleTokenChange}
                  value={selectedToken?.tokenSymbol || undefined}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tokens</SelectLabel>
                      {supportedTokens.map((token) => (
                        <SelectItem
                          key={token.tokenSymbol}
                          value={token.tokenSymbol}
                        >
                          {token.tokenSymbol}
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
                      {selectedToken?.balance || 0}{" "}
                      {selectedToken?.tokenSymbol || ""}
                    </h2>
                    <p className="text-slate-500 text-lg sm:mb-1">
                      ($
                      {selectedToken?.usdValue.toLocaleString() || "0.00"})
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="mt-6 mb-2">
              {!!selectedToken && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <DepositModal currentToken={selectedToken} />

                  <WithdrawModal currentToken={selectedToken} />
                </div>
              )}
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
                <p className="text-center py-8 text-slate-500">
                  No recent transactions
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Wallet;
