// REASON: Загрузка фото туров через Telegram → Supabase Storage
// КОНТРАКТ: downloadAndUploadPhoto скачивает фото из Telegram и загружает в bucket tour-images
// Возвращает публичный URL фото

import { createServiceClient } from "./supabase";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// REASON: Telegram хранит фото в нескольких размерах — берём самый большой (последний в массиве)
export function getLargestPhotoFileId(
  photos: { file_id: string; file_size?: number }[]
): string {
  return photos[photos.length - 1].file_id;
}

// REASON: Telegram API → getFile → download → upload to Supabase Storage
export async function downloadAndUploadPhoto(
  fileId: string,
  tourSlug: string
): Promise<string> {
  // 1. Получить путь к файлу через Telegram API
  const fileResponse = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`
  );
  const fileData = await fileResponse.json();

  if (!fileData.ok || !fileData.result?.file_path) {
    throw new Error("Failed to get file path from Telegram");
  }

  const filePath = fileData.result.file_path as string;
  const ext = filePath.split(".").pop() || "jpg";

  // 2. Скачать файл
  const downloadUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
  const imageResponse = await fetch(downloadUrl);
  const imageBuffer = await imageResponse.arrayBuffer();

  // 3. Загрузить в Supabase Storage
  const fileName = `${tourSlug}/${Date.now()}.${ext}`;
  const supabase = createServiceClient();

  const { error } = await supabase.storage
    .from("tour-images")
    .upload(fileName, imageBuffer, {
      contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
      upsert: false,
    });

  if (error) {
    throw new Error(`Supabase upload error: ${error.message}`);
  }

  // 4. Вернуть публичный URL
  return `${SUPABASE_URL}/storage/v1/object/public/tour-images/${fileName}`;
}

// REASON: Добавить URL фото в массив image_urls тура
export async function addPhotoToTour(
  tourId: string,
  photoUrl: string
): Promise<void> {
  const supabase = createServiceClient();

  // Получить текущие фото
  const { data: tour } = await supabase
    .from("tours")
    .select("image_urls")
    .eq("id", tourId)
    .single();

  const currentUrls: string[] = tour?.image_urls || [];
  currentUrls.push(photoUrl);

  await supabase
    .from("tours")
    .update({ image_urls: currentUrls })
    .eq("id", tourId);
}
