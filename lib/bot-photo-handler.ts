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

  // Режим загрузки фото для ленты Instagram на сайте
  if (session.action === "upload_instagram") {
    return uploadPhotoToInstagram(chatId, photos, session);
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

// REASON: Загрузка фото для ленты Instagram на сайте
async function uploadPhotoToInstagram(
  chatId: number,
  photos: TelegramPhoto[],
  session: BotSession
): Promise<void> {
  try {
    const fileId = getLargestPhotoFileId(photos);
    const photoUrl = await downloadAndUploadInstagramPhoto(fileId);
    const caption = (session.data.pending_caption as string) || "";

    // Сохранить в таблицу instagram_posts
    const supabase = createServiceClient();
    await supabase.from("instagram_posts").insert({
      instagram_id: Date.now().toString(),
      image_url: photoUrl,
      caption: caption.slice(0, 200),
      permalink: "https://www.instagram.com/delina_travel/",
      posted_at: new Date().toISOString(),
    });

    // Сбросить pending_caption после использования
    const { setSession } = await import("./bot-state");
    await setSession(chatId, "upload_instagram", "waiting", {});

    const count = (session.data._photo_count as number || 0) + 1;
    await sendMessage(
      chatId,
      `✅ Фото загружено в ленту!${caption ? ` (подпись: "${caption.slice(0, 50)}...")` : ""}\n\n📸 Отправь ещё или нажми /done`
    );
  } catch (error) {
    console.error("Instagram photo upload error:", error);
    await sendMessage(chatId, "❌ Ошибка загрузки фото. Попробуй ещё раз.");
  }
}

// REASON: Скачать фото из Telegram → загрузить в Supabase Storage bucket instagram-photos
async function downloadAndUploadInstagramPhoto(fileId: string): Promise<string> {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  const fileResponse = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`
  );
  const fileData = await fileResponse.json();
  if (!fileData.ok || !fileData.result?.file_path) {
    throw new Error("Failed to get file path from Telegram");
  }

  const filePath = fileData.result.file_path as string;
  const ext = filePath.split(".").pop() || "jpg";
  const fileName = `posts/${Date.now()}.${ext}`;

  const downloadUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
  const imageResponse = await fetch(downloadUrl);
  const imageBuffer = await imageResponse.arrayBuffer();

  const supabase = createServiceClient();
  const { error } = await supabase.storage
    .from("instagram-photos")
    .upload(fileName, imageBuffer, {
      contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
      upsert: false,
    });

  if (error) {
    throw new Error(`Supabase upload error: ${error.message}`);
  }

  return `${SUPABASE_URL}/storage/v1/object/public/instagram-photos/${fileName}`;
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
