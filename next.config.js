// This is a temporary configuration file without Sentry integration
// The original file is backed up at next.config.js.backup

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
  // Ignore TypeScript and ESLint errors in production builds
  typescript: { ignoreBuildErrors: true },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Prevent timeouts during static generation
  staticPageGenerationTimeout: 180,

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
      // const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      if (process.env.ANALYZE === 'true') {
        import('webpack-bundle-analyzer').then(({ BundleAnalyzerPlugin }) => {
          console.log('Bundle analyzer is running...');
          config.plugins.push(
            new BundleAnalyzerPlugin({
              analyzerMode: 'server',
              analyzerPort: 8888,
              openAnalyzer: true,
            })
          );
        });
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

nextConfig.env = {
  KV_REST_API_URL: process.env.KV_REST_API_URL,
  KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN,
};

// Export the config without Sentry
module.exports = nextConfig;
