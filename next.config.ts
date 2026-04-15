import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/sample",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kmgttaqztmsbbaethbko.supabase.co",
      },
      {
        protocol: "https",
        hostname: "image2url.com",
      },
      {
        protocol: "https",
        hostname: "img.sanishtech.com",
      },
      {
        protocol: "https",
        hostname: "cdn.phototourl.com",
      },
    ],
  },
};

export default nextConfig;
