'use client';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { ReactNode, useMemo } from 'react';

// Import the wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';

export function WalletProviders({ children }: { children: ReactNode }) {
  // Define the network to use (devnet, testnet, or mainnet-beta)
  const network = WalletAdapterNetwork.Devnet;

  // Define the RPC endpoint URL based on the network
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Initialize the wallet adapters
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    // Dependency array includes network to re-initialize wallets if network changes
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
} 