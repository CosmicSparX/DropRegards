'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import FloatingNavbar from "./components/FloatingNavbar";
import MouseFollowEffect from "./components/MouseFollowEffect";
import GlobalMouseEffect from "./components/GlobalMouseEffect";
import { initScrollAnimations } from "./utils/scrollAnimations";
import dynamic from "next/dynamic";

// Dynamically import wallet components with ssr disabled to prevent hydration errors
const WalletButton = dynamic(
  () => import('./components/WalletButton'),
  { ssr: false }
);

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Initialize scroll animations
    const cleanupFn = initScrollAnimations();
    
    // Check if mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || window.matchMedia('(hover: none)').matches);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup on component unmount
    return () => {
      if (typeof cleanupFn === 'function') {
        cleanupFn();
      }
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  return (
    <GlobalMouseEffect>
      <main className="overflow-x-hidden mt-0 pt-0">
        {/* Floating Navbar */}
        <FloatingNavbar />

        {/* Hero Section */}
        <MouseFollowEffect 
          disabled={isMobile}
          glowColor="rgba(124, 58, 237, 0.6)"
          glowSize={260}
          glowOpacity={0.7}
          useGradient
          secondaryColor="rgba(251, 113, 133, 0.4)"
          className="w-full"
          sectionId="hero"
        >
          <section id="hero" className="relative min-h-[90vh] md:min-h-screen pt-5 pb-10 md:pt-12 md:pb-24 flex items-center">
            {/* Background Elements with Parallax */}
            <div className="absolute inset-0 overflow-hidden -z-10">
              <div className="absolute top-1/4 -left-10 w-72 h-72 bg-purple-500/30 rounded-full filter blur-3xl animate-float parallax" data-parallax-speed="-0.05"></div>
              <div className="absolute bottom-1/4 -right-10 w-72 h-72 bg-sky-500/20 rounded-full filter blur-3xl animate-float delay-200 parallax" data-parallax-speed="0.08"></div>
              <div className="absolute top-2/3 left-1/3 w-60 h-60 bg-pink-500/20 rounded-full filter blur-3xl animate-float delay-300 parallax" data-parallax-speed="-0.03"></div>
            </div>

            <div className="container">
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 gap-y-10 md:gap-y-16 items-center">
                <div>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6">
                    <span className="gradient-text scroll-animate flip" data-animation-speed="1.2">DropRegards</span>
                    <br />
                    <span className="text-3xl sm:text-4xl md:text-5xl scroll-animate fade-right" data-animation-speed="1.0">Send SOL with Heart</span>
                  </h1>
                  <p className="text-base md:text-lg mb-6 md:mb-8 text-gray-600 dark:text-gray-300 max-w-lg scroll-animate fade-up">
                    Send Solana, personalized messages, and custom NFTs to show appreciation to the people who matter most.
                  </p>
                  <div className="flex flex-wrap gap-4 scroll-animate fade-up">
                    <Link 
                      href="/create" 
                      className="btn text-base md:text-lg px-6 py-3 md:px-8 md:py-4 min-w-0 w-full md:min-w-[200px] md:w-auto h-auto shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-pulse-shadow hover-glow"
                    >
                      Get Started
                    </Link>
                    <WalletButton />
                  </div>
                </div>
                <div className="relative scroll-animate">
                  <div className="aspect-square max-w-[280px] sm:max-w-sm md:max-w-md mx-auto relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-3xl transform rotate-6 scale-105"></div>
                    <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-3xl shadow-xl"></div>
                    <div className="relative p-6 h-full flex flex-col">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="text-sm text-gray-400">dropregards.io</div>
                      </div>
                      <div className="flex-1 flex flex-col justify-center items-center text-center">
                        <div className="w-20 h-20 relative mb-4">
                          <Image
                            src="/images/logo.jpg.jpg"
                            alt="DropRegards Logo"
                            className="rounded-full object-cover"
                            fill
                          />
                        </div>
                        <div className="text-2xl font-bold mb-2">Thanks Alice!</div>
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-4 text-center w-full animate-enhanced-shimmer">
                          <span className="text-sm text-gray-500 dark:text-gray-400">You received</span>
                          <div className="text-2xl font-bold gradient-text">0.5 SOL</div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 italic">
                          "Thanks for all your help with the project! You're amazing!"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </MouseFollowEffect>

        {/* How it Works Section */}
        <section id="how-it-works" data-section="how-it-works" className="section bg-gray-50 dark:bg-gray-900">
          <div className="container">
            <div className="text-center mb-10 md:mb-16 scroll-animate fade-up">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">How It Works</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
                Sending SOL with a personal touch has never been easier
              </p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 responsive-grid gap-6 md:gap-8 sequential-animate">
              {/* Step 1 */}
              <div className="card glass card-hover card-hover-effect scroll-animate fade-up">
                <div className="p-6">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4 scroll-animate zoom-in">
                    <span className="text-xl font-bold text-purple-600 dark:text-purple-400">1</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Connect Your Wallet</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Link your Solana wallet to get started. We support Phantom, Solflare, and more.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="card glass card-hover card-hover-effect scroll-animate fade-up">
                <div className="p-6">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 scroll-animate zoom-in">
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">2</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Create Your DropLink</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Set up your personalized page to receive SOL and messages from anyone.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="card glass card-hover card-hover-effect scroll-animate fade-up">
                <div className="p-6">
                  <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mb-4 scroll-animate zoom-in">
                    <span className="text-xl font-bold text-pink-600 dark:text-pink-400">3</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Receive SOL & NFTs</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Friends can send you SOL with personalized messages and optional NFT certificates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <MouseFollowEffect 
          disabled={isMobile}
          glowColor="rgba(56, 189, 248, 0.5)"
          glowSize={240}
          glowOpacity={0.7}
          useGradient
          secondaryColor="rgba(16, 185, 129, 0.4)"
          className="w-full"
          sectionId="features"
        >
          <section id="features" className="section">
            <div className="container">
              <div className="grid md:grid-cols-2 responsive-grid gap-8 md:gap-12 items-center">
                <div className="relative scroll-animate fade-right order-2 md:order-1">
                  <div className="aspect-video max-w-sm md:max-w-lg relative mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 to-pink-600/20 rounded-3xl transform -rotate-2"></div>
                    <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
                      <div className="relative h-full flex items-center justify-center">
                        <div className="w-full max-w-sm mx-auto grid grid-cols-2 gap-4 p-6 sequential-animate">
                          <div className="col-span-2 card bg-gray-50 dark:bg-gray-700/50 p-4 text-center scroll-animate zoom-in">
                            <div className="gradient-text text-xl font-bold">1.75 SOL</div>
                            <div className="text-sm text-gray-500">Total Received</div>
                          </div>
                          <div className="card bg-gray-50 dark:bg-gray-700/50 p-4 text-center scroll-animate zoom-in">
                            <div className="text-lg font-bold">5</div>
                            <div className="text-sm text-gray-500">Regards</div>
                          </div>
                          <div className="card bg-gray-50 dark:bg-gray-700/50 p-4 text-center scroll-animate zoom-in">
                            <div className="text-lg font-bold">2</div>
                            <div className="text-sm text-gray-500">NFTs</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="scroll-animate fade-left order-1 md:order-2">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6">Track Your Regards</h2>
                  <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-4 md:mb-6">
                    Your personalized dashboard shows all the messages, SOL, and NFTs you've received. Watch your collection grow as friends send you regards.
                  </p>

                  <ul className="space-y-4 mb-8 sequential-animate">
                    <li className="flex items-start scroll-animate fade-left">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 mt-1">
                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-600 dark:text-gray-300">See total SOL and unique senders</span>
                    </li>
                    <li className="flex items-start scroll-animate fade-left">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 mt-1">
                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-600 dark:text-gray-300">View personalized messages from friends</span>
                    </li>
                    <li className="flex items-start scroll-animate fade-left">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 mt-1">
                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-600 dark:text-gray-300">Collect unique NFT certificates</span>
                    </li>
                  </ul>

                  <Link href="/dashboard" className="btn scroll-animate fade-up hover-glow">
                    View Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </MouseFollowEffect>

        {/* Testimonial Section */}
        <MouseFollowEffect 
          disabled={isMobile}
          glowColor="rgba(251, 113, 133, 0.6)"
          glowSize={240}
          glowOpacity={0.7}
          useGradient
          secondaryColor="rgba(253, 186, 116, 0.4)"
          className="w-full"
          sectionId="testimonials"
        >
          <section id="testimonials" className="section bg-gray-50 dark:bg-gray-900">
            <div className="container">
              <div className="max-w-3xl mx-auto text-center scroll-animate fade-up">
                <div className="mb-6 text-purple-600 dark:text-purple-400">
                  <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804 .167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804 .167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
                  </svg>
                </div>
                <blockquote className="text-lg sm:text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-200 mb-6 md:mb-8 scroll-animate fade-up">
                  DropRegards has completely changed how I receive SOL from friends. The personalized messages and NFTs make each transaction special and meaningful.
                </blockquote>
                <div className="flex items-center justify-center scroll-animate fade-up">
                  <div className="w-12 h-12 relative mr-4">
                    <Image 
                      src="https://randomuser.me/api/portraits/women/32.jpg" 
                      alt="Testimonial Avatar"
                      className="rounded-full" 
                      fill
                    />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-gray-100">Jessica Chen</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">Solana Developer</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </MouseFollowEffect>

        {/* CTA Section */}
        <MouseFollowEffect 
          disabled={isMobile}
          glowColor="rgba(139, 92, 246, 0.6)"
          glowSize={280}
          glowOpacity={0.75}
          useGradient
          secondaryColor="rgba(56, 189, 248, 0.4)"
          className="w-full"
          sectionId="cta"
        >
          <section id="cta" className="section relative overflow-hidden">
            <div className="absolute inset-0 -z-10">
              <div className="absolute inset-0 opacity-10 dark:opacity-20 bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] aspect-square bg-gradient-to-br from-purple-600/20 via-blue-500/20 to-pink-500/20 rounded-full animate-pulse parallax" data-parallax-speed="0.02"></div>
            </div>
            <div className="container">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 scroll-animate fade-up">Join DropRegards Today</h2>
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-6 md:mb-8 max-w-xl mx-auto scroll-animate fade-up">
                  Start receiving SOL with personalized messages and NFTs from your friends, colleagues, and community.
                </p>
                <div className="flex flex-col md:flex-row flex-wrap justify-center gap-4 scroll-animate fade-up">
                  <Link href="/create" className="btn hover-glow card-hover-effect w-full md:w-auto mb-3 md:mb-0">
                    Create Your Account
                  </Link>
                  <Link href="/dashboard" className="btn-secondary card-hover-effect w-full md:w-auto">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    View Demo
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </MouseFollowEffect>

        {/* Footer */}
        <footer className="py-8 md:py-12 border-t border-gray-200 dark:border-gray-800">
          <div className="container">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0 text-center md:text-left">
                <Link href="/" className="flex items-center justify-center md:justify-start">
                  <span className="text-2xl font-bold gradient-text">DropRegards</span>
                </Link>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm md:text-base">
                  Send SOL with a personal touch
                </p>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  <span className="sr-only">Discord</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M20.222 0c1.406 0 2.54 1.137 2.607 2.475V24l-2.677-2.273-1.47-1.338-1.604-1.398.67 2.205H3.71c-1.402 0-2.54-1.065-2.54-2.476V2.48C1.17 1.142 2.31.003 3.715.003h16.5L20.222 0zm-6.118 5.683h-.03l-.202.2c2.073.6 3.076 1.537 3.076 1.537-1.336-.668-2.54-1.002-3.744-1.137-.87-.135-1.74-.064-2.475 0h-.2c-.47 0-1.47.2-2.81.735-.467.203-.735.336-.735.336s1.002-1.002 3.21-1.537l-.135-.135s-1.672-.064-3.477 1.27c0 0-1.805 3.144-1.805 7.02 0 0 1 1.74 3.743 1.806 0 0 .4-.533.805-1.002-1.54-.468-2.14-1.404-2.14-1.404s.134.066.335.2h.06c.03 0 .044.015.06.03v.006c.016.016.03.03.06.03.33.136.66.27.93.4.466.202 1.065.403 1.8.536.93.135 1.996.2 3.21 0 .6-.135 1.2-.267 1.8-.535.39-.2.87-.4 1.397-.737 0 0-.6.936-2.205 1.404.33.466.795 1 .795 1 2.744-.06 3.81-1.8 3.87-1.726 0-3.87-1.815-7.02-1.815-7.02-1.635-1.214-3.165-1.26-3.435-1.26l.056-.02zm.168 4.413c.703 0 1.27.6 1.27 1.335 0 .74-.57 1.34-1.27 1.34-.7 0-1.27-.6-1.27-1.334 0-.74.57-1.338 1.27-1.338zm-4.543 0c.7 0 1.266.6 1.266 1.335 0 .74-.57 1.34-1.27 1.34-.7 0-1.27-.6-1.27-1.334 0-.74.57-1.338 1.27-1.338z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <p className="mb-3 md:mb-4">© {new Date().getFullYear()} DropRegards. All rights reserved.</p>
              <div className="flex justify-center flex-wrap gap-3 md:gap-4 space-x-0 md:space-x-6">
                <a href="#" className="hover:text-purple-600 dark:hover:text-purple-400">Privacy Policy</a>
                <a href="#" className="hover:text-purple-600 dark:hover:text-purple-400">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </GlobalMouseEffect>
  );
}
