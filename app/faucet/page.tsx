/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Droplets,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Wallet,
  ArrowRight,
} from "lucide-react";
import {
  useClaimFaucet,
  useCheckFaucetClaim,
  useFaucetStats,
} from "@/api/hooks";
import { useToast } from "@/hooks/use-toast";
import { getInjectiveAddress, getEthereumAddress } from "@injectivelabs/sdk-ts";

const FaucetPage = () => {
  const [injectiveAddress, setInjectiveAddress] = useState("");
  const [evmAddress, setEvmAddress] = useState("");
  const { toast } = useToast();

  const claimFaucet = useClaimFaucet();
  const checkClaim = useCheckFaucetClaim(); // No longer needs wallet address parameter
  const faucetStats = useFaucetStats();

  // Handle address changes with auto-conversion
  const handleInjectiveAddressChange = (value: string) => {
    setInjectiveAddress(value);
    if (value.startsWith("inj1") && value.length === 43) {
      try {
        const ethAddr = getEthereumAddress(value);
        setEvmAddress(ethAddr);
      } catch (error) {
        // Invalid address, don't update EVM
      }
    }
  };

  const handleEvmAddressChange = (value: string) => {
    setEvmAddress(value);
    if (value.startsWith("0x") && value.length === 42) {
      try {
        const injAddr = getInjectiveAddress(value);
        setInjectiveAddress(injAddr);
      } catch (error) {
        // Invalid address, don't update Injective
      }
    }
  };

  const handleClaim = async () => {
    if (!injectiveAddress.trim()) {
      toast({
        title: "Wallet Address Required",
        description: "Please enter your wallet address",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await claimFaucet.mutateAsync({
        walletAddress: injectiveAddress,
      });

      toast({
        title: "Success! 🎉",
        description: `${result.data.amount} USDT + 0.01 INJ sent to your wallet`,
      });

      // Refetch claim status
      checkClaim.refetch();
    } catch (error: any) {
      toast({
        title: "Claim Failed",
        description:
          error.response?.data?.message ||
          error.message ||
          "Failed to claim from faucet",
        variant: "destructive",
      });
    }
  };

  const hasClaimed = checkClaim.data?.hasClaimed;
  const isLoading = claimFaucet.isPending;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Testnet Faucet
            </h1>
            <p className="text-muted-foreground mt-1">
              Claim free testnet USDT to start trading
            </p>
          </div>
        </div>

        {/* Main Faucet Card */}
        <div className="grid gap-6 ">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Droplets className="text-primary" size={20} />
                </div>
                <div>
                  <CardTitle>Claim Tokens</CardTitle>
                  <CardDescription>
                    Get {faucetStats.data?.data.amountPerClaim || "100"} USDT +
                    0.01 INJ for testing
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Injective Address Input */}
              <div className="space-y-2">
                <Label
                  htmlFor="injective-address"
                  className="text-sm font-medium"
                >
                  Injective Address
                </Label>
                <div className="relative">
                  <Wallet
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                  <Input
                    id="injective-address"
                    placeholder="inj1..."
                    value={injectiveAddress}
                    onChange={(e) =>
                      handleInjectiveAddressChange(e.target.value)
                    }
                    disabled={isLoading || hasClaimed}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* OR Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">OR</span>
                </div>
              </div>

              {/* EVM Address Input */}
              <div className="space-y-2">
                <Label htmlFor="evm-address" className="text-sm font-medium">
                  EVM address
                </Label>
                <div className="relative">
                  <Wallet
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                  <Input
                    id="evm-address"
                    placeholder="0x..."
                    value={evmAddress}
                    onChange={(e) => handleEvmAddressChange(e.target.value)}
                    disabled={isLoading || hasClaimed}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Messages */}
              {hasClaimed && (
                <Alert className="border-orange-500/50 bg-orange-500/10">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <AlertDescription className="text-sm">
                    You have already claimed from the faucet.
                    {checkClaim.data?.claim?.txHash && (
                      <a
                        href={`https://testnet.explorer.injective.network/transaction/${checkClaim.data.claim.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 mt-2 text-orange-600 hover:text-orange-700 font-medium"
                      >
                        View Transaction <ExternalLink size={14} />
                      </a>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {claimFaucet.isSuccess && (
                <Alert className="border-green-500/50 bg-green-500/10">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-sm">
                    Successfully claimed {claimFaucet.data.data.amount} USDT +
                    0.01 INJ!
                    <a
                      href={`https://testnet.explorer.injective.network/transaction/${claimFaucet.data.data.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 mt-2 text-green-600 hover:text-green-700 font-medium"
                    >
                      View Transaction <ExternalLink size={14} />
                    </a>
                  </AlertDescription>
                </Alert>
              )}

              {/* Claim Button */}
              <Button
                onClick={handleClaim}
                disabled={isLoading || hasClaimed || !injectiveAddress.trim()}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : hasClaimed ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Already Claimed
                  </>
                ) : (
                  <>
                    Claim {faucetStats.data?.data.amountPerClaim || "100"} USDT
                    + 0.01 INJ
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps Card */}
        <Card>
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
            <CardDescription>
              Start exploring automated trading strategies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Browse our collection of one-click trading strategies and deploy
                them with your testnet funds.
              </p>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/app/strategies")}
              >
                View Strategies
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default FaucetPage;
