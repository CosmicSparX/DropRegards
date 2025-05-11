import {
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  BLOCKCHAIN_IDS,
} from "@solana/actions";

import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";

// For database integration
import axios from "axios";

// CAIP-2 format for Solana
const blockchain = BLOCKCHAIN_IDS.devnet;

// Create a connection to the Solana blockchain
const connection = new Connection("https://api.devnet.solana.com");

// Create headers with CAIP blockchain ID
const headers = {
  ...ACTIONS_CORS_HEADERS,
  "x-blockchain-ids": blockchain,
  "x-action-version": "2.4",
};

// OPTIONS endpoint is required for CORS preflight requests
export const OPTIONS = async () => {
  return new Response(null, { headers });
};

// Helper to get user details (using dummy data for now)
async function getUserDetails(username: string) {
  // Define the user interface type
  interface UserData {
    username: string;
    displayName: string;
    bio: string;
    profileImage: string;
    walletAddress: string;
  }

  // Dummy user data for testing
  const dummyUsers: Record<string, UserData> = {
    "alice": {
      username: "alice",
      displayName: "Alice Wonderland",
      bio: "Crypto enthusiast and NFT collector",
      profileImage: "https://ui-avatars.com/api/?name=AW&background=6f42c1&color=ffffff&size=256&bold=true",
      walletAddress: "BijikHHEuzpQJG5CZn5FW5ewfuUbGJNzABCRUQfnSZjY"
    },
    "bob": {
      username: "bob",
      displayName: "Bob Builder",
      bio: "Building on Solana since 2021",
      profileImage: "https://ui-avatars.com/api/?name=BB&background=2a9d8f&color=ffffff&size=256&bold=true",
      walletAddress: "BijikHHEuzpQJG5CZn5FW5ewfuUbGJNzABCRUQfnSZjY"
    },
    "charlie": {
      username: "charlie",
      displayName: "Charlie Web3",
      bio: "DeFi degen and Solana developer",
      profileImage: "https://ui-avatars.com/api/?name=CW&background=e76f51&color=ffffff&size=256&bold=true",
      walletAddress: "BijikHHEuzpQJG5CZn5FW5ewfuUbGJNzABCRUQfnSZjY"
    }
  };

  // Slight delay to simulate network request
  await new Promise(resolve => setTimeout(resolve, 300));

  // Return user if found or create a new one with basic details
  return dummyUsers[username.toLowerCase()] || {
    username: username,
    displayName: username.charAt(0).toUpperCase() + username.slice(1),
    bio: "DropRegards user",
    profileImage: `https://ui-avatars.com/api/?name=${username.substring(0, 2).toUpperCase()}&background=8a5cf6&color=ffffff&size=256&bold=true`,
    walletAddress: "BijikHHEuzpQJG5CZn5FW5ewfuUbGJNzABCRUQfnSZjY"
  };
}

// GET endpoint returns the Blink metadata (JSON) and UI configuration
export const GET = async (req: Request, { params }: { params: { username: string } }) => {
  try {
    // Extract username from route params
    const { username } = params;
    
    // Get user details from database
    const user = await getUserDetails(username);
    
    // If user doesn't exist, return error
    if (!user) {
      return new Response(
        JSON.stringify({ 
          error: "User not found",
          message: `No user found with username: ${username}` 
        }),
        { status: 404, headers }
      );
    }

    // This JSON is used to render the Blink UI
    const response: ActionGetResponse = {
      type: "action",
      icon: user.profileImage || `${new URL("/donate-sol.jpg", req.url).toString()}`,
      label: "Send SOL",
      title: `DropRegards to ${user.displayName}`,
      description: `Send SOL to ${user.displayName} as a token of your regard.`,
      // Links is used if you have multiple actions or if you need more than one params
      links: {
        actions: [
          {
            // Defines this as a blockchain transaction
            type: "transaction",
            label: "0.01 SOL",
            // This is the endpoint for the POST request with username in path
            href: `/api/actions/${username}/donate-sol?amount=0.01`,
          },
          {
            type: "transaction",
            label: "0.05 SOL",
            href: `/api/actions/${username}/donate-sol?amount=0.05`,
          },
          {
            type: "transaction",
            label: "0.1 SOL",
            href: `/api/actions/${username}/donate-sol?amount=0.1`,
          },
          {
            // Example for a custom input field
            type: "transaction",
            href: `/api/actions/${username}/donate-sol?amount={amount}`,
            label: "Custom",
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
  } catch (error) {
    console.error("Error in GET handler:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500, headers }
    );
  }
};

// POST endpoint handles the actual transaction creation
export const POST = async (req: Request, { params }: { params: { username: string } }) => {
  try {
    // Extract username from route params
    const { username } = params;
    
    // Get user details from database
    const user = await getUserDetails(username);
    
    // If user doesn't exist, return error
    if (!user || !user.walletAddress) {
      return new Response(
        JSON.stringify({ 
          error: "User not found or has no wallet address",
          message: `Cannot process donation for user: ${username}` 
        }),
        { status: 404, headers }
      );
    }

    // Step 1: Extract parameters from the URL
    const url = new URL(req.url);

    // Amount of SOL to transfer is passed in the URL
    const amount = Number(url.searchParams.get("amount"));

    // Payer public key is passed in the request body
    const request: ActionPostRequest = await req.json();
    const payer = new PublicKey(request.account);

    // Receiver is the user's wallet address
    const receiver = new PublicKey(user.walletAddress);

    // Step 2: Prepare the transaction
    const transaction = await prepareTransaction(
      connection,
      payer,
      receiver,
      amount
    );

    // Step 3: Create a response with the serialized transaction
    const response: ActionPostResponse = {
      type: "transaction",
      transaction: Buffer.from(transaction.serialize()).toString("base64"),
    };

    // Return the response with proper headers
    return Response.json(response, { status: 200, headers });
  } catch (error) {
    // Log and return an error response
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers,
    });
  }
};

const prepareTransaction = async (
  connection: Connection,
  payer: PublicKey,
  receiver: PublicKey,
  amount: number
) => {
  // Create a transfer instruction
  const instruction = SystemProgram.transfer({
    fromPubkey: payer,
    toPubkey: receiver,
    lamports: amount * LAMPORTS_PER_SOL,
  });

  // Get the latest blockhash
  const { blockhash } = await connection.getLatestBlockhash();

  // Create a transaction message
  const message = new TransactionMessage({
    payerKey: payer,
    recentBlockhash: blockhash,
    instructions: [instruction],
  }).compileToV0Message();

  // Create and return a versioned transaction
  return new VersionedTransaction(message);
}; 