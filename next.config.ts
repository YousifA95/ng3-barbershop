import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // NOTE: put origins as hostnames (no http:// and typically no port)
  allowedDevOrigins: [
    "10.0.0.113",
    "localhost",
  ],
};

export default nextConfig;
