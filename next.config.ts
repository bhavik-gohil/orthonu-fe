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
    ],
  },
};

export default nextConfig;
