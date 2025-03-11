// This is a temporary configuration file without Sentry integration
// The original file is backed up at next.config.js.backup

const crypto = require('crypto');

/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  swcMinify: true,
  // Add assetPrefix to ensure static assets are loaded from the correct port
  assetPrefix: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : undefined,
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'localhost:3001',
        'localhost:3002',
        'localhost:3003',
        'localhost:3004',
        'localhost:3005',
        'localhost:3006',
        'localhost:3007',
        'localhost:3008',
        'localhost:3009',
        'localhost:3010',
      ],
    },
    // Enable optimizeCss for production builds
    optimizeCss: true,
    // Enable scroll restoration
    scrollRestoration: true,
    // Enable memory optimization but exclude problematic packages
    optimizePackageImports: [
      'framer-motion',
      'lucide-react',
      'react-dom',
      'zod',
      'class-variance-authority',
      'tailwind-merge',
    ],
  },
  // Ignore TypeScript and ESLint errors in production builds
  typescript: { ignoreBuildErrors: true },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Prevent timeouts during static generation
  staticPageGenerationTimeout: 180,

  webpack: (config, { dev, isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        dns: false,
        tls: false,
        perf_hooks: false,
        '@opentelemetry/api': false,
      };

      // Disable barrel optimization for specific modules
      config.module = {
        ...config.module,
        rules: [
          ...config.module.rules,
          {
            test: /node_modules\/@clerk\/.*\.js$/,
            sideEffects: false,
          },
          {
            test: /node_modules\/swr\/.*\.js$/,
            sideEffects: false,
          },
        ],
      };

      // Configure chunk loading for development
      if (dev) {
        config.output = {
          ...config.output,
          chunkFilename: '[name].js',
          publicPath: 'http://localhost:3000/_next/',
        };
      }

      // Basic optimization settings
      config.optimization = {
        ...config.optimization,
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            default: false,
            vendors: false,
            commons: {
              name: 'commons',
              chunks: 'all',
              minChunks: 2,
              reuseExistingChunk: true,
            },
            shared: {
              name: false,
              chunks: 'all',
              minChunks: 2,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    if (isServer) {
      console.log('Server-side environment variables:', {
        NEXT_PUBLIC_CLERK_FRONTEND_API: process.env.NEXT_PUBLIC_CLERK_FRONTEND_API,
      });
    } else {
      console.log('Client-side environment variables:', {
        NEXT_PUBLIC_CLERK_FRONTEND_API: process.env.NEXT_PUBLIC_CLERK_FRONTEND_API,
      });
    }

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Configure headers for better security and caching
  headers() {
    return [
      {
        source: '/(.*)',
        headers: [
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
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
      {
        source: '/_next/static/media/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=31536000',
          },
        ],
      },
    ];
  },
};

nextConfig.env = {
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  NEXT_PUBLIC_CLERK_FRONTEND_API: process.env.NEXT_PUBLIC_CLERK_FRONTEND_API,
};

// Export the config without Sentry
module.exports = nextConfig;
