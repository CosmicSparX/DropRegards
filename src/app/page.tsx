export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-3xl font-bold">Solana Blink Donation App</h1>
        
        <div className="p-6 border border-gray-200 rounded-lg shadow-md w-full max-w-xl">
          <h2 className="text-xl font-semibold mb-4">About This Blink</h2>
          <p className="mb-4">
            This application demonstrates how to use Solana Blinks to create a simple donation feature.
            Users can donate various amounts of SOL to a specified wallet.
          </p>
          
          <h3 className="text-lg font-medium mb-2">How It Works</h3>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>The app provides a blink endpoint at <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-mono">/api/actions/donate-sol</code></li>
            <li>Users can select predefined donation amounts or enter a custom amount</li>
            <li>The transaction is created and sent to the user&apos;s wallet for approval</li>
            <li>Once approved, the SOL is transferred to the donation address</li>
          </ol>
          
          <h3 className="text-lg font-medium mb-2">Try It Out</h3>
          <p>
            Use a Blink-compatible wallet to interact with this demo. You can access the blink at:
          </p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2 overflow-x-auto">
            {typeof window !== 'undefined' ? `${window.location.origin}/api/actions/donate-sol` : 'Loading...'}
          </pre>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/api/actions/donate-sol"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Blink Endpoint
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
            href="https://www.dialect.to/post/blinks-are-here"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn More About Blinks
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://solana.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Solana
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.dialect.to"
          target="_blank"
          rel="noopener noreferrer"
        >
          Dialect Labs
        </a>
      </footer>
    </div>
  );
}
