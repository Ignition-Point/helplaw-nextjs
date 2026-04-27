import type { NextConfig } from "next";

// Security headers — addresses Screaming Frog warnings:
//   - Missing X-Content-Type-Options Header
//   - Missing X-Frame-Options Header
//   - Missing Secure Referrer-Policy Header
//   - Missing Content-Security-Policy Header
//
// Applied via the headers() function below to every route.
const securityHeaders = [
  {
    // Prevents MIME-type sniffing attacks. Always-on, no downside.
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Prevents the site from being embedded in iframes on other domains
    // (clickjacking protection). SAMEORIGIN allows internal previews.
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    // Sends the full URL as referrer to same-origin requests, but only
    // the origin (not path) to cross-origin requests. Standard SEO-safe choice.
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // Limits Permissions-Policy / Feature-Policy. We don't use these features.
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    // Forces HTTPS for 2 years across all subdomains. Vercel already enforces
    // HTTPS but this header tells browsers to remember it.
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    // Content Security Policy — restricts where scripts, images, and fonts
    // can come from. The `unsafe-inline` for scripts is needed for Next.js's
    // hydration data; `unsafe-eval` is needed in dev. The directives below
    // cover Vercel Analytics, Supabase image hosting, and the image hosts
    // we whitelist for hero backgrounds.
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https://kmgttaqztmsbbaethbko.supabase.co https://image2url.com https://img.sanishtech.com https://cdn.phototourl.com https://*.googleusercontent.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://kmgttaqztmsbbaethbko.supabase.co https://va.vercel-scripts.com",
      "media-src 'self'",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Modern image formats — Next.js will serve AVIF first, then WebP, then
  // fall back to original. Cuts image payloads ~30-50% over WebP alone.
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000, // 1 year — images are immutable per their hash
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

  async headers() {
    return [
      {
        // Apply security headers to every route. Static assets handled by Vercel
        // separately, but this covers all rendered pages.
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
