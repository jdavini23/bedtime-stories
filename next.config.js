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
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
