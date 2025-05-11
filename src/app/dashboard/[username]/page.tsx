"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircleIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import axios from "axios";

// Import shared types and dummy data
import { Regard, UserProfile, RegardStats, DUMMY_REGARDS, DUMMY_STATS, DUMMY_USERS } from "../../utils/dummyData";

export default function Dashboard() {
  const params = useParams();
  const username = (params.username as string) || "";
  
  const [regards, setRegards] = useState<Regard[]>([]);
  const [stats, setStats] = useState<RegardStats>({
    totalSol: 0,
    totalRegards: 0,
    uniqueSenders: 0
  });
  const [user, setUser] = useState<UserProfile | null>(null);
  const [shareLink, setShareLink] = useState('');
  const [copyStatus, setCopyStatus] = useState('Copy');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'recent'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'amount'
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // If username is "dummy", use the demo data
        if (username.toLowerCase() === "dummy") {
          setUser(DUMMY_USERS.dummy);
          setRegards(DUMMY_REGARDS);
          setStats(DUMMY_STATS);
          setShareLink(`dropregards.io/send/dummy`);
          setIsLoading(false);
          return;
        }

        // Determine API base URL based on environment
        const apiBase = process.env.NODE_ENV === "production" 
          ? process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.dropregards.io" 
          : "http://localhost:5000";
        
        // Fetch user data
        let userData: UserProfile;
        try {
          const userResponse = await axios.get(`${apiBase}/api/users/username/${username}`);
          userData = userResponse.data;
        } catch (error) {
          console.error("Failed to fetch user:", error);
          // Create a default user if not found
          userData = {
            username,
            displayName: username.charAt(0).toUpperCase() + username.slice(1),
            bio: "DropRegards user",
            profileImage: `https://ui-avatars.com/api/?name=${username.substring(0, 2).toUpperCase()}&background=8a5cf6&color=ffffff&size=256&bold=true`,
          };
        }
        setUser(userData);
        
        // Set share link based on the username
        setShareLink(`dropregards.io/send/${username}`);
        
        // Try to fetch regards and stats
        try {
          // In a real implementation, these endpoints would be secured with authentication
          const regardsResponse = await axios.get(`${apiBase}/api/regards/list?username=${username}`);
          const statsResponse = await axios.get(`${apiBase}/api/regards/public-stats/${username}`);
          
          setRegards(regardsResponse.data || []);
          setStats(statsResponse.data || {
            totalSol: 0,
            totalRegards: 0,
            uniqueSenders: 0
          });
        } catch (error) {
          console.error("Failed to fetch regards/stats:", error);
          // Set empty data for new users
          setRegards([]);
          setStats({
            totalSol: 0,
            totalRegards: 0,
            uniqueSenders: 0
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (username) {
      fetchData();
    }
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

  // Filter and sort regards
  const filteredRegards = regards
    .filter(regard => {
      if (activeTab === 'recent') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return new Date(regard.createdAt) > oneWeekAgo;
      }
      return true;
    })
    .filter(regard => {
      if (!searchQuery) return true;
      return (
        regard.sender.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        regard.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return b.amount - a.amount;
    });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card glass max-w-md p-6 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">User Not Found</h1>
          <p>No user found with username: {username}</p>
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
            <span className="gradient-text animate-gradient">{user.displayName}'s Dashboard</span>
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-yellow-400/20 rounded-full filter blur-xl animate-pulse-slow hidden md:block"></div>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto text-lg">
            View your received regards and track your SOL earnings
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
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
              </div>
              <h3 className="text-lg font-semibold mb-2">Total SOL Received</h3>
              <p className="text-3xl font-bold gradient-text animate-gradient">{stats.totalSol.toFixed(2)} SOL</p>
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
              </div>
              <h3 className="text-lg font-semibold mb-2">Total Regards</h3>
              <p className="text-3xl font-bold gradient-text animate-gradient">{stats.totalRegards}</p>
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
              </div>
              <h3 className="text-lg font-semibold mb-2">Unique Senders</h3>
              <p className="text-3xl font-bold gradient-text animate-gradient">{stats.uniqueSenders}</p>
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
            </div>
          </div>
        </div>

        {/* Regards Section */}
        <div className="animate-fadeIn mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Received Regards</h2>
            <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search regards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10 pr-4 py-2 w-full"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount">Highest Amount</option>
              </select>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('all')}
                className={`inline-flex items-center justify-center py-3 px-6 font-medium ${activeTab === 'all' ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400' : 'text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'}`}
              >
                All Regards
              </button>
              <button
                onClick={() => setActiveTab('recent')}
                className={`inline-flex items-center justify-center py-3 px-6 font-medium ${activeTab === 'recent' ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400' : 'text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'}`}
              >
                Recent (7 days)
              </button>
            </div>
          </div>
          
          {filteredRegards.length === 0 ? (
            <div className="card glass text-center p-8">
              <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-xl font-medium mt-4 mb-2">No regards yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {searchQuery ? "No regards match your search criteria" : "Share your link to start receiving regards and SOL"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredRegards.map((regard) => (
                <div key={regard.id} className="card glass card-hover p-6 animate-fadeIn">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center font-mono text-lg font-bold text-purple-600 dark:text-purple-400">
                        {regard.sender.username.substring(0, 2).toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                        <div>
                          <span className="font-semibold">{regard.sender.username}</span>
                          <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                            {new Date(regard.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="text-purple-600 dark:text-purple-400 font-bold">
                          +{regard.amount} SOL
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {regard.message}
                      </p>
                      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                        <span>Tx: {regard.transactionSignature.substring(0, 8)}...{regard.transactionSignature.substring(regard.transactionSignature.length - 8)}</span>
                      </div>
                    </div>
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