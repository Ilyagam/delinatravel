// REASON: Обработка фото сообщений в Telegram-боте
// Скачивает фото → загружает в Supabase Storage → обновляет tours.image_urls

import { sendMessage, MAIN_MENU, TelegramPhoto } from "./telegram-bot";
import { getSession, clearSession, BotSession } from "./bot-state";
import { getLargestPhotoFileId, downloadAndUploadPhoto, addPhotoToTour } from "./bot-photo";
import { createServiceClient } from "./supabase";
import { escapeHtml } from "./bot-tour-flow";

// REASON: Вызывается из handleUpdate когда message.photo присутствует
export async function handlePhotoMessage(
  chatId: number,
  photos: TelegramPhoto[]
): Promise<void> {
  const session = await getSession(chatId);

  // Режим загрузки фото к существующему или новому туру
  if (session.action === "upload_photo" || session.action === "add_tour_photo") {
    const tourId = session.data.tour_id as string | undefined;
    if (!tourId) {
      await clearSession(chatId);
      await sendMessage(chatId, "❌ Сессия потеряна. Попробуй заново через ✏️ → 📸", { reply_keyboard: MAIN_MENU });
      return;
    }
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
    await sendMessage(chatId, "❌ Ошибка загрузки фото. Попробуй ещё раз или нажми /done");
  }
}

// REASON: Тур уже создан в БД на предыдущем шаге — просто закрываем сессию фото
export async function handlePhotoSkipInAddFlow(
  chatId: number,
  session: BotSession
): Promise<void> {
  await clearSession(chatId);
  const title = session.data.title ? escapeHtml(String(session.data.title)) : "Тур";
  await sendMessage(
    chatId,
    `✅ <b>${title}</b> создан и уже на сайте!\n\nФото можно добавить позже: 📋 Мои туры → ✏️ → 📸`,
    { reply_keyboard: MAIN_MENU }
  );
}
