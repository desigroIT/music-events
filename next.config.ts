import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed "output: export" to support dynamic routes and authentication
  // Static export doesn't work with Firebase Auth and dynamic course pages
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
