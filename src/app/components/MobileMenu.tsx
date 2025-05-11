'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  // Close menu when escape key is pressed
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent scrolling when menu is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      // Restore scrolling when menu is closed
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <div 
      style={{ position: 'fixed', left: 0, top: 0, right: 0, bottom: 0, zIndex: 50 }}
      className={`bg-white dark:bg-gray-900 flex flex-col items-center justify-center transition-all duration-300 ease-in-out ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Close button */}
      <button 
        className="absolute top-6 right-6 text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400"
        onClick={onClose}
        aria-label="Close menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      {/* Logo */}
      <div className="mb-12">
        <Link 
          href="/" 
          className="font-bold text-3xl inline-block"
          onClick={onClose}
        >
          <span className="gradient-text">DropRegards</span>
        </Link>
      </div>
      
      {/* Nav links */}
      <nav className="flex flex-col items-center space-y-6 mb-12">
        <a 
          href="#how-it-works" 
          className="mobile-menu-item" 
          onClick={onClose}
        >
          How It Works
        </a>
        <a 
          href="#features" 
          className="mobile-menu-item" 
          onClick={onClose}
        >
          Features
        </a>
        <Link 
          href="/dashboard" 
          className="mobile-menu-item" 
          onClick={onClose}
        >
          Dashboard
        </Link>
      </nav>
      
      {/* CTA button */}
      <div className="mt-auto">
        <Link 
          href="/create" 
          className="btn text-lg px-8 py-4 min-w-[200px] h-auto" 
          onClick={onClose}
        >
          Get Started
        </Link>
      </div>
      
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-purple-500/5 to-transparent -z-10"></div>
      <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-blue-400/10 rounded-full filter blur-3xl -z-10"></div>
      <div className="absolute top-1/3 right-1/4 w-60 h-60 bg-purple-400/10 rounded-full filter blur-3xl -z-10"></div>
    </div>
  );
} 