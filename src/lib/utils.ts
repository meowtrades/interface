/** @format */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Frequency } from "./types";

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
