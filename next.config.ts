import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standalone output for optimized Docker builds
  // This reduces the Docker image size significantly
  output: "standalone",
};

export default nextConfig;
