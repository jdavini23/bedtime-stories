/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: { bodySizeLimit: '2mb' },
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  // Exclude MCP directories from the build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore type errors during build (we'll handle them separately)
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
