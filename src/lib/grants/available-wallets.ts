/** @format */

import { getKeplrGrant } from "./Keplr";

export type AvailableWallets = {
  name: string;
  description: string;
  icon: string;
  windowKey: string;
  colorTheme: string;
  action: () => Promise<void>;
};

export const availableWallets: AvailableWallets[] = [
  {
    name: "Keplr",
    windowKey: "keplr",
    description: "Grant access to Keplr wallet",
    icon: "/icons/wallets/keplr.svg",
    colorTheme:
      "bg-gradient-to-br from-[#23bcfe] to-[#7451fd] text-white bg-sca",
    action: getKeplrGrant,
  },
];
