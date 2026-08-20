import type { NextConfig } from "next";

// Cloudflare Turnstile loads a script + renders an iframe + calls its own endpoints.
const CF_TURNSTILE = "https://challenges.cloudflare.com";
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${CF_TURNSTILE}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  `connect-src 'self' ${CF_TURNSTILE}`,
  `frame-src ${CF_TURNSTILE}`,
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  async headers() {
    const base = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "no-referrer" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
      { key: "Content-Security-Policy", value: CSP },
    ];
    const noStore = [{ key: "Cache-Control", value: "private, no-store" }];
    return [
      { source: "/:path*", headers: base },
      { source: "/result/:path*", headers: noStore },
      { source: "/r", headers: noStore },
      { source: "/assessment", headers: noStore },
    ];
  },
};

export default nextConfig;
