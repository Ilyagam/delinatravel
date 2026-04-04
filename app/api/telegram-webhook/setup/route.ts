// REASON: One-time endpoint to register webhook URL with Telegram
// Call once after deploy: GET https://your-site.vercel.app/api/telegram-webhook/setup

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const password = req.nextUrl.searchParams.get("password");
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN not set" }, { status: 500 });
  }

  const host = req.headers.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const webhookUrl = `${protocol}://${host}/api/telegram-webhook?token=${token}`;

  const response = await fetch(
    `https://api.telegram.org/bot${token}/setWebhook`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ["message", "callback_query"],
      }),
    }
  );

  const result = await response.json();

  // REASON: Also set bot commands menu for better UX
  await fetch(`https://api.telegram.org/bot${token}/setMyCommands`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      commands: [
        { command: "start", description: "Главное меню" },
        { command: "help", description: "Инструкция по боту" },
        { command: "tours", description: "Мои туры" },
        { command: "add", description: "Добавить тур" },
        { command: "apps", description: "Заявки" },
        { command: "stats", description: "Статистика сайта" },
        { command: "cancel", description: "Отменить текущее действие" },
      ],
    }),
  });

  return NextResponse.json({ webhookUrl: webhookUrl.replace(token, "***"), result });
}
