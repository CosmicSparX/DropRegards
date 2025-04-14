import {
  ActionGetResponse,
  ACTIONS_CORS_HEADERS,
  BLOCKCHAIN_IDS,
} from "@solana/actions";
import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

// CAIP-2 format for Solana
const blockchain = BLOCKCHAIN_IDS.devnet;

// Set standardized headers for Blink Providers
const headers = {
  ...ACTIONS_CORS_HEADERS,
  "x-blockchain-ids": blockchain,
  "x-action-version": "2.4",
};

// OPTIONS endpoint is required for CORS preflight requests
// Your Blink won't render if you don't add this
export const OPTIONS = async () => {
  return new Response(null, { headers });
};

// GET endpoint returns the Blink metadata (JSON) and UI configuration
export const GET = async (req: Request) => {
  // This JSON is used to render the Blink UI
  const response: ActionGetResponse = {
    type: "action",
    icon: `${new URL("/donate-sol.jpg", req.url).toString()}`,
    label: "1 SOL",
    title: "Donate SOL",
    description:
      "This Blink demonstrates how to donate SOL on the Solana blockchain. It is a part of the official Blink Starter Guides by Dialect Labs.",
    // Links is used if you have multiple actions or if you need more than one params
    links: {
      actions: [
        {
          // Defines this as a blockchain transaction
          type: "transaction",
          label: "0.01 SOL",
          // This is the endpoint for the POST request
          href: `/api/actions/donate-sol?amount=0.01`,
        },
        {
          type: "transaction",
          label: "0.05 SOL",
          href: `/api/actions/donate-sol?amount=0.05`,
        },
        {
          type: "transaction",
          label: "0.1 SOL",
          href: `/api/actions/donate-sol?amount=0.1`,
        },
        {
          // Example for a custom input field
          type: "transaction",
          href: `/api/actions/donate-sol?amount={amount}`,
          label: "Donate",
          parameters: [
            {
              name: "amount",
              label: "Enter a custom SOL amount",
              type: "number",
            },
          ],
        },
      ],
    },
  };

  // Return the response with proper headers
  return new Response(JSON.stringify(response), {
    status: 200,
    headers,
  });
};

// POST endpoint that handles the actual transaction creation
export const POST = async (req: Request) => {
  try {
    // Get URL parameters
    const url = new URL(req.url);
    const amount = url.searchParams.get("amount");
    
    if (!amount || isNaN(Number(amount))) {
      return new Response(
        JSON.stringify({ error: "Invalid amount parameter" }),
        {
          status: 400,
          headers,
        }
      );
    }

    // Convert SOL amount to lamports (1 SOL = 1,000,000,000 lamports)
    const lamports = Math.floor(Number(amount) * 1_000_000_000);
    
    // Hardcoded recipient address - replace with your donation address
    const recipientAddress = new PublicKey("BijikHHEuzpQJG5CZn5FW5ewfuUbGJNzABCRUQfnSZjY");
    
    // Create a new transaction
    const transaction = new Transaction();
    
    // Add instruction to transfer SOL
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey("11111111111111111111111111111111"), // This is a placeholder, will be replaced by the wallet
        toPubkey: recipientAddress,
        lamports,
      })
    );

    // Return the serialized transaction for the wallet to sign
    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    });

    return new Response(
      JSON.stringify({
        transaction: Buffer.from(serializedTransaction).toString("base64"),
      }),
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {
    console.error("Error creating transaction:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create transaction" }),
      {
        status: 500,
        headers,
      }
    );
  }
}; 