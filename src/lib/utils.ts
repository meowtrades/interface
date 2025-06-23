/** @format */

import { clsx, type ClassValue } from "clsx";
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
    case Frequency.TEST_10_SECONDS:
      return "Every 10 seconds";
    case Frequency.TEST_MINUTE:
      return "Every minute";
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
  return transactions.map((transaction) => ({
    type: transaction.type,
    date: formatDate(transaction.createdAt),
    amount: `${transaction.to.amount} ${transaction.to.token}`,
    price: transaction.price.toString(),
    value: `${transaction.to.amount * transaction.price} ${
      transaction.from.token
    }`,
  }));
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
  // Check if the user has sufficient balance (must also include management fees)
  const { bankBalancesList } = await indexer.fetchAccountPortfolioBalances(
    granter
  );

  console.log(bankBalancesList);

  const usdtBalance = bankBalancesList.find(
    (balance) => balance.denom === USDT_DENOM
  )?.amount;

  const humanReadableBalance = BigNumber(usdtBalance).shiftedBy(-6); // Convert from smallest unit to human-readable (assuming USDT has 6 decimals)

  console.log(humanReadableBalance, BigNumber(requiredBalance).toString());
  if (humanReadableBalance.lt(requiredBalance)) {
    throw new Error(
      `Insufficient USDT balance. Required: $${requiredBalance.toFixed(
        2
      )}, Available: $${humanReadableBalance.toFixed(2)}`
    );
  }

  return;
};
