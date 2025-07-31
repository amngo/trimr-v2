import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/:slug",
        destination: "http://localhost:8080/:slug",
      },
    ];
  },
};

export default nextConfig;
