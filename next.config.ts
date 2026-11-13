import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      // The Diwali offer became the season-long festive offer. Keep shared
      // links (and any ?utm_* tags on them) working.
      { source: "/offer/diwali-yoga", destination: "/offer/festive-yoga", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aofcqupyahbyybpdizzw.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // YouTube poster frames for the click-to-play video facade.
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
};

export default nextConfig;
