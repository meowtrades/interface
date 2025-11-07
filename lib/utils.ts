/** @format */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Frequency, FREQUENCY_RANGE_MAP } from "./types";
import { Transaction } from "@/api/types/dtos";
import { IndexerGrpcAccountPortfolioApi } from "@injectivelabs/sdk-ts";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";
import { USDT_DENOM } from "./constants";
import { BigNumber } from "@injectivelabs/utils";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFrequency(freq: string | Frequency) {
  // if (typeof freq === "string") {
  //   return freq;
  // }

  switch (freq) {
    case Frequency.DAILY:
      return "Daily";
    case Frequency.WEEKLY:
      return "Weekly";
    case Frequency.MONTHLY:
      return "Monthly";
    default:
      return "Unknown frequency";
  }
}

export function getValidRanges(frequency: Frequency) {
  return FREQUENCY_RANGE_MAP[frequency] || [];
}

/**
 * 
 * @param transaction { accessorKey: "date", header: "Date" },
    { accessorKey: "type", header: "Type" },
    { accessorKey: "amount", header: "Amount" },
    { accessorKey: "value", header: "Value" },
    { accessorKey: "price", header: "Price" },
 */
export const transactionToTableValues = (
  transactions: Transaction[]
): {
  type: string;
  date: string;
  amount: string;
  price: string;
  value: string;
}[] => {
  return transactions.map((transaction) => {
    const isBuy = transaction.type.toLowerCase() === "buy";

    // For display purposes:
    // - Amount: Show the main asset being traded (tokens for buy, USDT for sell)
    // - Value: Show the transaction value in USD
    const displayAmount = isBuy
      ? `${transaction.to.amount.toFixed(6)} ${transaction.to.token}` // Tokens received
      : `${transaction.from.amount.toFixed(6)} ${transaction.from.token}`; // Tokens sold

    const displayValue = transaction.value
      ? `$${transaction.value.toFixed(2)}` // Use the value field if available
      : `$${(transaction.to.amount * transaction.price).toFixed(2)}`; // Fallback calculation

    return {
      type: transaction.type,
      date: formatDate(transaction.createdAt),
      amount: displayAmount,
      price: `$${transaction.price.toFixed(2)}`,
      value: displayValue,
    };
  });
};

export const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
};

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
};

// Format date and time for tooltips

// Format currency values
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const checkMinimumUSDTBalance = async (
  granter: string,
  requiredBalance: number
) => {
  const indexer = new IndexerGrpcAccountPortfolioApi(
    getNetworkEndpoints(Network.Testnet).indexer
  );

  console.log("Fetching subaccount balance...");
  // Check if the user has sufficient balance
  const { bankBalancesList } =
    await indexer.fetchAccountPortfolioBalances(granter);

  console.log("bankBalancesList", bankBalancesList);

  const usdtBalance = bankBalancesList.find(
    (balance) => balance.denom === USDT_DENOM
  )?.amount;

  if (!usdtBalance) {
    throw new Error("USDT balance not found");
  }

  const humanReadableBalance = new BigNumber(usdtBalance).shiftedBy(-6); // Convert from smallest unit to human-readable (assuming USDT has 6 decimals)
  const requiredBalanceBN = new BigNumber(requiredBalance);

  console.log(humanReadableBalance.toString(), requiredBalanceBN.toString());
  if (humanReadableBalance.lt(requiredBalanceBN)) {
    throw new Error(
      `Insufficient USDT balance. Required: $${requiredBalance.toFixed(
        2
      )}, Available: $${humanReadableBalance.toNumber().toFixed(2)}`
    );
  }

  return;
};

/**
 * Normalizes chain ID for backend compatibility
 * Maps UI-specific chain IDs to backend-recognized chain IDs
 */
export const normalizeChainId = (chainId: string): string => {
  // Map injective-evm to injective since backend only recognizes injective
  if (chainId === "injective-evm") {
    return "injective";
  }
  return chainId;
};

/**
 * Fetch real wallet balances from Injective blockchain
 */
export const fetchWalletBalances = async (
  address: string
): Promise<{
  inj: number;
  usdt: number;
}> => {
  try {
    const indexer = new IndexerGrpcAccountPortfolioApi(
      getNetworkEndpoints(Network.Testnet).indexer
    );

    const { bankBalancesList } =
      await indexer.fetchAccountPortfolioBalances(address);

    // Find INJ balance (native token)
    const injBalance =
      bankBalancesList.find((balance) => balance.denom === "inj")?.amount ||
      "0";

    // Find USDT balance
    const usdtBalance =
      bankBalancesList.find((balance) => balance.denom === USDT_DENOM)
        ?.amount || "0";

    // Convert from smallest units to human-readable
    const injHuman = new BigNumber(injBalance).shiftedBy(-18).toNumber(); // INJ has 18 decimals
    const usdtHuman = new BigNumber(usdtBalance).shiftedBy(-6).toNumber(); // USDT has 6 decimals

    return {
      inj: injHuman,
      usdt: usdtHuman,
    };
  } catch (error) {
    console.error("Failed to fetch wallet balances:", error);
    // Return zero balances on error instead of throwing
    return {
      inj: 0,
      usdt: 0,
    };
  }
};
