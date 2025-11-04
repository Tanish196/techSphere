import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Server external packages
  serverExternalPackages: ['mongoose'],
  
  // Experimental features (if any)
  experimental: {
    // Add any valid experimental features here
  },
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
      }
    ]
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST
  },
  
  // Enable standalone output for deployment
  output: 'standalone',
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't include Node.js modules in client-side bundles
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
      };
    }
    return config;
  },
  
  // PostHog rewrites
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  
  // Required for PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

export default nextConfig;