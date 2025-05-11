// Types for our data
export interface Regard {
  id: string;
  sender: {
    username: string;
    walletAddress: string;
  };
  recipient: {
    username: string;
    walletAddress: string;
  };
  amount: number;
  message: string;
  transactionSignature: string;
  status: string;
  createdAt: string;
}

export interface UserProfile {
  username: string;
  displayName: string;
  bio: string;
  profileImage: string;
  walletAddress?: string;
}

export interface RegardStats {
  totalSol: number;
  totalRegards: number;
  uniqueSenders: number;
}

// Dummy data for demo purposes
export const DUMMY_REGARDS: Regard[] = [
  {
    id: "1",
    sender: {
      username: "alice",
      walletAddress: "Alice1234...5678"
    },
    recipient: {
      username: "dummy",
      walletAddress: "Dummy1234...5678"
    },
    amount: 0.5,
    message: "Thanks for all your help with the project! You're an amazing teammate.",
    transactionSignature: "TXN123456789",
    status: "completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  },
  {
    id: "2",
    sender: {
      username: "bob",
      walletAddress: "Bob1234...5678"
    },
    recipient: {
      username: "dummy",
      walletAddress: "Dummy1234...5678"
    },
    amount: 0.25,
    message: "Appreciate your insights during our brainstorming session!",
    transactionSignature: "TXN987654321",
    status: "completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
  {
    id: "3",
    sender: {
      username: "charlie",
      walletAddress: "Charlie1234...5678"
    },
    recipient: {
      username: "dummy",
      walletAddress: "Dummy1234...5678"
    },
    amount: 1.0,
    message: "Your code review saved us from a major bug. You're awesome!",
    transactionSignature: "TXN567891234",
    status: "completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  }
];

export const DUMMY_STATS: RegardStats = {
  totalSol: 1.75,
  totalRegards: 3,
  uniqueSenders: 3
};

export const DUMMY_USERS: Record<string, UserProfile> = {
  "dummy": {
    username: "dummy",
    displayName: "Demo User",
    bio: "This is a demo account for DropRegards",
    profileImage: "https://ui-avatars.com/api/?name=DU&background=8a5cf6&color=ffffff&size=256&bold=true",
    walletAddress: "BijikHHEuzpQJG5CZn5FW5ewfuUbGJNzABCRUQfnSZjY"
  },
  "alice": {
    username: "alice",
    displayName: "Alice Wonderland",
    bio: "Crypto enthusiast and NFT collector",
    profileImage: "https://ui-avatars.com/api/?name=AW&background=6f42c1&color=ffffff&size=256&bold=true",
    walletAddress: "BijikHHEuzpQJG5CZn5FW5ewfuUbGJNzABCRUQfnSZjY"
  },
  "bob": {
    username: "bob",
    displayName: "Bob Builder",
    bio: "Building on Solana since 2021",
    profileImage: "https://ui-avatars.com/api/?name=BB&background=2a9d8f&color=ffffff&size=256&bold=true",
    walletAddress: "BijikHHEuzpQJG5CZn5FW5ewfuUbGJNzABCRUQfnSZjY"
  },
  "charlie": {
    username: "charlie",
    displayName: "Charlie Web3",
    bio: "DeFi degen and Solana developer",
    profileImage: "https://ui-avatars.com/api/?name=CW&background=e76f51&color=ffffff&size=256&bold=true",
    walletAddress: "BijikHHEuzpQJG5CZn5FW5ewfuUbGJNzABCRUQfnSZjY"
  }
};

// Helper function to get a user profile
export function getDummyUser(username: string): UserProfile {
  const lowercaseUsername = username.toLowerCase();
  return DUMMY_USERS[lowercaseUsername] || {
    username: lowercaseUsername,
    displayName: username.charAt(0).toUpperCase() + username.slice(1),
    bio: "DropRegards user",
    profileImage: `https://ui-avatars.com/api/?name=${username.substring(0, 2).toUpperCase()}&background=8a5cf6&color=ffffff&size=256&bold=true`,
    walletAddress: "BijikHHEuzpQJG5CZn5FW5ewfuUbGJNzABCRUQfnSZjY"
  };
} 