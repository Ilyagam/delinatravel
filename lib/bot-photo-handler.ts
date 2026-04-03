// REASON: Обработка фото сообщений в Telegram-боте
// Скачивает фото → загружает в Supabase Storage → обновляет tours.image_urls

import { sendMessage, MAIN_MENU, TelegramPhoto } from "./telegram-bot";
import { getSession, setSession, clearSession, BotSession } from "./bot-state";
import { getLargestPhotoFileId, downloadAndUploadPhoto, addPhotoToTour } from "./bot-photo";
import { createServiceClient } from "./supabase";
import { escapeHtml } from "./bot-tour-flow";

// REASON: Вызывается из handleUpdate когда message.photo присутствует
export async function handlePhotoMessage(
  chatId: number,
  photos: TelegramPhoto[]
): Promise<void> {
  const session = await getSession(chatId);

  // Режим загрузки фото к существующему туру
  if (session.action === "upload_photo") {
    const tourId = session.data.tour_id as string;
    return uploadPhotoToExistingTour(chatId, photos, tourId);
  }

  // Режим загрузки фото в flow добавления нового тура
  if (session.action === "add_tour_photo") {
    const tourId = session.data.tour_id as string;
    return uploadPhotoToExistingTour(chatId, photos, tourId);
  }

  // Фото вне контекста — подсказка
  await sendMessage(
    chatId,
    "📸 Чтобы добавить фото к туру, нажми ✏️ Редактировать → 📸 Добавить фото",
    { reply_keyboard: MAIN_MENU }
  );
}

async function uploadPhotoToExistingTour(
  chatId: number,
  photos: TelegramPhoto[],
  tourId: string
): Promise<void> {
  try {
    // Получить slug тура для имени файла
    const supabase = createServiceClient();
    const { data: tour } = await supabase
      .from("tours")
      .select("slug, title, image_urls")
      .eq("id", tourId)
      .single();

    if (!tour) {
      await sendMessage(chatId, "❌ Тур не найден");
      return;
    }

    const fileId = getLargestPhotoFileId(photos);
    const photoUrl = await downloadAndUploadPhoto(fileId, tour.slug);
    await addPhotoToTour(tourId, photoUrl);

    const count = (tour.image_urls?.length || 0) + 1;
    await sendMessage(
      chatId,
      `✅ Фото загружено! (${count} всего для "${escapeHtml(tour.title)}")\n\n📸 Отправь ещё или нажми /done`
    );
  } catch (error) {
    console.error("Photo upload error:", error);
    await sendMessage(chatId, "❌ Ошибка загрузки фото. Попробуй ещё раз.");
  }
}

// REASON: Когда в add flow пользователь нажал /skip на шаге фото — показать confirm
export async function handlePhotoSkipInAddFlow(
  chatId: number,
  session: BotSession
): Promise<void> {
  // Данные тура лежат в session.data (кроме tour_id и _updated_at)
  const data = session.data;

  const included = Array.isArray(data.what_included)
    ? (data.what_included as string[]).map((s) => `  • ${escapeHtml(s)}`).join("\n")
    : "";

  const summary = [
    "🔍 <b>Проверь данные тура:</b>",
    "",
    `📝 <b>${escapeHtml(String(data.title))}</b>`,
    `📍 ${escapeHtml(String(data.destination))}`,
    `📅 ${escapeHtml(String(data.dates))}`,
    `💰 от ${Number(data.price_from).toLocaleString("ru")} ₸`,
    `📄 ${escapeHtml(String(data.short_description))}`,
    "",
    "✅ Включено:",
    included,
  ].join("\n");

  // REASON: Восстанавливаем сессию add_tour для confirm callback
  await setSession(chatId, "add_tour", "confirm", data);

  await sendMessage(chatId, summary, {
    inline_keyboard: [
      [
        { text: "✅ Сохранить", callback_data: "confirm_add" },
        { text: "❌ Отмена", callback_data: "cancel_action" },
      ],
    ],
  });
}
