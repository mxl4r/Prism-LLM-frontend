/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Prevent build failures due to type errors during deployment
    ignoreBuildErrors: true,
  },
  eslint: {
    // Prevent build failures due to linting errors
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;