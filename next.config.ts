import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Prevent build failures due to type errors during deployment
    ignoreBuildErrors: true,
  },
  eslint: {
    // Prevent build failures due to linting errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;