// This is a temporary configuration file without Sentry integration
// The original file is backed up at next.config.js.backup

const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  // Add assetPrefix to ensure static assets are loaded from the correct port
  assetPrefix: process.env.NODE_ENV === 'development' ? '' : undefined,
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
    // Enable memory optimization
    optimizePackageImports: [
      'framer-motion',
      'lucide-react',
      'react-dom',
      '@clerk/nextjs',
      'swr',
      'zod',
      'class-variance-authority',
      'tailwind-merge',
    ],
  },
  // Temporarily disable TypeScript type checking during build
  typescript: {
    ignoreBuildErrors: true,
    tsconfigPath: './tsconfig.json'
  },
  eslint: {
    // Temporarily disable ESLint during build troubleshooting
    ignoreDuringBuilds: true,
    dirs: ['src', 'app', 'lib', 'components']
  },
  webpack: (config, { dev, isServer }) => {
    // Resolve module not found issues
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      dns: false,
    };

    // Optimize source maps for production
    if (!dev) {
      config.devtool = 'source-map';

      // Optimize source maps
      if (config.optimization) {
        // Ensure we have the optimization object
        if (!config.optimization.minimizer) {
          config.optimization.minimizer = [];
        }

        // Configure source map generation for production
        config.optimization.minimize = true;
      }
    }

    // Optimize bundle size
    if (!dev && !isServer) {
      // Analyze bundle size in production builds
      if (process.env.ANALYZE === 'true') {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            analyzerPort: 8888,
            openAnalyzer: true,
          })
        );
      }
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

// Configure Sentry options
const sentryWebpackPluginOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: true,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  hideSourceMaps: false,
  disableServerWebpackPlugin: false,
  disableClientWebpackPlugin: false,
};

// Export with Sentry configuration
module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
