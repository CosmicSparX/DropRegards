import { ACTIONS_CORS_HEADERS, ActionsJson } from "@solana/actions";

export const GET = async () => {
  const payload: ActionsJson = {
    rules: [
      // Map all root level routes to an action
      {
        pathPattern: "/",
        apiPath: "/api/donate/",
      },
    ],
  };

  return new Response(JSON.stringify(payload), {
    headers: {
        ...ACTIONS_CORS_HEADERS,
        "X-Action-Version": "2.1.3",
        "X-Blockchain-Ids": "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1",
      },
  });
};

// DO NOT FORGET TO INCLUDE THE `OPTIONS` HTTP METHOD
// THIS WILL ENSURE CORS WORKS FOR BLINKS
export const OPTIONS = GET;