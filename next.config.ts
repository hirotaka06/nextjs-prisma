import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        fs: false,
        os: false,
        path: false,
        querystring: false,
        stream: false,
      },
    };
    return config;
  },
};

export default nextConfig;
