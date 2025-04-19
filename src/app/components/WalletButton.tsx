'use client';

import { useState, useEffect, CSSProperties } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

export default function WalletButton() {
  const { connected } = useWallet();
  const [mounted, setMounted] = useState(false);

  // Wait until mounted to render wallet button to avoid hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use custom style to hide the default wallet button but keep its functionality
  const walletButtonStyle: CSSProperties = {
    position: 'fixed',
    visibility: 'hidden',
    pointerEvents: 'none',
    opacity: 0,
    height: 0,
    width: 0,
    overflow: 'hidden',
  };

  const handleWalletClick = () => {
    // Find and click the hidden wallet button
    const walletButtonElement = document.querySelector('.wallet-adapter-button-trigger');
    if (walletButtonElement) {
      walletButtonElement.dispatchEvent(new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        buttons: 1
      }));
    }
  };

  // Only render the component client-side to avoid hydration errors
  if (!mounted) return null;

  return (
    <>
      {/* Hidden wallet button with actual functionality */}
      <div style={walletButtonStyle}>
        <WalletMultiButton />
      </div>
      
      {/* Custom styled button that matches the original design */}
      <button
        onClick={handleWalletClick}
        className="btn-secondary text-base md:text-lg px-6 py-3 md:px-8 md:py-4 min-w-0 w-full md:min-w-[200px] md:w-auto h-auto shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center"
      >
        <svg 
          className="w-5 h-5 mr-2" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
          />
        </svg>
        Select Wallet
      </button>
    </>
  );
} 