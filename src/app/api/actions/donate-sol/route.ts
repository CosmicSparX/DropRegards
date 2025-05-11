// This file now acts as a redirect to the dynamic username-based donation route
import { redirect } from 'next/navigation';
import { ACTIONS_CORS_HEADERS } from "@solana/actions";

// Set headers
const headers = {
  ...ACTIONS_CORS_HEADERS,
};

// OPTIONS endpoint is required for CORS preflight requests
export const OPTIONS = async () => {
  return new Response(null, { headers });
};

export const GET = async (req: Request) => {
  return new Response(JSON.stringify({
    error: "Please use a username-specific donation link",
    message: "This endpoint requires a username in the path: /api/actions/[username]/donate-sol"
  }), {
    status: 400,
    headers,
  });
};

export const POST = async (req: Request) => {
  return new Response(JSON.stringify({
    error: "Please use a username-specific donation link",
    message: "This endpoint requires a username in the path: /api/actions/[username]/donate-sol"
  }), {
    status: 400,
    headers,
  });
}; 