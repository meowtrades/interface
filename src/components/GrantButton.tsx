/** @format */

import { useState } from "react";

export const GrantButton = ({ backendAddress }: { backendAddress: string }) => {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("10"); // Default 10 INJ

  const createGrant = async () => {
    setLoading(true);

    try {
      // 1. Detect Leap Wallet
      if (!window.leap) {
        window.open("https://www.leapwallet.io", "_blank");
        throw new Error("Leap Wallet not installed!");
      }

      // 2. Connect to Injective
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const leap = (window as any).leap;
      await leap.enable("injective-1");
      const accounts = await leap.getAccounts();
      const userAddress = accounts[0].address;

      // 3. Create Grant Transaction
      const grantTx = {
        typeUrl: "/cosmos.authz.v1beta1.MsgGrant",
        value: {
          granter: userAddress,
          grantee: backendAddress,
          grant: {
            authorization: {
              typeUrl: "/cosmos.bank.v1beta1.SendAuthorization",
              value: {
                spendLimit: [
                  {
                    denom: "inj",
                    amount: (Number(amount) * 1e18).toString(), // INJ to inj (18 decimals)
                  },
                ],
              },
            },
            expiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
        },
      };

      // 4. Send with Leap's built-in methods
      const result = await leap.signAndBroadcast(
        "injective-1",
        userAddress,
        [grantTx],
        {
          amount: [{ denom: "inj", amount: "5000000000000000" }], // 0.005 INJ fee
          gas: "200000",
        }
      );

      console.log("Grant created!", result);
      alert(`Success! TX Hash: ${result.transactionHash}`);
    } catch (error) {
      console.error("Error:", error);
      alert(`Failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3>Grant Trading Permission</h3>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="INJ Amount"
        style={{ padding: "8px", marginRight: "10px" }}
      />
      <button
        onClick={createGrant}
        disabled={loading}
        style={{
          padding: "8px 16px",
          background: loading ? "#ccc" : "#3f51b5",
          color: "white",
          border: "none",
          borderRadius: "4px",
        }}
      >
        {loading ? "Processing..." : "Approve Grant"}
      </button>
    </div>
  );
};
