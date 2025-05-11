"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

interface UserProfile {
  username: string;
  displayName: string;
  bio: string;
  profileImage: string;
  walletAddress?: string;
}

export default function DonatePage() {
  const params = useParams();
  const username = params.username as string;
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);
        
        // Dummy user data for testing
        const dummyUsers: Record<string, UserProfile> = {
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
        
        // Simulate a network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const lowercaseUsername = username.toLowerCase();
        const userData = dummyUsers[lowercaseUsername] || {
          username: lowercaseUsername,
          displayName: username.charAt(0).toUpperCase() + username.slice(1),
          bio: "DropRegards user",
          profileImage: `https://ui-avatars.com/api/?name=${username.substring(0, 2).toUpperCase()}&background=8a5cf6&color=ffffff&size=256&bold=true`,
          walletAddress: "BijikHHEuzpQJG5CZn5FW5ewfuUbGJNzABCRUQfnSZjY"
        };
        
        setUser(userData);
      } catch (err) {
        console.error("Error loading user data:", err);
        setError("Could not load user profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    if (username) {
      fetchUserData();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card glass max-w-md p-6 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">User Not Found</h1>
          <p>{error || `No user found with username: ${username}`}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-16 px-4">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-10 w-60 h-60 bg-purple-500/20 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 -right-10 w-80 h-80 bg-blue-500/20 rounded-full filter blur-3xl animate-float delay-300"></div>
      </div>
      
      <div className="container max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center mb-6 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
        
        <div className="card glass shadow-lg backdrop-blur-sm p-8 animate-scaleIn">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white/20">
              <Image 
                src={user.profileImage}
                alt={user.displayName}
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
            
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold gradient-text">{user.displayName}</h1>
              <p className="text-sm text-purple-600 dark:text-purple-400">@{user.username}</p>
              <p className="text-gray-600 dark:text-gray-300 mt-2">{user.bio}</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Send SOL to {user.displayName}</h2>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <p className="text-center mb-4">Connect your wallet to send SOL</p>
              <div className="flex justify-center">
                <WalletMultiButton />
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <a 
                href={`/api/actions/${username}/donate-sol?amount=0.01`}
                className="btn btn-sm text-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                0.01 SOL
              </a>
              <a 
                href={`/api/actions/${username}/donate-sol?amount=0.05`}
                className="btn btn-sm text-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                0.05 SOL
              </a>
              <a 
                href={`/api/actions/${username}/donate-sol?amount=0.1`}
                className="btn btn-sm text-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                0.1 SOL
              </a>
              <a 
                href={`/api/actions/${username}/donate-sol`}
                className="btn-secondary btn-sm text-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                Custom
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 