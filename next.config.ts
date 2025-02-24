import type { NextConfig } from "next";
import * as packageJson from "./package.json";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  env: {
    APP_VERSION: packageJson.version,
  },
  images: {
    unoptimized: true,
  },

  pageExtensions: ["ts", "tsx", "js", "jsx"],
};

export default nextConfig;
