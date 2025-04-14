"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function SendRegards() {
  const params = useParams();
  const router = useRouter();
  const username = params.username;

  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [includeNft, setIncludeNft] = useState(false);
  const [nftDesign, setNftDesign] = useState("gratitude");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userDetails, setUserDetails] = useState({
    displayName: "",
    bio: "",
    avatarUrl: ""
  });

  useEffect(() => {
    // In a real app, fetch user details from API
    // This is just mock data for the demo
    setUserDetails({
      displayName: username as string,
      bio: "Web3 enthusiast and open source contributor",
      avatarUrl: "/images/profile.jpg"
    });
  }, [username]);

  const connectWallet = () => {
    setIsLoading(true);
    // Simulate wallet connection
    setTimeout(() => {
      setIsLoading(false);
      setIsConnected(true);
      setStep(2);
    }, 1200);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and decimal point
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setAmount(value);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate transaction
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      setStep(3);
    }, 1500);
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Send Regards to {userDetails.displayName}</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Show your appreciation with SOL and a personalized message
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
                Send
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
            {/* User details section */}
            <div className="flex items-center mb-8 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg animate-fadeIn">
              <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-purple-200 dark:border-purple-900">
                <Image src={userDetails.avatarUrl} alt={userDetails.displayName} width={64} height={64} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-lg">{userDetails.displayName}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{userDetails.bio}</p>
              </div>
            </div>
            
            {/* Step 1: Connect Wallet */}
            {step === 1 && (
              <div className="animate-fadeIn">
                <h2 className="text-xl font-bold mb-4">Connect Your Wallet</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Connect your Solana wallet to send SOL and NFTs
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  <button 
                    onClick={connectWallet}
                    className="flex items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                    disabled={isLoading}
                  >
                    <Image src="/images/phantom.png" alt="Phantom" width={30} height={30} className="mr-3" />
                    <span>{isLoading ? "Connecting..." : "Phantom"}</span>
                  </button>
                  
                  <button 
                    onClick={connectWallet}
                    className="flex items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                    disabled={isLoading}
                  >
                    <Image src="/images/solflare.png" alt="Solflare" width={30} height={30} className="mr-3" />
                    <span>{isLoading ? "Connecting..." : "Solflare"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Send Form */}
            {step === 2 && (
              <div className="animate-fadeIn">
                <h2 className="text-xl font-bold mb-4">Send Regards</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Send SOL and a personalized message to show your appreciation
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium mb-2">
                      Amount (SOL) *
                    </label>
                    <input
                      type="text"
                      id="amount"
                      value={amount}
                      onChange={handleAmountChange}
                      className="input-field w-full"
                      placeholder="0.1"
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Min: 0.01 SOL
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={handleMessageChange}
                      className="input-field w-full resize-none"
                      placeholder="Write a personal message..."
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="includeNft"
                          checked={includeNft}
                          onChange={() => setIncludeNft(!includeNft)}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label htmlFor="includeNft" className="ml-2 block text-sm font-medium">
                          Include NFT Certificate (+0.01 SOL)
                        </label>
                      </div>
                    </div>
                    
                    {includeNft && (
                      <div className="animate-fadeIn">
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          Choose a design:
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                          <div 
                            onClick={() => setNftDesign("gratitude")}
                            className={`p-2 rounded-lg border ${nftDesign === "gratitude" ? 'border-purple-500 ring-2 ring-purple-500' : 'border-gray-200 dark:border-gray-700'} cursor-pointer transition-all duration-200 hover:shadow-md`}
                          >
                            <div className="aspect-square bg-gradient-to-br from-purple-100 to-yellow-100 dark:from-purple-900/40 dark:to-yellow-900/40 rounded-md overflow-hidden flex items-center justify-center">
                              <span className="text-xs font-medium">Gratitude</span>
                            </div>
                          </div>
                          
                          <div 
                            onClick={() => setNftDesign("star")}
                            className={`p-2 rounded-lg border ${nftDesign === "star" ? 'border-purple-500 ring-2 ring-purple-500' : 'border-gray-200 dark:border-gray-700'} cursor-pointer transition-all duration-200 hover:shadow-md`}
                          >
                            <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-md overflow-hidden flex items-center justify-center">
                              <span className="text-xs font-medium">Star</span>
                            </div>
                          </div>
                          
                          <div 
                            onClick={() => setNftDesign("heart")}
                            className={`p-2 rounded-lg border ${nftDesign === "heart" ? 'border-purple-500 ring-2 ring-purple-500' : 'border-gray-200 dark:border-gray-700'} cursor-pointer transition-all duration-200 hover:shadow-md`}
                          >
                            <div className="aspect-square bg-gradient-to-br from-pink-100 to-red-100 dark:from-pink-900/40 dark:to-red-900/40 rounded-md overflow-hidden flex items-center justify-center">
                              <span className="text-xs font-medium">Heart</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <button 
                      type="submit"
                      className="btn"
                      disabled={!amount || !message || isLoading}
                    >
                      {isLoading ? "Processing..." : `Send ${parseFloat(amount) > 0 ? `${amount} SOL` : "Regards"}`}
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
                  Your regards have been sent to {userDetails.displayName}
                </p>
                
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg mb-8">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Transaction Summary:</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-medium">{amount} SOL</span>
                    </div>
                    {includeNft && (
                      <div className="flex justify-between">
                        <span>NFT Certificate:</span>
                        <span className="font-medium">0.01 SOL</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                      <span>Total:</span>
                      <span className="font-bold">{includeNft ? (parseFloat(amount) + 0.01).toFixed(2) : amount} SOL</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => router.push('/')}
                    className="btn-secondary"
                  >
                    Return Home
                  </button>
                  <button 
                    onClick={() => {
                      setStep(2);
                      setSuccess(false);
                    }}
                    className="btn"
                  >
                    Send More
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