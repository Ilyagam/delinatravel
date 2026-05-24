import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      // REASON: фото туров, загруженные в CRM, отдаются с домена CRM (см. absMediaUrl в lib/tours.ts)
      { protocol: "https", hostname: "crm.flick-soft.tech" },
    ],
  },
};

export default nextConfig;
