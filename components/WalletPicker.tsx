/** @format */

import { getAvailableWalletsForChain } from "@/lib/grants/available-wallets";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { MANAGEMENT_FEE } from "@/lib/constants";
import Image from "next/image";
import { WalletStrategy } from "@injectivelabs/wallet-strategy";
import { Wallet } from "@injectivelabs/wallet-base";
import { ChainId, EthereumChainId } from "@injectivelabs/ts-types";
import { getInjectiveAddress } from "@injectivelabs/sdk-ts";
import { Loader2 } from "lucide-react";

const WalletPicker = ({
  callback,
  disabled = false,
  enteredBalance,
  chain = "injective", // Default to injective chain
  useMyAddress = false,
  onWalletAddressReceived,
}: {
  callback: (data: unknown) => Promise<void>;
  disabled?: boolean;
  enteredBalance?: number;
  chain?: string;
  useMyAddress?: boolean;
  onWalletAddressReceived?: (address: string) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isWalletGrantPending, setisWalletGrantPending] = useState(false);
  const storageKey = `lastWallet:${chain}`;
  const [loadingWallet, setLoadingWallet] = useState<string | null>(null);

  // Get wallets based on the selected chain
  const walletsForChain = getAvailableWalletsForChain(chain);

  // Function to get wallet address for "use my address" functionality
  const getWalletAddress = async (walletName: string): Promise<string> => {
    let walletType: Wallet;

    switch (walletName) {
      case "Keplr":
        walletType = Wallet.Keplr;
        break;
      case "Leap":
        walletType = Wallet.Leap;
        break;
      case "MetaMask":
        walletType = Wallet.Metamask;
        break;
      default:
        throw new Error(`Unknown wallet: ${walletName}`);
    }

    const walletStrategy = new WalletStrategy({
      chainId: ChainId.Testnet,
      wallet: walletType,
      strategies: {},
      ...(walletType === Wallet.Metamask && {
        ethereumOptions: {
          ethereumChainId: EthereumChainId.Injective,
        },
      }),
    });

    await walletStrategy.enable();
    const [address] = await walletStrategy.getAddresses();

    // For MetaMask, convert to Injective address
    if (walletType === Wallet.Metamask) {
      return getInjectiveAddress(address);
    }

    return address;
  };

  return (
    <Dialog open={isWalletGrantPending} onOpenChange={setisWalletGrantPending}>
      <div>
        <Button
          disabled={disabled}
          loading={isLoading}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-sm hover:shadow-md transition-all duration-200"
          onClick={async () => {
            if (disabled) return;
            const lastWalletName =
              typeof window !== "undefined"
                ? window.localStorage.getItem(storageKey)
                : null;

            // If we don't have a cached wallet, open the dialog
            if (!lastWalletName) {
              setisWalletGrantPending(true);
              return;
            }

            const wallet = walletsForChain.find((w) => w.name === lastWalletName);
            if (!wallet) {
              setisWalletGrantPending(true);
              return;
            }

            setIsLoading(true);
            try {
              // If useMyAddress is true, try to fetch address; if it fails, open dialog
              if (useMyAddress && onWalletAddressReceived) {
                try {
                  const addr = await getWalletAddress(wallet.name);
                  onWalletAddressReceived(addr);
                } catch {
                  setisWalletGrantPending(true);
                  return;
                }
              }

              // Attempt grant with last used wallet (no dialog)
              await wallet.action(enteredBalance || 0);
              toast.success(`Permission granted for ${wallet.name}`);
              if (typeof window !== "undefined") {
                window.localStorage.setItem(storageKey, wallet.name);
              }
              await callback(wallet.name);
            } catch (error) {
              // If quick path fails (revoked permission, network, etc.), fall back to dialog
              const msg = error instanceof Error ? error.message : String(error);
              if (msg?.includes("USDT balance not found")) {
                toast.error("USDT not found", {
                  description:
                    "We couldn't find USDT in your wallet. Please deposit USDT and try again.",
                  duration: 6000,
                });
              } else if (msg?.includes("Insufficient USDT balance")) {
                const totalRequired = (enteredBalance || 0) * (1 + MANAGEMENT_FEE);
                toast.error("Insufficient Balance", {
                  description: `You need $${totalRequired.toFixed(
                    2
                  )} USDT (including ${(MANAGEMENT_FEE * 100).toFixed(
                    1
                  )}% management fee) to start this strategy. Please add funds to your wallet.`,
                  duration: 6000,
                });
              }
              setisWalletGrantPending(true);
            } finally {
              setIsLoading(false);
            }
          }}
        >
          Start Strategy
        </Button>
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a Wallet</DialogTitle>
        </DialogHeader>
        {walletsForChain
          .filter((wallet) => {
            return typeof window !== "undefined" && wallet.windowKey in window;
          })
          .map((wallet) => {
            return (
              <div key={wallet.name} className="wallet-option">
                <Button
                  variant="ghost"
                  className={`flex items-center gap-2 w-full h-16 rounded transition-all duration-200 ${wallet.colorTheme}`}
                  disabled={isLoading}
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      setLoadingWallet(wallet.name);
                      setisWalletGrantPending(true);

                      // If useMyAddress is true, first get the wallet address
                      if (useMyAddress && onWalletAddressReceived) {
                        const walletAddress = await getWalletAddress(
                          wallet.name
                        );
                        onWalletAddressReceived(walletAddress);
                      }

                      // Grant phase
                      try {
                        await wallet.action(enteredBalance || 0);
                      } catch (error) {
                        const msg =
                          error instanceof Error ? error.message : String(error);

                        if (msg?.includes("USDT balance not found")) {
                          toast.error("USDT not found", {
                            description:
                              "We couldn't find USDT in your wallet. Please deposit USDT and try again.",
                            duration: 6000,
                          });
                          return;
                        } else if (msg?.includes("Insufficient USDT balance")) {
                          const totalRequired =
                            (enteredBalance || 0) * (1 + MANAGEMENT_FEE);
                          toast.error("Insufficient Balance", {
                            description: `You need $${totalRequired.toFixed(
                              2
                            )} USDT (including ${(MANAGEMENT_FEE * 100).toFixed(
                              1
                            )}% management fee) to start this strategy. Please add funds to your wallet.`,
                            duration: 6000,
                          });
                          return;
                        } else if (
                          msg?.toLowerCase().includes("rejected") ||
                          msg?.toLowerCase().includes("user cancelled")
                        ) {
                          toast.message(`${wallet.name} request was cancelled`);
                          return;
                        } else {
                          toast.error(`Unable to grant access to ${wallet.name}`);
                          return;
                        }
                      }

                      setisWalletGrantPending(false);
                      toast.success(`Permission granted for ${wallet.name}`);

                      if (typeof window !== "undefined") {
                        window.localStorage.setItem(storageKey, wallet.name);
                      }

                      await callback(wallet.name);
                    } catch (error) {
                      console.error("Wallet grant error:", error);
                    } finally {
                      setLoadingWallet(null);
                      setIsLoading(false);
                    }
                  }}
                >
                  <div className="flex items-center gap-3 text-lg">
                    <Image
                      width={32}
                      height={32}
                      src={wallet.icon}
                      alt={`${wallet.name} icon`}
                    />
                    <span>{wallet.name}</span>
                  </div>
                  <span className="ml-auto w-4 h-4 flex items-center justify-center">
                    {loadingWallet === wallet.name ? (
                      <Loader2 className="animate-spin" />
                    ) : null}
                  </span>
                </Button>
              </div>
            );
          })}
      </DialogContent>
    </Dialog>
  );
};

export default WalletPicker;