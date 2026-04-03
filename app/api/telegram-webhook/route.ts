// REASON: Telegram webhook endpoint — receives updates from Telegram Bot API
// Vercel deploys this as a serverless function automatically

import { NextRequest, NextResponse } from "next/server";
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
    await handleUpdate(update);
  } catch (error) {
    console.error("Webhook error:", error);
  }

  // REASON: Always return 200 — otherwise Telegram retries and floods the endpoint
  return NextResponse.json({ ok: true });
}
