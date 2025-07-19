"use client"

import { getKeplrGrant } from "./auth-z";

export type AvailableWallets = {
  name: string;
  description: string;
  icon: string;
  windowKey: string;
  colorTheme: string;
  action: (enteredBalance: number) => Promise<void>;
};

export const availableWallets: AvailableWallets[] = [
  {
    name: "Keplr",
    windowKey: "keplr",
    description: "Grant access to Keplr wallet",
    icon: "/wallets/keplr.svg",
    colorTheme:
      "bg-gradient-to-br from-[#23bcfe] to-[#7451fd] text-white bg-sca",
    action: getKeplrGrant,
  },
];
