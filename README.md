# DropRegards - Solana Blink Donation App

This project demonstrates how to create a Solana Blink that allows users to donate SOL to a specified wallet address. It uses NextJS to combine both frontend and backend into a simple project.

## What are Blinks?

Blinks are chain-agnostic, shareable mini-applications that can execute transactions directly within crypto wallets and applications. They are designed to be simple, reusable, and easily integrated.

Blinks consist of two parts:

- **BlinkProvider**: Backend REST API (what we implement in this project)
- **BlinkClient**: Frontend components that render the blink in wallets and applications

## Features

- Predefined donation amounts (0.01, 0.05, 0.1 SOL)
- Custom donation amount option
- Works with any Blink-compatible wallet
- Uses Solana versioned transactions for maximum compatibility
- Runs on Solana devnet

## Technical Implementation

This blink demonstrates several important Solana concepts:

- Creating versioned transactions with TransactionMessage
- Using the Solana Web3.js library to interact with the blockchain
- Handling blockchain responses in a NextJS API route
- Proper error handling for blockchain transactions

## Getting Started

### Prerequisites

- Node.js 18.x or later
- A Solana wallet with devnet SOL

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd solana-blink-donation
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:

   ```
   npm run dev
   ```

4. Access the application at [http://localhost:3000](http://localhost:3000)

## Usage

1. Open the application in your browser
2. Access the blink at `http://localhost:3000/api/actions/donate-sol`
3. If you have a Blink-compatible wallet, you can interact directly with the blink
4. Select a donation amount or enter a custom amount
5. Approve the transaction in your wallet

## Project Structure

- `src/app/actions.json/route.ts` - The actions.json configuration for blink discovery
- `src/app/api/actions/donate-sol/route.ts` - The main blink provider implementation
- `public/donate-sol.jpg` - The blink icon image

## Customization

To customize the recipient address, modify the `donationWallet` constant in the `src/app/api/actions/donate-sol/route.ts` file.

## Learn More

- [Dialect Blinks Documentation](https://www.dialect.to/post/blinks-are-here)
- [Solana Web3.js Documentation](https://docs.solana.com/developing/clients/javascript-api)
- [NextJS Documentation](https://nextjs.org/docs)

## License

This project is MIT licensed.
