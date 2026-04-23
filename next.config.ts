import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3100',
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
