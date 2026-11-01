
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-033141748e464366b17fbaa620a59fec.r2.dev",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
