// This file sets up the Next.js configuration with Sentry integration
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
  typescript: {
    // Ignore type errors during build (we'll handle them separately)
    ignoreBuildErrors: false,
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
            value:
              'camera=(), microphone=(), geolocation=(), interest-cohort=()',
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

// For all available options, see:
// https://github.com/getsentry/sentry-webpack-plugin#options
const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  // Sentry organization and project
  org: 'davini',
  project: 'javascript-nextjs',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Automatically annotate React components to show their full name in breadcrumbs and session replay
  reactComponentAnnotation: {
    enabled: true,
  },

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  tunnelRoute: '/monitoring',

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors
  automaticVercelMonitors: true,
  
  // Enhanced source map handling
  sourcemaps: {
    assets: './**/*.map',
    filesToDeleteAfterUpload: './**/*.map',
  },
  
  // Set to true to validate the upload of source maps
  validate: true,
  
  // Set to true to enable debug mode
  debug: false,
};

// Make sure adding Sentry options is the last code to run before exporting
module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
