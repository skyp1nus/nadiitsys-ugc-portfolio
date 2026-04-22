import type { NextConfig } from "next";

const r2Base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
const r2Hostname = r2Base ? new URL(r2Base).hostname : "placeholder.invalid";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: r2Hostname,
      },
      {
        protocol: "https",
        hostname: "*.cdninstagram.com",
      },
    ],
  },
};

export default nextConfig;
