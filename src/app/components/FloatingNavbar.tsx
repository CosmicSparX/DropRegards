'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

export default function FloatingNavbar() {
  const [showNavbar, setShowNavbar] = useState(false);
  
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar when scrolling up or when scrolled down more than 200px
      if (currentScrollY > 200 && (currentScrollY < lastScrollY || currentScrollY > 600)) {
        setShowNavbar(true);
      } else if (currentScrollY < 100) {
        setShowNavbar(false);
      }
      
      lastScrollY = currentScrollY;
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      showNavbar 
        ? "opacity-100 transform-none animate-slideDown" 
        : "opacity-0 -translate-y-full pointer-events-none"
    }`}>
      <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-gradient">
        {/* Glow effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent blur-sm"></div>
        </div>
        
        <div className="container py-3 md:py-4 flex justify-between items-center">
          <Link 
            href="/" 
            className="group font-bold text-xl md:text-2xl hover:scale-105 transition-transform duration-300" 
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <span className="gradient-text">DropRegards</span>
          </Link>
          
          <div className="flex items-center">
            <Link 
              href="/create" 
              className="btn text-sm md:text-base px-4 md:px-6 py-2 min-w-[140px] h-auto shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-pulse-shadow"
            >
              <span className="relative z-10">Get Started</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 