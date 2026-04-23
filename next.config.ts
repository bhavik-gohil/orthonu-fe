import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.orthonu.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'newtestapi.orthonu.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.orthonu.com', // Added for your PROD environment
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
