// Interfaces
export interface Regard {
  id: number;
  sender: string;
  amount: number;
  message: string;
  timestamp: number;
  nft?: {
    image: string;
    name?: string;
  };
}

export interface UserDetails {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
}

// Mock database
let mockRegards: Regard[] = [
  {
    id: 1,
    sender: "Alice",
    amount: 0.5,
    message: "Thanks for all your help with the project! You're an amazing teammate.",
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
    nft: {
      image: "/images/nft-certificate-1.jpg",
      name: "Outstanding Collaboration"
    }
  },
  {
    id: 2,
    sender: "Bob",
    amount: 0.25,
    message: "Appreciate your insights during our brainstorming session!",
    timestamp: Date.now() - 1000 * 60 * 60 * 5, // 5 hours ago
  },
  {
    id: 3,
    sender: "Carol",
    amount: 1.0,
    message: "Your code review saved us from a major bug. You're awesome!",
    timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    nft: {
      image: "/images/nft-certificate-2.jpg",
      name: "Bug Hunter"
    }
  }
];

const mockUsers: Record<string, UserDetails> = {
  "satoshi_fan": {
    username: "satoshi_fan",
    displayName: "Satoshi Fan",
    bio: "Web3 enthusiast and open source contributor",
    avatarUrl: "/images/profile-alice.jpg"
  },
  "alice": {
    username: "alice",
    displayName: "Alice Blockchain",
    bio: "Solana developer and NFT collector",
    avatarUrl: "/images/profile-alice.jpg"
  },
  "bob": {
    username: "bob",
    displayName: "Bob Crypto",
    bio: "DeFi explorer and DAO contributor",
    avatarUrl: "/images/profile-bob.jpg"
  },
  "charlie": {
    username: "charlie",
    displayName: "Charlie SolDev",
    bio: "Solana ecosystem builder",
    avatarUrl: "/images/profile-charlie.jpg"
  }
};

// Mock API methods
export const regardsService = {
  // Get user details by username
  getUserDetails: async (username: string): Promise<UserDetails> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const user = mockUsers[username];
    if (!user) {
      // Return default if user not found
      return {
        username,
        displayName: username,
        bio: "DropRegards User",
        avatarUrl: "/images/profile.jpg"
      };
    }
    
    return user;
  },
  
  // Get regards for a specific user
  getRegardsByUsername: async (username: string): Promise<Regard[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, this would filter by recipient username
    return mockRegards;
  },
  
  // Send a regard to a user
  sendRegard: async (
    toUsername: string, 
    fromWallet: string,
    amount: number, 
    message: string,
    includeNft: boolean,
    nftDesign?: string
  ): Promise<{ success: boolean; transactionId: string; regardId: number }> => {
    // Simulate API delay and blockchain transaction time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate transaction ID
    const transactionId = "TXN" + Math.random().toString(36).substring(2, 10).toUpperCase();
    
    // Create regard object
    const newRegard: Regard = {
      id: mockRegards.length + 1,
      sender: fromWallet.substring(0, 4) + "..." + fromWallet.substring(fromWallet.length - 4),
      amount,
      message,
      timestamp: Date.now(),
      nft: includeNft && nftDesign ? {
        image: `/images/nft-certificate-${nftDesign === "gratitude" ? "1" : nftDesign === "star" ? "2" : "3"}.jpg`,
        name: nftDesign.charAt(0).toUpperCase() + nftDesign.slice(1)
      } : undefined
    };
    
    // Add to mock database
    mockRegards.push(newRegard);
    
    // Return success with transaction ID
    return {
      success: true,
      transactionId,
      regardId: newRegard.id
    };
  },
  
  // Add an NFT to an existing regard
  addNftToRegard: async (
    regardId: number,
    fromWallet: string,
    nftDesign: string
  ): Promise<{ success: boolean; transactionId: string }> => {
    // Simulate API delay and blockchain transaction time
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Generate transaction ID
    const transactionId = "TXN" + Math.random().toString(36).substring(2, 10).toUpperCase();
    
    // Find the regard
    const regardIndex = mockRegards.findIndex(r => r.id === regardId);
    if (regardIndex === -1) {
      return { success: false, transactionId: "" };
    }
    
    // Update the regard with NFT data
    mockRegards[regardIndex] = {
      ...mockRegards[regardIndex],
      nft: {
        image: `/images/nft-certificate-${nftDesign === "gratitude" ? "1" : nftDesign === "star" ? "2" : "3"}.jpg`,
        name: nftDesign.charAt(0).toUpperCase() + nftDesign.slice(1)
      }
    };
    
    // Return success with transaction ID
    return {
      success: true,
      transactionId
    };
  }
}; 