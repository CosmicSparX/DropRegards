import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { WalletProviders } from "./providers";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: '--font-inter',
  display: 'swap' 
});

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: '--font-poppins',
  display: 'swap'
});

export const metadata: Metadata = {
  title: "DropRegards | Send SOL with a Personal Touch",
  description: "Send SOL tokens with personal messages and custom NFTs to show appreciation to others.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                const savedTheme = localStorage.getItem('theme') || 'system';
                const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                
                if (savedTheme === 'dark' || (savedTheme === 'system' && systemDarkMode)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {
                console.error('Error setting theme:', e);
              }
            })();
          `
        }} />
      </head>
      <body className="font-sans antialiased text-slate-800 dark:text-slate-200 min-h-screen flex flex-col">
        <WalletProviders>
          {children}
        </WalletProviders>
      </body>
    </html>
  );
}
