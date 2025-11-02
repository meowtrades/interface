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

const FaucetPage = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const { toast } = useToast();

  const claimFaucet = useClaimFaucet();
  const checkClaim = useCheckFaucetClaim(); // No longer needs wallet address parameter
  const faucetStats = useFaucetStats();

  const handleClaim = async () => {
    if (!walletAddress.trim()) {
      toast({
        title: "Wallet Address Required",
        description: "Please enter your wallet address",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await claimFaucet.mutateAsync({ walletAddress });

      toast({
        title: "Success! 🎉",
        description: `${result.data.amount} USDT sent to your wallet`,
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
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Droplets className="text-primary" size={20} />
                </div>
                <div>
                  <CardTitle>Claim Tokens</CardTitle>
                  <CardDescription>
                    Get {faucetStats.data?.data.amountPerClaim || "100"} USDT
                    for testing
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Wallet Address Input */}
              <div className="space-y-2">
                <Label htmlFor="wallet" className="text-sm font-medium">
                  Wallet Address
                </Label>
                <div className="relative">
                  <Wallet
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                  <Input
                    id="wallet"
                    placeholder="inj1..."
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
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
                    Successfully claimed {claimFaucet.data.data.amount} USDT!
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
                disabled={isLoading || hasClaimed || !walletAddress.trim()}
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
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Faucet Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Amount per claim
                  </span>
                  <span className="font-semibold">
                    {faucetStats.data?.data.amountPerClaim || "100"} USDT
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total claims</span>
                  <span className="font-semibold">
                    {faucetStats.data?.data.totalClaims || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Total distributed
                  </span>
                  <span className="font-semibold">
                    {faucetStats.data?.data.totalDistributed?.toLocaleString() ||
                      0}{" "}
                    USDT
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  One claim per account. Use these tokens to test trading
                  strategies on Injective testnet.
                </p>
              </div>
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
