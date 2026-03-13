import { ApplicationFormData } from "@/types";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
// REASON: Delya's Telegram user ID = 5135760040 (received from client)
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "5135760040";

export async function sendApplicationToTelegram(
  data: ApplicationFormData
): Promise<void> {
  const tourLine = data.tour_title
    ? `🗺 Тур: ${data.tour_title}`
    : "🗺 Тур: не выбран";

  const text = [
    "🌍 *Новая заявка с сайта Delina Travel!*",
    "",
    `👤 Имя: ${data.name}`,
    `📞 Телефон: ${data.phone}`,
    tourLine,
    data.message ? `💬 Сообщение: ${data.message}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: "Markdown",
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Telegram API error: ${error}`);
  }
}
