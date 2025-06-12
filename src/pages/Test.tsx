/** @format */

import KeplGrant from "@/components/KeplrGrant";
import LeapGrant from "@/components/LeapGrant";
import MetaMaskGrant from "@/components/MetaMask";
import { FaWallet, FaBolt, FaKey, FaBox } from "react-icons/fa";

const Testnet = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8 px-5">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
        <FaWallet className="text-blue-500" /> Testnet Wallet Grants
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
          <FaBolt className="text-4xl text-purple-500 mb-2" />
          <span className="font-semibold text-lg mb-2">Leap Wallet</span>
          <LeapGrant />
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
          <FaKey className="text-4xl text-blue-400 mb-2" />
          <span className="font-semibold text-lg mb-2">Keplr Wallet</span>
          <KeplGrant />
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
          <FaBox className="text-4xl text-yellow-500 mb-2" />
          <span className="font-semibold text-lg mb-2">MetaMask</span>
          <MetaMaskGrant />
        </div>
      </div>
    </div>
  );
};

export default Testnet;
