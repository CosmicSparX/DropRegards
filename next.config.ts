import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: "/Actions.json",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type" },
          { key: "X-Action-Version", value: "2.4" },
          { key: "X-Blockchain-Ids", value: "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1" },
        ],
      },
      {
        source: "/api/donate",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type" },
          { key: "X-Action-Version", value: "2.4" },
          { key: "X-Blockchain-Ids", value: "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1" },
        ],
      },
    ];
  },
};

export default nextConfig;
