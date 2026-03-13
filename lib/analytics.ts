import { createServiceClient } from "./supabase";

export interface AnalyticsStats {
  viewsToday: number;
  views7d: number;
  views30d: number;
  uniqueVisitors7d: number;
  uniqueVisitors30d: number;
  applications7d: number;
  applications30d: number;
  conversionRate: number; // applications30d / uniqueVisitors30d * 100
  dailyChart: { date: string; views: number; unique: number }[];
  topPages: { page: string; views: number }[];
  topReferrers: { referrer: string; views: number }[];
  deviceBreakdown: { device: string; views: number }[];
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function todayStart(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export async function getAnalyticsStats(): Promise<AnalyticsStats | null> {
  const isConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "your_supabase_url";

  if (!isConfigured) return null;

  const supabase = createServiceClient();

  const [
    { data: views7d },
    { data: views30d },
    { count: todayCount },
    { count: apps7d },
    { count: apps30d },
  ] = await Promise.all([
    supabase
      .from("page_views")
      .select("created_at, ip_hash, page, referrer, device")
      .gte("created_at", daysAgo(7)),
    supabase
      .from("page_views")
      .select("created_at, ip_hash, page, referrer, device")
      .gte("created_at", daysAgo(30)),
    supabase
      .from("page_views")
      .select("*", { count: "exact", head: true })
      .gte("created_at", todayStart()),
    supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .gte("created_at", daysAgo(7)),
    supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .gte("created_at", daysAgo(30)),
  ]);

  const views7dList = views7d ?? [];
  const views30dList = views30d ?? [];

  // Unique visitors by distinct ip_hash
  const unique7d = new Set(views7dList.map((v) => v.ip_hash)).size;
  const unique30d = new Set(views30dList.map((v) => v.ip_hash)).size;

  const apps30dCount = apps30d ?? 0;
  const conversionRate =
    unique30d > 0 ? Math.round((apps30dCount / unique30d) * 100 * 10) / 10 : 0;

  // Daily chart — last 14 days
  const dailyChart = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const dateStr = d.toISOString().split("T")[0];
    const dayViews = views30dList.filter(
      (v) => v.created_at.split("T")[0] === dateStr
    );
    return {
      date: dateStr,
      views: dayViews.length,
      unique: new Set(dayViews.map((v) => v.ip_hash)).size,
    };
  });

  // Top pages (last 30 days)
  const pageCount: Record<string, number> = {};
  views30dList.forEach((v) => {
    pageCount[v.page] = (pageCount[v.page] ?? 0) + 1;
  });
  const topPages = Object.entries(pageCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([page, views]) => ({ page, views }));

  // Top referrers (last 30 days, exclude internal/empty)
  const refCount: Record<string, number> = {};
  views30dList.forEach((v) => {
    if (!v.referrer) return;
    try {
      const host = new URL(v.referrer).hostname.replace("www.", "");
      if (host !== "delinatravel.kz" && host !== "localhost") {
        refCount[host] = (refCount[host] ?? 0) + 1;
      }
    } catch {
      // invalid URL — skip
    }
  });
  const topReferrers = Object.entries(refCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([referrer, views]) => ({ referrer, views }));

  // Device breakdown
  const deviceCount: Record<string, number> = {};
  views30dList.forEach((v) => {
    const d = v.device ?? "unknown";
    deviceCount[d] = (deviceCount[d] ?? 0) + 1;
  });
  const deviceBreakdown = Object.entries(deviceCount)
    .sort(([, a], [, b]) => b - a)
    .map(([device, views]) => ({ device, views }));

  return {
    viewsToday: todayCount ?? 0,
    views7d: views7dList.length,
    views30d: views30dList.length,
    uniqueVisitors7d: unique7d,
    uniqueVisitors30d: unique30d,
    applications7d: apps7d ?? 0,
    applications30d: apps30dCount,
    conversionRate,
    dailyChart,
    topPages,
    topReferrers,
    deviceBreakdown,
  };
}
