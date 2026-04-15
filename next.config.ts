import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

  async rewrites() {
    return [
      {
        source: "/sample",
        destination: "https://helplaw-nextjs-old.vercel.app",
      },
      {
        source: "/sample/:path*",
        destination: "https://helplaw-nextjs-old.vercel.app/:path*",
      },
    ];
  },
};

export default nextConfig;