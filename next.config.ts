import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack },
  ) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb", // or '50mb' or whatever size you need
    },
  },
  async rewrites() {
    return [
      {
        source: "/api/google/:path*",
        destination: "https://maps.googleapis.com/maps/api/place/:path*",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "pub-8e718d4717894c2d8394aa3ab82551f4.r2.dev",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // ... any other existing config
};

export default nextConfig;
