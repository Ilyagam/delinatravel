// REASON: Telegram webhook endpoint — receives updates from Telegram Bot API
// Vercel deploys this as a serverless function automatically

import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { handleUpdate } from "@/lib/bot-handlers";
import { TelegramUpdate } from "@/lib/telegram-bot";

export async function POST(req: NextRequest): Promise<NextResponse> {
  // REASON: Simple auth — webhook URL contains bot token as query param
  const token = req.nextUrl.searchParams.get("token");
  if (token !== process.env.TELEGRAM_BOT_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const update: TelegramUpdate = await req.json();
    // REASON: Обрабатываем update в фоне через after() — возвращаем 200 сразу,
    // чтобы Telegram не ретраил и не слал дубликаты при медленных cold start
    after(async () => {
      try {
        await handleUpdate(update);
      } catch (error) {
        console.error("Webhook handler error:", error);
      }
    });
  } catch (error) {
    console.error("Webhook parse error:", error);
  }

  // REASON: Always return 200 — otherwise Telegram retries and floods the endpoint
  return NextResponse.json({ ok: true });
}
