import { UserWallet } from '../types';

// Mock wallet data for development
// In a real app, this would be fetched from the backend
const userWallets: UserWallet[] = [
  {
    chainId: 'injective',
    tokenId: 'inj',
    balance: 42.5,
    usdValue: 637.5,
    address: 'inj1abc...xyz',
  },
  {
    chainId: 'injective',
    tokenId: 'usdt',
    balance: 1250.75,
    usdValue: 1250.75,
    address: 'inj1abc...xyz',
  }
];

// Simulate API calls with promises
export const fetchUserWallets = async (): Promise<UserWallet[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return userWallets;
};

export const depositToWallet = async (
  chainId: string,
  tokenId: string,
  amount: number
): Promise<boolean> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Find the wallet to deposit to
  const walletIndex = userWallets.findIndex(
    wallet => wallet.chainId === chainId && wallet.tokenId === tokenId
  );

  if (walletIndex === -1) {
    // Wallet doesn't exist, create a new one
    // In a real app, this would be handled by the backend
    const tokenPrice = getTokenPrice(tokenId);
    const newWallet: UserWallet = {
      chainId,
      tokenId,
      balance: amount,
      usdValue: amount * tokenPrice,
      address: generateMockAddress(chainId),
    };
    userWallets.push(newWallet);
  } else {
    // Update existing wallet
    const wallet = userWallets[walletIndex];
    const tokenPrice = getTokenPrice(tokenId);
    wallet.balance += amount;
    wallet.usdValue += amount * tokenPrice;
  }

  return true;
};

export const withdrawFromWallet = async (
  chainId: string,
  tokenId: string,
  address: string,
  amount: number
): Promise<boolean> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Find the wallet to withdraw from
  const walletIndex = userWallets.findIndex(
    wallet => wallet.chainId === chainId && wallet.tokenId === tokenId
  );

  if (walletIndex === -1) {
    // Wallet doesn't exist
    return false;
  }

  const wallet = userWallets[walletIndex];
  if (wallet.balance < amount) {
    // Insufficient balance
    return false;
  }

  // Update wallet balance
  const tokenPrice = getTokenPrice(tokenId);
  wallet.balance -= amount;
  wallet.usdValue -= amount * tokenPrice;

  return true;
};

// Helper function to get mock token price
function getTokenPrice(tokenId: string): number {
  const prices = {
    'inj': 15.0,
    'usdt': 1.0,
  };
  return prices[tokenId as keyof typeof prices] || 1.0;
}

// Helper function to generate mock addresses
function generateMockAddress(chainId: string): string {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyz';
  let address = 'inj1';
  
  // Generate 8 random characters
  for (let i = 0; i < 8; i++) {
    address += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  address += '...';
  
  // Generate 3 more random characters
  for (let i = 0; i < 3; i++) {
    address += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return address;
} 