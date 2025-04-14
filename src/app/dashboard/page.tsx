"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircleIcon, ClipboardIcon } from '@heroicons/react/24/outline';

// Define the Regard type
interface Regard {
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

export default function Dashboard() {
  const [regards, setRegards] = useState<Regard[]>([]);
  const [totalSol, setTotalSol] = useState(0);
  const [shareLink, setShareLink] = useState('');
  const [copyStatus, setCopyStatus] = useState('Copy');
  const [username] = useState("satoshi_fan");
  const shareableLink = `dropregards.io/send/${username}`;

  // Mock data for received regards
  const mockRegards: Regard[] = [
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

  useEffect(() => {
    // In a real app, fetch regards from the API
    // For now, use mock data
    setRegards(mockRegards);

    // Calculate total SOL
    const total = mockRegards.reduce((sum, regard) => sum + regard.amount, 0);
    setTotalSol(total);

    // Generate share link - in real app, this would be based on user's username
    setShareLink(shareableLink);
  }, [mockRegards, shareableLink]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus('Copy'), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Calculate statistics
  const totalRegards = regards.length;
  const totalNfts = regards.filter(regard => regard.nft).length;
  const uniqueSenders = new Set(regards.map(regard => regard.sender)).size;

  return (
    <main className="min-h-screen py-16 px-4">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-10 w-60 h-60 bg-purple-500/20 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 -right-10 w-80 h-80 bg-blue-500/20 rounded-full filter blur-3xl animate-float delay-300"></div>
      </div>
      
      <div className="container max-w-5xl mx-auto">
        <div className="mb-10 text-center animate-fadeIn">
          <Link href="/" className="inline-flex items-center mb-6 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Your Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            View your received regards and stats
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total SOL Card */}
          <div className="card glass card-hover animate-slideUp">
            <div className="p-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Total SOL Received</h3>
              <p className="text-3xl font-bold gradient-text">{totalSol.toFixed(2)} SOL</p>
            </div>
          </div>

          {/* Total Regards Card */}
          <div className="card glass card-hover animate-slideUp delay-100">
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Total Regards</h3>
              <p className="text-3xl font-bold gradient-text">{totalRegards}</p>
            </div>
          </div>

          {/* NFT Certificates Card */}
          <div className="card glass card-hover animate-slideUp delay-200">
            <div className="p-6">
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-pink-600 dark:text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">NFT Certificates</h3>
              <p className="text-3xl font-bold gradient-text">{totalNfts}</p>
            </div>
          </div>

          {/* Unique Senders Card */}
          <div className="card glass card-hover animate-slideUp delay-300">
            <div className="p-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Unique Senders</h3>
              <p className="text-3xl font-bold gradient-text">{uniqueSenders}</p>
            </div>
          </div>
        </div>

        {/* Share your link section */}
        <div className="card glass mb-12 animate-fadeIn">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4">Share Your Link</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Share this link with others so they can send you SOL and regards:
            </p>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1 bg-gray-50 dark:bg-gray-800/70 rounded-lg p-3 font-mono text-sm overflow-auto">
                {shareLink}
              </div>
              <button
                onClick={copyToClipboard}
                className="btn-sm flex items-center space-x-2 whitespace-nowrap"
              >
                {copyStatus === "Copied!" ? (
                  <CheckCircleIcon className="h-5 w-5" />
                ) : (
                  <ClipboardIcon className="h-5 w-5" />
                )}
                <span>{copyStatus}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Received Regards Section */}
        <div className="animate-fadeIn mb-8">
          <h2 className="text-2xl font-bold mb-6">Received Regards</h2>
          
          {regards.length === 0 ? (
            <div className="card glass text-center p-8">
              <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-800/70 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">You haven't received any regards yet.</p>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Share your link with friends to receive SOL and heartfelt messages!
              </p>
              <button 
                onClick={copyToClipboard}
                className="btn mx-auto"
              >
                Share Your Link
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {regards.map((regard, index) => (
                <div 
                  key={regard.id} 
                  className="card glass card-hover animate-slideUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold">
                          From: <span className="text-purple-600 dark:text-purple-400">{regard.sender}</span>
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(regard.timestamp).toLocaleDateString()} at {new Date(regard.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {regard.amount} SOL
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-lg mb-4 italic">
                      "{regard.message}"
                    </div>
                    
                    {regard.nft && (
                      <div className="mt-4 bg-gray-50 dark:bg-gray-800/60 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          NFT Certificate:
                        </p>
                        <div className="relative h-40 w-full rounded-lg overflow-hidden shadow-inner">
                          <Image 
                            src={regard.nft.image} 
                            alt={regard.nft.name || "NFT Certificate"} 
                            fill 
                            className="object-cover"
                          />
                        </div>
                        {regard.nft.name && (
                          <p className="text-center mt-2 text-purple-600 dark:text-purple-400 font-medium">{regard.nft.name}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 