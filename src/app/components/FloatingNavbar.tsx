'use client';

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import MobileMenu from "./MobileMenu";

export default function FloatingNavbar() {
  const [showNavbar, setShowNavbar] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  
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

    const handleMouseMove = (e: MouseEvent) => {
      if (!navbarRef.current) return;
      
      const rect = navbarRef.current.getBoundingClientRect();
      
      // Check if mouse is inside navbar
      const isInside = 
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      
      setIsHovering(isInside);
      
      if (isInside) {
        // Calculate position relative to container
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };
    
    // Smooth animation for mouse movement
    const animateGlow = () => {
      if (!glowRef.current || !isHovering) return;
      
      // Get current position
      const currentLeft = parseFloat(glowRef.current.style.left || '0');
      const currentTop = parseFloat(glowRef.current.style.top || '0');
      
      // Calculate the distance
      const dx = mousePosition.x - currentLeft;
      const dy = mousePosition.y - currentTop;
      
      // Smooth follow with easing
      const newLeft = currentLeft + dx * 0.2;
      const newTop = currentTop + dy * 0.2;
      
      // Apply new position
      glowRef.current.style.left = `${newLeft}px`;
      glowRef.current.style.top = `${newTop}px`;
      
      // Request next frame
      requestAnimationFrame(animateGlow);
    };
    
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Start the animation loop
    const animationId = requestAnimationFrame(animateGlow);
    
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", checkMobile);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", checkMobile);
      cancelAnimationFrame(animationId);
    };
  }, [mousePosition, isHovering]);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    <>
      <div 
        ref={navbarRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 pointer-events-auto ${
          showNavbar 
            ? "opacity-100 transform-none" 
            : "opacity-0 -translate-y-full pointer-events-none absolute"
        }`}
      >
        <div className="relative backdrop-blur-xl border-gradient overflow-hidden">
          {/* Mouse follower - only show on desktop */}
          <div 
            ref={glowRef}
            className={`pointer-events-none absolute blur-2xl rounded-full transition-opacity duration-300 mouse-effect-only ${
              isHovering ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ 
              left: `${mousePosition.x}px`, 
              top: `${mousePosition.y}px`,
              width: '180px',
              height: '180px',
              background: 'radial-gradient(circle, rgba(79, 156, 255, 0.3) 0%, rgba(56, 128, 255, 0.1) 40%, transparent 70%)',
              transform: 'translate(-50%, -50%)',
            }}
          />
          
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute h-1.5 w-1.5 rounded-full bg-blue-400/30 animate-float top-3 left-[10%]"></div>
            <div className="absolute h-2 w-2 rounded-full bg-purple-400/20 animate-float delay-200 top-6 left-[35%]"></div>
            <div className="absolute h-1 w-1 rounded-full bg-blue-500/30 animate-float delay-500 top-5 right-[22%]"></div>
            <div className="absolute h-1.5 w-1.5 rounded-full bg-indigo-400/20 animate-float delay-300 top-8 right-[10%]"></div>
          </div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-blue-500/60 to-transparent blur-sm"></div>
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-blue-400/20 via-blue-500/40 to-blue-400/20"></div>
          </div>
          
          {/* Glass overlay */}
          <div className="absolute inset-0 bg-white/5 dark:bg-blue-950/10"></div>
          
          <div className="container py-3 md:py-4 flex justify-between items-center relative">
            <Link 
              href="/" 
              className="group font-bold text-xl md:text-2xl hover:scale-105 transition-transform duration-300" 
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <span className="gradient-text">DropRegards</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              {/* Desktop navigation */}
              <div className="hidden md:flex space-x-6 mr-4">
                <a 
                  href="#how-it-works" 
                  className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors relative group"
                >
                  How It Works
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-400 group-hover:w-full transition-all duration-300"></span>
                </a>
                <a 
                  href="#features" 
                  className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors relative group"
                >
                  Features
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-400 group-hover:w-full transition-all duration-300"></span>
                </a>
              </div>
              
              {/* Get Started button */}
              <Link 
                href="/create" 
                className="hidden md:flex btn text-sm md:text-base px-4 md:px-6 py-2 min-w-[140px] h-auto shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-pulse-shadow"
              >
                <span className="relative z-10">Get Started</span>
              </Link>
              
              {/* Mobile Menu Button - only show on mobile */}
              <button 
                className="md:hidden flex items-center justify-center p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={toggleMobileMenu}
                aria-label="Open menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
} 