import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keeps Next.js from generating agent instruction files during local dev.
  agentRules: false,
};

export default nextConfig;
