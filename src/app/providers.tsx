"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import dynamic from "next/dynamic";

// Dynamically import WalletProvider to prevent SSR issues
const WalletProviderWithNoSSR = dynamic(
  () => import("./providers/WalletProvider"),
  { ssr: false }
);

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class">
      <WalletProviderWithNoSSR>
        {children}
      </WalletProviderWithNoSSR>
    </ThemeProvider>
  );
} 