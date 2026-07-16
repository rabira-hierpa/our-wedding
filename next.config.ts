import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
    // Keep unoptimized for Docker/standalone; gallery thumbs use /api/uploads?w=
    unoptimized: true,
  },
};

export default nextConfig;
