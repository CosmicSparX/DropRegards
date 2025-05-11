"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircleIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import { regardsService, Regard } from "../api/regardsService";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";

export default function DashboardRedirect() {
  const router = useRouter();
  const { connected, publicKey } = useWallet();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Default username for demo purposes
    const defaultUsername = "dummy";
    
    // Redirect to user's dashboard if connected, otherwise to demo
    const username = connected && publicKey ? "user" : defaultUsername;
    
    // Redirect to the dynamic dashboard route
    router.replace(`/dashboard/${username}`);
  }, [router, connected, publicKey]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );
}

export function Dashboard() {
  const [regards, setRegards] = useState<Regard[]>([]);
  const [totalSol, setTotalSol] = useState(0);
  const [shareLink, setShareLink] = useState('');
  const [copyStatus, setCopyStatus] = useState('Copy');
  const [username] = useState("satoshi_fan");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'recent', 'nft'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'amount'
  
  // Define this outside useEffect so it doesn't cause re-renders
  const shareableLink = `dropregards.io/send/${username}`;

  useEffect(() => {
    const fetchRegards = async () => {
      try {
        const data = await regardsService.getRegardsByUsername(username);
        setRegards(data);
        const total = data.reduce((sum, regard) => sum + regard.amount, 0);
        setTotalSol(total);
        setShareLink(shareableLink);
      } catch (error) {
        console.error("Error fetching regards:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRegards();
  }, [username]);

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

  // Filter and sort regards
  const filteredRegards = regards
    .filter(regard => {
      if (activeTab === 'nft') return regard.nft;
      if (activeTab === 'recent') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return new Date(regard.timestamp) > oneWeekAgo;
      }
      return true;
    })
    .filter(regard => {
      if (!searchQuery) return true;
      return (
        regard.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        regard.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      if (sortBy === 'oldest') return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      return b.amount - a.amount;
    });

  return (
    <main className="min-h-screen py-16 px-4">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-10 w-60 h-60 bg-purple-500/20 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 -right-10 w-80 h-80 bg-blue-500/20 rounded-full filter blur-3xl animate-float delay-300"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
        
        {/* Animated particles */}
        <div className="absolute top-20 left-20 w-3 h-3 bg-purple-400/40 rounded-full animate-float-slow"></div>
        <div className="absolute top-40 right-40 w-2 h-2 bg-blue-400/40 rounded-full animate-float-slow delay-100"></div>
        <div className="absolute bottom-40 left-1/3 w-4 h-4 bg-pink-400/40 rounded-full animate-float-slow delay-200"></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-green-400/40 rounded-full animate-float-slow delay-300"></div>
      </div>
      
      <div className="container max-w-7xl mx-auto">
        <div className="mb-16 text-center animate-fadeIn">
          <Link href="/" className="inline-flex items-center mb-6 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-colors">
            <svg className="w-5 h-5 mr-2 animate-pulse-gentle" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 relative">
            <span className="gradient-text animate-gradient">Your Dashboard</span>
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-yellow-400/20 rounded-full filter blur-xl animate-pulse-slow hidden md:block"></div>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto text-lg">
            View your received regards and track your SOL earnings
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Total SOL Card */}
          <div className="card glass card-hover animate-slideUp relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-purple-500/10 rounded-full filter blur-xl animate-pulse-slow"></div>
            <div className="p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center animate-pulse-gentle">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">24h Change</p>
                  <p className="text-green-500 font-medium animate-pulse-gentle">+0.5 SOL</p>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Total SOL Received</h3>
              <p className="text-3xl font-bold gradient-text animate-gradient">{totalSol.toFixed(2)} SOL</p>
            </div>
          </div>

          {/* Total Regards Card */}
          <div className="card glass card-hover animate-slideUp delay-100 relative overflow-hidden">
            <div className="absolute -left-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full filter blur-xl animate-pulse-slow"></div>
            <div className="p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center animate-pulse-gentle">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">This Month</p>
                  <p className="text-green-500 font-medium animate-pulse-gentle">+12</p>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Total Regards</h3>
              <p className="text-3xl font-bold gradient-text animate-gradient">{totalRegards}</p>
            </div>
          </div>

          {/* NFT Certificates Card */}
          <div className="card glass card-hover animate-slideUp delay-200 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-pink-500/10 rounded-full filter blur-xl animate-pulse-slow"></div>
            <div className="p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center animate-pulse-gentle">
                  <svg className="w-6 h-6 text-pink-600 dark:text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Unique NFTs</p>
                  <p className="text-green-500 font-medium animate-pulse-gentle">+3</p>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">NFT Certificates</h3>
              <p className="text-3xl font-bold gradient-text animate-gradient">{totalNfts}</p>
            </div>
          </div>

          {/* Unique Senders Card */}
          <div className="card glass card-hover animate-slideUp delay-300 relative overflow-hidden">
            <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-green-500/10 rounded-full filter blur-xl animate-pulse-slow"></div>
            <div className="p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center animate-pulse-gentle">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">New This Week</p>
                  <p className="text-green-500 font-medium animate-pulse-gentle">+5</p>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Unique Senders</h3>
              <p className="text-3xl font-bold gradient-text animate-gradient">{uniqueSenders}</p>
            </div>
          </div>
        </div>

        {/* Share your link section */}
        <div className="card glass mb-12 animate-fadeIn">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Share Your Link</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Share this link with others so they can send you SOL and regards
                </p>
              </div>
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
            <div className="flex flex-wrap gap-4">
              <button className="btn-sm bg-blue-600 hover:bg-blue-700 text-white">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
                Share on Twitter
              </button>
              <button className="btn-sm bg-indigo-600 hover:bg-indigo-700 text-white">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z"/>
                </svg>
                Share on LinkedIn
              </button>
              <button className="btn-sm bg-gray-800 hover:bg-gray-900 text-white">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Share on GitHub
              </button>
            </div>
          </div>
        </div>

        {/* Regards Section */}
        <div className="animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Received Regards</h2>
            <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Search regards..."
                  className="input-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                  className="select-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="amount">Highest Amount</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <button
                  className={`inline-flex items-center justify-center btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setActiveTab('all')}
                >
                  All
                </button>
                <button
                  className={`inline-flex items-center justify-center btn-sm ${activeTab === 'recent' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setActiveTab('recent')}
                >
                  Recent
                </button>
                <button
                  className={`inline-flex items-center justify-center btn-sm ${activeTab === 'nft' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setActiveTab('nft')}
                >
                  With NFTs
                </button>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="card glass text-center p-8">
              <div className="w-16 h-16 mx-auto rounded-full border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent animate-spin mb-6"></div>
              <p className="text-gray-600 dark:text-gray-300">Loading your regards...</p>
            </div>
          ) : filteredRegards.length === 0 ? (
            <div className="card glass text-center p-8">
              <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-800/70 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">No regards found</p>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {activeTab === 'all' 
                  ? "You haven't received any regards yet."
                  : activeTab === 'recent'
                  ? "No regards received in the last 7 days."
                  : "No regards with NFTs found."}
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
              {filteredRegards.map((regard, index) => (
                <div 
                  key={regard.id} 
                  className="card glass card-hover animate-slideUp group transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="p-6 relative overflow-hidden">
                    <div className="absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full filter blur-2xl transform group-hover:scale-150 transition-all duration-700"></div>
                    <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-gradient-to-tr from-blue-500/10 to-green-500/10 rounded-full filter blur-2xl transform group-hover:scale-150 transition-all duration-700"></div>
                    
                    <div className="flex justify-between items-start mb-4 relative">
                      <div>
                        <h3 className="font-semibold text-lg">
                          From: <span className="text-purple-600 dark:text-purple-400 font-bold">{regard.sender}</span>
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {new Date(regard.timestamp).toLocaleDateString()} at {new Date(regard.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md transform transition-all duration-300 hover:scale-110 hover:shadow-lg">
                        {regard.amount} SOL
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800/60 p-5 rounded-lg mb-4 italic relative overflow-hidden group-hover:shadow-inner transition-all duration-300">
                      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-purple-500 to-pink-500 opacity-70"></div>
                      <svg className="absolute top-3 right-3 w-6 h-6 text-purple-300/20 dark:text-purple-500/20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10zm-10 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                      <p className="text-base text-gray-700 dark:text-gray-200 relative pl-4">"{regard.message}"</p>
                    </div>
                    
                    {regard.nft && (
                      <div className="mt-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/60 dark:to-gray-900/30 p-5 rounded-lg transform transition-all duration-300 group-hover:shadow-md relative overflow-hidden">
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full filter blur-2xl"></div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          NFT Certificate:
                        </p>
                        <div className="relative h-48 w-full rounded-lg overflow-hidden shadow-md transform transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                          <Image 
                            src={regard.nft.image} 
                            alt={regard.nft.name || "NFT Certificate"} 
                            fill 
                            className="object-cover transform transition-all duration-700 hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        {regard.nft.name && (
                          <p className="text-center mt-3 text-purple-600 dark:text-purple-400 font-medium text-lg">
                            {regard.nft.name}
                          </p>
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