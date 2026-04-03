// REASON: Утренняя сводка — Vercel Cron вызывает каждый день в 9:00
// Настройка в vercel.json: { "crons": [{ "path": "/api/cron/morning-report", "schedule": "0 3 * * *" }] }
// 03:00 UTC = 09:00 Алматы (UTC+6)

import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { sendMessage, MAIN_MENU } from "@/lib/telegram-bot";

export async function GET(req: NextRequest): Promise<NextResponse> {
  // REASON: Vercel Cron sends CRON_SECRET header, or allow with admin password
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  const isVercelCron = cronSecret && authHeader === `Bearer ${cronSecret}`;
  const isManual = req.nextUrl.searchParams.get("password") === process.env.ADMIN_PASSWORD;

  if (!isVercelCron && !isManual) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const chatId = Number(process.env.TELEGRAM_CHAT_ID || "5135760040");

  // Вчерашний день
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  const yesterdayEnd = new Date(yesterday);
  yesterdayEnd.setHours(23, 59, 59, 999);

  const [views, uniqueViews, newApps, pendingApps, activeTours] = await Promise.all([
    supabase
      .from("page_views")
      .select("id", { count: "exact", head: true })
      .gte("created_at", yesterday.toISOString())
      .lte("created_at", yesterdayEnd.toISOString()),
    supabase
      .from("page_views")
      .select("ip_hash")
      .gte("created_at", yesterday.toISOString())
      .lte("created_at", yesterdayEnd.toISOString()),
    supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .gte("created_at", yesterday.toISOString())
      .lte("created_at", yesterdayEnd.toISOString()),
    supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .or("status.eq.new,status.is.null"),
    supabase
      .from("tours")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
  ]);

  const uniqueCount = new Set(
    (uniqueViews.data ?? []).map((v: { ip_hash: string }) => v.ip_hash)
  ).size;

  const text = [
    "☀️ <b>Доброе утро! Сводка за вчера:</b>",
    "",
    `👁 Посетителей: ${views.count ?? 0} (уник: ${uniqueCount})`,
    `📩 Новых заявок: ${newApps.count ?? 0}`,
    `⚠️ Необработанных: ${pendingApps.count ?? 0}`,
    `🗺 Активных туров: ${activeTours.count ?? 0}`,
  ].join("\n");

  await sendMessage(chatId, text, { reply_keyboard: MAIN_MENU });

  return NextResponse.json({ ok: true });
}
