// This is a temporary configuration file without Sentry integration
// The original file is backed up at next.config.js.backup

const crypto = require('crypto');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
  env: {
    NEXT_PUBLIC_CLERK_FRONTEND_API: process.env.NEXT_PUBLIC_CLERK_FRONTEND_API,
  },
  // Configure static page generation
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  trailingSlash: false,
  poweredByHeader: false,
  reactStrictMode: true,
  // Disable automatic static optimization for auth pages
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/admin/:path*',
          destination: '/admin/:path*',
          has: [
            {
              type: 'header',
              key: 'x-clerk-auth-token',
            },
          ],
        },
        {
          source: '/dashboard/:path*',
          destination: '/dashboard/:path*',
          has: [
            {
              type: 'header',
              key: 'x-clerk-auth-token',
            },
          ],
        },
        {
          source: '/story/:path*',
          destination: '/story/:path*',
          has: [
            {
              type: 'header',
              key: 'x-clerk-auth-token',
            },
          ],
        },
      ],
    };
  },
  // Configure headers for better security and caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
