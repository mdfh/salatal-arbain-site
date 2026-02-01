import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  // required for next/image on static export
  images: {
    unoptimized: true,
  },

  // helps routing on Firebase + direct refresh
  trailingSlash: true,
};

export default nextConfig;
