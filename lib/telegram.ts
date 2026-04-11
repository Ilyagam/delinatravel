// REASON: Уведомления о новых заявках в Telegram
// Вызывается из app/api/applications/route.ts при отправке формы
// КОНТРАКТ: data содержит name, phone, опционально tour_title/message/application_id

import { ApplicationFormData } from "@/types";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "5135760040";

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// REASON: Нормализация телефона для WhatsApp/tel ссылок
function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-()]/g, "").replace(/^\+/, "");
}

export async function sendApplicationToTelegram(
  data: ApplicationFormData & { application_id?: string }
): Promise<void> {
  const safeName = escapeHtml(data.name);
  const safePhone = escapeHtml(data.phone);
  const safeTour = data.tour_title ? escapeHtml(data.tour_title) : "не выбран";
  const safeMessage = data.message ? escapeHtml(data.message) : "";

  const text = [
    "🌍 <b>Новая заявка с сайта!</b>",
    "",
    `👤 ${safeName}`,
    `📞 ${safePhone}`,
    `🗺 ${safeTour}`,
    safeMessage ? `💬 ${safeMessage}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const phone = normalizePhone(data.phone);

  // REASON: tel: ссылки не поддерживаются в Telegram inline buttons — только https/tg
  const inline_keyboard: { text: string; url?: string; callback_data?: string }[][] = [
    [
      { text: "💬 WhatsApp", url: `https://wa.me/${phone}` },
    ],
  ];

  // Если есть ID заявки — добавить кнопку статуса
  if (data.application_id) {
    inline_keyboard.push([
      { text: "📝 В работе", callback_data: `app_status:${data.application_id}:contacted` },
      { text: "✅ Закрыта", callback_data: `app_status:${data.application_id}:done` },
    ]);
  }

  const response = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: "HTML",
        reply_markup: { inline_keyboard },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("Telegram notification error:", error);
  }
}
