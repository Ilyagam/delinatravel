"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// REASON: Client component that fires on every page navigation.
// Skips admin pages. Never throws — analytics shouldn't break the site.
export default function SiteAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    const device =
      window.innerWidth < 768
        ? "mobile"
        : window.innerWidth < 1024
        ? "tablet"
        : "desktop";

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page: pathname,
        referrer: document.referrer || null,
        device,
      }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
