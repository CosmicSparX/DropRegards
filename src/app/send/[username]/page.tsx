"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { regardsService, UserDetails } from "../../api/regardsService";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL, Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";

// NFT Types available in the app
const NFT_TYPES = [
  { id: "gratitude", name: "Gratitude", image: "/images/nft-certificate-1.jpg" },
  { id: "star", name: "Star", image: "/images/nft-certificate-2.jpg" },
  { id: "heart", name: "Heart", image: "/images/nft-certificate-1.jpg" }
];

export default function SendRegards() {
  const params = useParams();
  const router = useRouter();
  const username = params.username;
  
  // Add Solana wallet integration
  const { connected, publicKey, sendTransaction } = useWallet();

  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [includeNft, setIncludeNft] = useState(false);
  const [nftDesign, setNftDesign] = useState("gratitude");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [regardId, setRegardId] = useState<number | null>(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [addNftAfterSend, setAddNftAfterSend] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    username: "",
    displayName: "",
    bio: "",
    avatarUrl: "/images/profile.jpg"
  });
  const [showNftPreview, setShowNftPreview] = useState(false);
  const [customMessage, setCustomMessage] = useState("");

  // Update based on real wallet connection
  useEffect(() => {
    if (connected && publicKey) {
      setIsConnected(true);
      setWalletAddress(publicKey.toString());
      if (step === 1) setStep(2);
    } else {
      setIsConnected(false);
      setWalletAddress("");
    }
  }, [connected, publicKey, step]);

  useEffect(() => {
    // Fetch user details from the API
    const fetchUserDetails = async () => {
      if (username) {
        try {
          const details = await regardsService.getUserDetails(username as string);
          setUserDetails(details);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    };

    fetchUserDetails();
  }, [username]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and decimal point
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setAmount(value);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleCustomMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomMessage(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!connected || !publicKey) {
        alert("Please connect your wallet first.");
        setIsLoading(false);
        return;
      }

      // In a real app, we would send SOL here
      // For this example, we'll still use the mock API

      // Mock recipient address (in a real app, this would be fetched from a database)
      const recipientAddress = "8xUV1RBaSnDmY8jkPN8WGaP1Kv9WfUFQcTfWz3AcBKqj";
      const amountLamports = parseFloat(amount) * LAMPORTS_PER_SOL;

      // Create a mock transaction for demonstration
      // In a real app, you'd create an actual transaction and send it
      console.log(`Sending ${amount} SOL from ${publicKey.toString()} to ${recipientAddress}`);
      
      // Call our mock API service
      const result = await regardsService.sendRegard(
        username as string,
        publicKey.toString(),
        parseFloat(amount),
        message,
        includeNft,
        includeNft ? nftDesign : undefined
      );
      
      if (result.success) {
        setTransactionId(result.transactionId);
        setRegardId(result.regardId);
        setSuccess(true);
        setStep(3);
      } else {
        alert("Transaction failed. Please try again.");
      }
    } catch (error) {
      console.error("Error sending regard:", error);
      alert("An error occurred while processing your transaction");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to handle adding an NFT after the transaction is complete
  const handleAddNft = async () => {
    if (!regardId) return;
    
    setIsLoading(true);
    
    try {
      // Call mock API to add NFT to existing regard
      const result = await regardsService.addNftToRegard(
        regardId,
        walletAddress,
        nftDesign
      );
      
      if (result.success) {
        setIsLoading(false);
        setAddNftAfterSend(true);
        setStep(4); // Move to the final step showing both transactions
      } else {
        alert("NFT creation failed. Please try again.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error adding NFT:", error);
      alert("An error occurred while creating your NFT");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-16 px-4">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-10 w-60 h-60 bg-purple-500/20 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 -right-10 w-80 h-80 bg-blue-500/20 rounded-full filter blur-3xl animate-float delay-300"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
        
        {/* Animated particles */}
        <div className="absolute top-20 left-[20%] w-3 h-3 bg-purple-400/40 rounded-full animate-float-slow"></div>
        <div className="absolute top-40 right-[30%] w-2 h-2 bg-blue-400/40 rounded-full animate-float-slow delay-100"></div>
        <div className="absolute bottom-40 left-[40%] w-4 h-4 bg-pink-400/40 rounded-full animate-float-slow delay-200"></div>
        <div className="absolute top-1/3 right-[25%] w-3 h-3 bg-green-400/40 rounded-full animate-float-slow delay-300"></div>
      </div>
      
      <div className="container max-w-4xl mx-auto">
        <div className="mb-16 text-center animate-fadeIn">
          <Link href="/" className="inline-flex items-center mb-6 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-colors">
            <svg className="w-5 h-5 mr-2 animate-pulse-gentle" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 relative">
            <span className="animate-gradient">Send Regards to {userDetails.displayName}</span>
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-yellow-400/20 rounded-full filter blur-xl animate-pulse-slow hidden md:block"></div>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto text-lg">
            Show your appreciation with SOL and a personalized message
          </p>
        </div>

        <div className="card glass shadow-lg backdrop-blur-sm animate-scaleIn relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full filter blur-3xl"></div>
          <div className="absolute -left-20 -top-20 w-60 h-60 bg-gradient-to-tr from-blue-500/5 to-green-500/5 rounded-full filter blur-3xl"></div>
          
          {/* Step indicators */}
          <div className="flex justify-between px-6 pt-6">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${step >= 1 ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                1
              </div>
              <span className={`hidden sm:inline-block transition-colors duration-300 ${step >= 1 ? 'text-gray-800 dark:text-gray-200 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                Connect
              </span>
            </div>
            <div className="relative flex-1 mx-4">
              <div className="h-0.5 absolute top-4 w-full bg-gray-200 dark:bg-gray-700"></div>
              <div className={`h-0.5 absolute top-4 bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-1000 ease-in-out ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${step >= 2 ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                2
              </div>
              <span className={`hidden sm:inline-block transition-colors duration-300 ${step >= 2 ? 'text-gray-800 dark:text-gray-200 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                Send
              </span>
            </div>
            <div className="relative flex-1 mx-4">
              <div className="h-0.5 absolute top-4 w-full bg-gray-200 dark:bg-gray-700"></div>
              <div className={`h-0.5 absolute top-4 bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-1000 ease-in-out ${step >= 3 ? 'w-full' : 'w-0'}`}></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${step >= 3 ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                3
              </div>
              <span className={`hidden sm:inline-block transition-colors duration-300 ${step >= 3 ? 'text-gray-800 dark:text-gray-200 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                Done
              </span>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* User details section */}
            <div className="flex items-center mb-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/70 dark:to-gray-900/40 p-6 rounded-xl animate-fadeIn relative overflow-hidden backdrop-blur-sm">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-500/5 rounded-full filter blur-2xl animate-pulse-slow"></div>
              
              <div className="w-20 h-20 rounded-full overflow-hidden mr-6 border-2 border-purple-200 dark:border-purple-900 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                {userDetails.avatarUrl ? (
                  <Image 
                    src={userDetails.avatarUrl} 
                    alt={userDetails.displayName || "User"} 
                    width={100} 
                    height={100} 
                    className="w-full h-full object-cover transition-all duration-700 hover:scale-110" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{userDetails.displayName}</h3>
                <p className="text-purple-600 dark:text-purple-400 font-medium">@{userDetails.username}</p>
                {userDetails.bio && (
                  <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-md">{userDetails.bio}</p>
                )}
              </div>
            </div>

            {/* Step 1: Connect Wallet */}
            {step === 1 && (
              <div className="animate-fadeIn text-center">
                <h2 className="text-3xl font-bold mb-6 animate-gradient">Connect Your Wallet</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-10 text-lg max-w-lg mx-auto">
                  Connect your Solana wallet to send SOL and share your appreciation
                </p>
                
                <div className="max-w-md mx-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/70 dark:to-gray-900/40 p-8 rounded-2xl shadow-inner animate-scaleIn relative overflow-hidden backdrop-blur-sm mb-8">
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-500/5 rounded-full filter blur-2xl animate-pulse-slow"></div>
                  <div className="absolute -left-10 -top-10 w-40 h-40 bg-blue-500/5 rounded-full filter blur-2xl animate-pulse-slow delay-200"></div>
                  
                  <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 p-1 rounded-xl mb-6 shadow-lg shadow-purple-500/20 animate-pulse-gentle overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <div className="relative p-6 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <WalletMultiButton className="btn w-full text-base font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 whitespace-nowrap" />
                    </div>
                  </div>
                  
                  <div className="text-center mt-6">
                    <p className="text-gray-600 dark:text-gray-400 mb-2 flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Supported Wallets
                    </p>
                    <div className="flex items-center justify-center space-x-6 mt-4">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md mb-2">
                          <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" opacity="0.2" />
                            <path d="M19.97 10.43c-.13-.21-.33-.34-.57-.34H4.6c-.24 0-.44.13-.56.34-.12.2-.13.45-.02.66l2.18 4.92c.05.1.12.2.22.28.09.08.2.14.33.18.62.15 1.27.24 1.95.24 3.2 0 5.88-2.1 6.6-4.91h1.45c.6 1.62 2.13 2.79 3.96 2.79.36 0 .71-.05 1.03-.14.21-.06.39-.19.52-.37.13-.19.19-.41.15-.63l-.72-3.76c-.04-.24-.19-.44-.42-.53-.23-.09-.48-.06-.68.07z" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Phantom</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md mb-2">
                          <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" opacity="0.2" />
                            <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Solflare</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md mb-2">
                          <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10 10-4.48 10-10z" opacity="0.2" />
                            <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Other</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto flex items-center justify-center">
                  <svg className="w-4 h-4 mr-1 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Your transaction is secure and will be processed on the Solana blockchain
                </p>
              </div>
            )}

            {/* Step 2: Send Regards */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="animate-fadeIn">
                <h2 className="text-2xl font-bold mb-6">Send Regards</h2>
                
                {/* Amount Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount (SOL)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder="0.00"
                      className="input w-full pl-12"
                      required
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Current SOL price: $20.50
                  </p>
                </div>

                {/* Message Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={handleMessageChange}
                    placeholder="Write a heartfelt message..."
                    className="textarea w-full h-32"
                    required
                  />
                </div>

                {/* NFT Options */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={includeNft}
                        onChange={(e) => setIncludeNft(e.target.checked)}
                        className="checkbox"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Include NFT Certificate
                      </span>
                    </label>
                    {includeNft && (
                      <button
                        type="button"
                        onClick={() => setShowNftPreview(!showNftPreview)}
                        className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        {showNftPreview ? 'Hide Preview' : 'Show Preview'}
                      </button>
                    )}
                  </div>

                  {includeNft && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="grid grid-cols-3 gap-6">
                        {NFT_TYPES.map((nft) => (
                          <div
                            key={nft.id}
                            className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                              nftDesign === nft.id
                                ? 'border-purple-500 dark:border-purple-400 ring-2 ring-purple-300 dark:ring-purple-700 scale-105'
                                : 'border-transparent'
                            }`}
                            onClick={() => setNftDesign(nft.id)}
                          >
                            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-pink-500/10 animate-pulse-slow"></div>
                            <Image
                              src={nft.image}
                              alt={nft.name}
                              width={200}
                              height={200}
                              className="w-full h-40 object-cover transition-all duration-700 hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-4">
                              <span className="text-white text-lg font-bold">{nft.name}</span>
                              <span className="text-white/80 text-sm">Click to select</span>
                            </div>
                            {nftDesign === nft.id && (
                              <div className="absolute top-2 right-2 bg-purple-500 text-white rounded-full p-1 shadow-lg animate-scaleIn">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {showNftPreview && (
                        <div className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/70 dark:to-gray-900/40 rounded-xl transform transition-all duration-300 hover:shadow-lg animate-scaleIn relative overflow-hidden">
                          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full filter blur-2xl animate-pulse-slow"></div>
                          <div className="absolute -left-10 -top-10 w-40 h-40 bg-gradient-to-tr from-blue-500/5 to-green-500/5 rounded-full filter blur-2xl animate-pulse-slow delay-200"></div>
                          
                          <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                            </svg>
                            Customize NFT Certificate
                          </h4>
                          
                          <div className="mb-4">
                            <input
                              type="text"
                              value={customMessage}
                              onChange={handleCustomMessageChange}
                              placeholder="Add a custom message to your NFT..."
                              className="input w-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-purple-200 dark:border-purple-800 focus:border-purple-500 dark:focus:border-purple-400 rounded-xl transition-all duration-300"
                            />
                          </div>
                          
                          <div className="relative h-60 w-full rounded-xl overflow-hidden shadow-lg group">
                            <Image
                              src={NFT_TYPES.find(nft => nft.id === nftDesign)?.image || ''}
                              alt="NFT Preview"
                              fill
                              className="object-cover transition-all duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              {customMessage ? (
                                <p className="text-white text-center px-6 py-4 bg-black/60 backdrop-blur-sm rounded-lg max-w-xs font-medium">{customMessage}</p>
                              ) : (
                                <p className="text-white/80 text-center px-6">Add a custom message above to preview it here</p>
                              )}
                            </div>
                            <div className="absolute top-3 right-3 bg-purple-500/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                              Preview
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      'Send Regards'
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
              <div className="animate-fadeIn text-center relative">
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-green-500/10 rounded-full filter blur-3xl transform animate-pulse-slow"></div>
                <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-blue-500/10 rounded-full filter blur-3xl transform animate-pulse-slow delay-200"></div>
                
                <div className="relative animate-scaleIn">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20 animate-pulse-gentle">
                    <CheckCircleIcon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-green-400/20 rounded-full animate-ping opacity-75"></div>
                </div>
                
                <h2 className="text-3xl font-bold mb-4 animate-gradient">Regards Sent Successfully!</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg max-w-md mx-auto">
                  Your SOL and message have been sent to <span className="font-bold text-purple-600 dark:text-purple-400">{userDetails.displayName}</span>
                </p>
                
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/70 dark:to-gray-900/40 p-6 rounded-xl mb-8 shadow-inner transform transition-all duration-300 hover:shadow-md animate-slideUp relative overflow-hidden backdrop-blur-sm">
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/5 rounded-full filter blur-2xl animate-pulse-slow"></div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-3 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Transaction Complete
                  </p>
                  
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex items-center space-x-3 text-lg">
                      <span className="font-medium text-purple-600 dark:text-purple-400">{amount} SOL</span>
                      <span className="text-gray-500">sent to</span>
                      <span className="font-medium text-purple-600 dark:text-purple-400">{userDetails.displayName}</span>
                    </div>
                    
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mt-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Transaction ID:</p>
                      <div className="flex items-center">
                        <p className="font-mono text-xs break-all text-gray-700 dark:text-gray-300 mr-2">{transactionId.substring(0, 40)}...</p>
                        <button className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors" onClick={() => navigator.clipboard.writeText(transactionId)}>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {!addNftAfterSend && includeNft && (
                  <div className="mb-8 animate-slideUp" style={{ animationDelay: '0.3s' }}>
                    <button
                      onClick={handleAddNft}
                      className="btn btn-primary relative group overflow-hidden"
                      disabled={isLoading}
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl"></span>
                      <span className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-30 transition-opacity duration-300 bg-white rounded-xl"></span>
                      <span className="relative flex items-center">
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                            Creating NFT...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            Create NFT Certificate
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                )}
                
                <div className="flex justify-center space-x-4 animate-slideUp" style={{ animationDelay: '0.5s' }}>
                  <Link href="/" className="btn btn-ghost bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Back to Home
                  </Link>
                  <button
                    onClick={() => {
                      setStep(1);
                      setAmount('');
                      setMessage('');
                      setIncludeNft(false);
                      setNftDesign('gratitude');
                      setSuccess(false);
                      setTransactionId('');
                      setRegardId(null);
                    }}
                    className="btn btn-primary"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Send Another
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: NFT Success */}
            {step === 4 && (
              <div className="animate-fadeIn text-center relative">
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-pink-500/10 rounded-full filter blur-3xl transform animate-pulse-slow"></div>
                <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-purple-500/10 rounded-full filter blur-3xl transform animate-pulse-slow delay-200"></div>
                
                <div className="relative animate-scaleIn">
                  <div className="w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/20 animate-pulse-gentle">
                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-purple-400/20 rounded-full animate-ping opacity-75"></div>
                </div>
                
                <h2 className="text-3xl font-bold mb-4 animate-gradient">NFT Certificate Created!</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg max-w-md mx-auto">
                  Your NFT certificate has been added to your regard for <span className="font-bold text-purple-600 dark:text-purple-400">{userDetails.displayName}</span>
                </p>
                
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/70 dark:to-gray-900/40 p-6 rounded-xl mb-8 shadow-inner transform transition-all duration-300 hover:shadow-md animate-slideUp relative overflow-hidden">
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-500/5 rounded-full filter blur-2xl animate-pulse-slow"></div>
                  <div className="absolute -left-10 -top-10 w-40 h-40 bg-pink-500/5 rounded-full filter blur-2xl animate-pulse-slow delay-200"></div>
                  
                  <div className="relative h-64 w-full rounded-xl overflow-hidden shadow-xl group transform transition-all duration-500 hover:scale-[1.02]">
                    <Image
                      src={NFT_TYPES.find(nft => nft.id === nftDesign)?.image || ''}
                      alt="NFT Certificate"
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 flex items-end justify-center p-6">
                      <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 max-w-xs transform transition-all duration-500 group-hover:translate-y-0 translate-y-2">
                        <p className="text-white text-center font-medium">
                          {customMessage || `NFT Certificate for ${userDetails.displayName}`}
                        </p>
                        <p className="text-white/70 text-center text-sm mt-2">
                          Created on {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 bg-purple-500/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                      {NFT_TYPES.find(nft => nft.id === nftDesign)?.name} Certificate
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-4 animate-slideUp" style={{ animationDelay: '0.3s' }}>
                  <Link href="/" className="btn btn-ghost bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Back to Home
                  </Link>
                  <button
                    onClick={() => {
                      setStep(1);
                      setAmount('');
                      setMessage('');
                      setIncludeNft(false);
                      setNftDesign('gratitude');
                      setSuccess(false);
                      setTransactionId('');
                      setRegardId(null);
                    }}
                    className="btn btn-primary relative group overflow-hidden"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl"></span>
                    <span className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-30 transition-opacity duration-300 bg-white rounded-xl"></span>
                    <span className="relative flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Send Another
                    </span>
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