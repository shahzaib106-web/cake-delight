import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the sandbox live-preview host to reach the dev server
  allowedDevOrigins: ["*.e2b.app"],
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
