"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";

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
  const { connected, publicKey, connect, select, wallets } = useWallet();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("0.01");
  const [isProcessing, setIsProcessing] = useState(false);
  const [txSuccess, setTxSuccess] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);
        
        // Get color based on username hash for consistent colors
        const getColorFromUsername = (username: string) => {
          let hash = 0;
          for (let i = 0; i < username.length; i++) {
            hash = username.charCodeAt(i) + ((hash << 5) - hash);
          }
          const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
          return "00000".substring(0, 6 - c.length) + c;
        };
        
        // Dummy user data for testing
        const dummyUsers: Record<string, UserProfile> = {
          "alice": {
            username: "alice",
            displayName: "Alice Wonderland",
            bio: "Crypto enthusiast and NFT collector",
            profileImage: `https://placehold.co/200x200/${getColorFromUsername("alice")}/FFFFFF/webp?text=AW`,
            walletAddress: "BijikHHEuzpQJG5CZn5FW5ewfuUbGJNzABCRUQfnSZjY"
          },
          "bob": {
            username: "bob",
            displayName: "Bob Builder",
            bio: "Building on Solana since 2021",
            profileImage: `https://placehold.co/200x200/${getColorFromUsername("bob")}/FFFFFF/webp?text=BB`,
            walletAddress: "BijikHHEuzpQJG5CZn5FW5ewfuUbGJNzABCRUQfnSZjY"
          },
          "charlie": {
            username: "charlie",
            displayName: "Charlie Web3",
            bio: "DeFi degen and Solana developer",
            profileImage: `https://placehold.co/200x200/${getColorFromUsername("charlie")}/FFFFFF/webp?text=CW`,
            walletAddress: "BijikHHEuzpQJG5CZn5FW5ewfuUbGJNzABCRUQfnSZjY"
          }
        };
        
        // Simulate a network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const lowercaseUsername = username.toLowerCase();
        const initials = username.substring(0, 2).toUpperCase();
        const bgColor = getColorFromUsername(lowercaseUsername);
        
        const userData = dummyUsers[lowercaseUsername] || {
          username: lowercaseUsername,
          displayName: username.charAt(0).toUpperCase() + username.slice(1),
          bio: "DropRegards user",
          profileImage: `https://placehold.co/200x200/${bgColor}/FFFFFF/webp?text=${initials}`,
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

  const handleConnectWallet = async () => {
    try {
      // For demo purposes, we'll simulate a wallet connection
      if (wallets.length > 0 && select) {
        select(wallets[0].adapter.name);
        await new Promise(resolve => setTimeout(resolve, 500));
        if (connect) {
          await connect();
        }
      } else {
        // Simulate a successful connection for demo purposes
        alert("This is a demo. In a real app, a wallet selection dialog would appear.");
        
        // Instead of reloading, simulate a state change
        const fakeWalletConnection = {
          publicKey: "Demo12345abcdefghijklmnopqrstuvwxyz",
          connected: true
        };
        
        // @ts-ignore - This is just for demo purposes
        if (typeof window !== 'undefined') {
          window.solana = {
            isPhantom: true,
            ...fakeWalletConnection
          };
        }
        
        // Force re-render
        setIsProcessing(true);
        setTimeout(() => {
          setIsProcessing(false);
        }, 500);
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
    }
  };

  const handleSendSol = async (sendAmount: string) => {
    setAmount(sendAmount);
    setIsProcessing(true);
    
    try {
      // Simulate transaction processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success
      setTxSuccess(true);
      
      // Reset after showing success
      setTimeout(() => {
        setTxSuccess(false);
        setIsProcessing(false);
      }, 3000);
    } catch (err) {
      console.error("Error sending SOL:", err);
      setIsProcessing(false);
    }
  };

  const handleSendCustomAmount = () => {
    const customAmount = prompt("Enter SOL amount to send:", "0.01");
    if (customAmount) {
      const numAmount = parseFloat(customAmount);
      if (!isNaN(numAmount) && numAmount > 0) {
        handleSendSol(customAmount);
      } else {
        alert("Please enter a valid amount greater than 0");
      }
    }
  };

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
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-lg">
              <Image 
                src={user.profileImage}
                alt={user.displayName}
                width={128}
                height={128}
                className="object-cover"
                unoptimized // Added to avoid Next.js image optimization issues with external URLs
              />
            </div>
            
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold gradient-text">{user.displayName}</h1>
              <p className="text-sm text-purple-600 dark:text-purple-400">@{user.username}</p>
              <p className="text-gray-600 dark:text-gray-300 mt-2">{user.bio}</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4 text-center md:text-left">Send SOL to {user.displayName}</h2>
            
            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg shadow-inner">
              {!connected ? (
                <>
                  <p className="text-center mb-4">Connect your wallet to send SOL</p>
                  <div className="flex justify-center">
                    <button 
                      onClick={handleConnectWallet}
                      className="btn flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                        />
                      </svg>
                      Connect Wallet
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-6 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg flex items-center justify-center gap-2 shadow-sm">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-center font-medium text-purple-800 dark:text-purple-300">
                      Wallet Connected: <span className="font-mono text-sm">{publicKey ? publicKey.toString().slice(0, 6) + '...' + publicKey.toString().slice(-4) : 'Demo Wallet'}</span>
                    </p>
                  </div>
                  
                  {isProcessing ? (
                    <div className="text-center p-6 my-4 bg-white/50 dark:bg-gray-800/50 rounded-lg shadow-inner">
                      {txSuccess ? (
                        <div className="flex flex-col items-center space-y-4 py-6">
                          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-lg">Transaction Complete!</p>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">Successfully sent {amount} SOL to {user.displayName}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-4 py-6">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"></div>
                          <div>
                            <p className="font-medium">Processing Transaction</p>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">Sending {amount} SOL to {user.displayName}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <p className="text-center mb-6 text-gray-600 dark:text-gray-300">Select an amount to send:</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button 
                          onClick={() => handleSendSol("0.01")}
                          className="btn btn-sm text-center font-medium py-3"
                        >
                          0.01 SOL
                        </button>
                        <button 
                          onClick={() => handleSendSol("0.05")}
                          className="btn btn-sm text-center font-medium py-3"
                        >
                          0.05 SOL
                        </button>
                        <button 
                          onClick={() => handleSendSol("0.1")}
                          className="btn btn-sm text-center font-medium py-3"
                        >
                          0.1 SOL
                        </button>
                        <button 
                          onClick={handleSendCustomAmount}
                          className="btn-secondary btn-sm text-center font-medium py-3"
                        >
                          Custom
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
            
            <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
              <p>This is a demo application. No real transactions will be processed.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 