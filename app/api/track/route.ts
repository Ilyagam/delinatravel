import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { createServiceClient, isConfigured } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  // Silently skip if Supabase not configured
  if (!isConfigured()) {
    return NextResponse.json({ ok: true });
  }

  try {
    const { page, referrer, device } = await req.json();

    // Privacy-safe IP hash (no raw IP stored)
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const salt = process.env.HASH_SALT || "delina-analytics-salt";
    const ip_hash = createHash("sha256").update(ip + salt).digest("hex");

    const supabase = createServiceClient();
    await supabase.from("page_views").insert({
      page,
      referrer: referrer || null,
      ip_hash,
      device: device || "unknown",
    });
  } catch {
    // Never crash the site due to analytics
  }

  return NextResponse.json({ ok: true });
}
