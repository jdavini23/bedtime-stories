// This file sets up the Next.js configuration with Sentry integration
const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
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
  },
  webpack: (config, { isServer }) => {
    // Resolve module not found issues
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    };

    // Explicitly resolve framer-motion
    config.resolve.alias = {
      ...config.resolve.alias,
      'framer-motion': 'framer-motion',
    };

    // Improve module resolution
    config.resolve.extensions.push('.ts', '.tsx', '.js', '.jsx');

    // Handle potential ESM module issues
    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });

    // Add rule for SVG files
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack', 'url-loader'],
    });

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  typescript: {
    // Ignore type errors during build (we'll handle them separately)
    ignoreBuildErrors: true,
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
};

// Make sure adding Sentry options is the last code to run before exporting
module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
