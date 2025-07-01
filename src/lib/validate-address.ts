/** @format */
export const validateInjecitveWalletAddress = (address: string): boolean => {
  // Basic validation for a wallet address
  const regex = /^inj1[a-z0-9]{38}$/; // Example regex for Injective wallet address
  return regex.test(address);
};
