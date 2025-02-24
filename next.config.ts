import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  env: {
    GIT_TAG: process.env.GIT_TAG || "development",
  },
  images: {
    unoptimized: true,
  },

  pageExtensions: ["ts", "tsx", "js", "jsx"],
};

export default nextConfig;
