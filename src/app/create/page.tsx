"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Create() {
  const { connected, publicKey, connecting, disconnect } = useWallet();
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState(""); 
  const [submitted, setSubmitted] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle wallet connection changes
  useEffect(() => {
    if (connected && publicKey) {
      // If wallet is connected, move to profile creation step
      setStep(2);
    }
  }, [connected, publicKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Generate link based on username
      const sanitizedUsername = username.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const domain = typeof window !== 'undefined' ? window.location.origin : 'dropregards.io';
      const link = `${domain}/send/${sanitizedUsername}`;
      
      // Simulate backend interaction
      setTimeout(() => {
        setGeneratedLink(link);
        setSubmitted(true);
        setStep(3);
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      console.error("Profile creation error:", err);
      setError("Failed to create your profile. Please try again.");
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setStep(1);
  };

  // Helper function to truncate wallet address
  const truncateAddress = (address: string): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <main className="min-h-screen py-16 px-4">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-10 w-60 h-60 bg-purple-500/20 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 -right-10 w-80 h-80 bg-blue-500/20 rounded-full filter blur-3xl animate-float delay-300"></div>
      </div>
      
      <div className="container max-w-3xl mx-auto">
        <div className="mb-10 text-center animate-fadeIn">
          <Link href="/" className="inline-flex items-center mb-6 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Create Your DropLink</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Set up your personalized page to receive SOL and messages from anyone
          </p>
        </div>

        <div className="card glass shadow-lg backdrop-blur-sm animate-scaleIn">
          {/* Step indicators */}
          <div className="flex justify-between px-6 pt-6">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                1
              </div>
              <span className={`hidden sm:inline-block ${step >= 1 ? 'text-gray-800 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>
                Connect
              </span>
            </div>
            <div className="relative flex-1 mx-4">
              <div className="h-0.5 absolute top-4 w-full bg-gray-200 dark:bg-gray-700"></div>
              <div className={`h-0.5 absolute top-4 bg-purple-600 transition-all duration-500 ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                2
              </div>
              <span className={`hidden sm:inline-block ${step >= 2 ? 'text-gray-800 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>
                Profile
              </span>
            </div>
            <div className="relative flex-1 mx-4">
              <div className="h-0.5 absolute top-4 w-full bg-gray-200 dark:bg-gray-700"></div>
              <div className={`h-0.5 absolute top-4 bg-purple-600 transition-all duration-500 ${step >= 3 ? 'w-full' : 'w-0'}`}></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                3
              </div>
              <span className={`hidden sm:inline-block ${step >= 3 ? 'text-gray-800 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>
                Done
              </span>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* Error message display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 flex items-start animate-fadeIn">
                <ExclamationCircleIcon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Step 1: Connect Wallet */}
            {step === 1 && (
              <div className="animate-fadeIn">
                <h2 className="text-xl font-bold mb-4">Connect Your Wallet</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Choose your wallet provider to get started with DropRegards
                </p>
                
                <div className="flex justify-center mb-8">
                  {/* Custom styling for WalletMultiButton */}
                  <div className="wallet-adapter-button-container">
                    <WalletMultiButton className="wallet-adapter-button" />
                  </div>
                </div>
                
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  By connecting your wallet, you agree to our{" "}
                  <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">Terms of Service</a>{" "}
                  and{" "}
                  <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">Privacy Policy</a>
                </div>
              </div>
            )}

            {/* Step 2: Create Profile */}
            {step === 2 && (
              <div className="animate-fadeIn">
                <h2 className="text-xl font-bold mb-4">Create Your Profile</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Customize how your DropLink page will appear to others
                </p>
                
                {publicKey && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Connected: <span className="font-mono">{truncateAddress(publicKey.toString())}</span>
                        </p>
                      </div>
                      <button
                        onClick={handleDisconnect}
                        className="text-sm text-red-600 dark:text-red-400 hover:underline"
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium mb-2">
                      Username *
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="input-field w-full"
                      placeholder="johndoe"
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      This will be used for your personalized link
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium mb-2">
                      Bio (Optional)
                    </label>
                    <textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="input-field w-full resize-none"
                      placeholder="Tell others a bit about yourself..."
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Profile Image (Optional)
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                        {profileImage ? (
                          <Image src={profileImage} alt="Profile" width={64} height={64} className="object-cover w-full h-full" />
                        ) : (
                          <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setProfileImage("/images/profile.jpg")}
                        className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        Upload Image
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <button 
                      type="submit"
                      className="btn"
                      disabled={!username.trim() || isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="mr-2 animate-spin rounded-full h-4 w-4 border-2 border-b-transparent border-white"></div>
                          Creating...
                        </>
                      ) : (
                        "Create DropLink"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
              <div className="text-center animate-fadeIn">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="w-10 h-10 text-green-500" />
                  </div>
                </div>
                
                <h2 className="text-xl font-bold mb-2">Success!</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Your DropLink has been created and is ready to share
                </p>
                
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg mb-8">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Your personalized link:</p>
                  <div className="font-mono font-medium text-purple-600 dark:text-purple-400 break-all">
                    {generatedLink}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Link 
                    href="/dashboard" 
                    className="btn"
                  >
                    View Dashboard
                  </Link>
                  <button 
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedLink);
                      alert("Link copied to clipboard!");
                    }}
                    className="btn-secondary"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 