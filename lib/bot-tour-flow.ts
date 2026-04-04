// REASON: Пошаговые диалоги добавления и редактирования тура
// Вынесено из bot-handlers.ts для соблюдения лимита 300 строк

import { createServiceClient } from "./supabase";
import { sendMessage, MAIN_MENU } from "./telegram-bot";
import { setSession, clearSession, BotSession } from "./bot-state";

// ============ ESCAPING ============

export function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ============ ADD TOUR FLOW ============

const ADD_STEPS = [
  { key: "title", prompt: "📝 Введи <b>название</b> тура:" },
  { key: "destination", prompt: "📍 Введи <b>направление</b> (куда):" },
  { key: "dates", prompt: "📅 <b>Даты</b> (например: 26 марта – 5 апреля 2026):" },
  { key: "price_from", prompt: "💰 <b>Цена от</b> (только число, без пробелов):" },
  { key: "short_description", prompt: "📄 <b>Краткое описание</b> (1-2 предложения):" },
  { key: "what_included", prompt: "✅ <b>Что включено</b> (каждый пункт с новой строки):" },
];

export async function handleAddStart(chatId: number): Promise<void> {
  await setSession(chatId, "add_tour", ADD_STEPS[0].key, {});
  await sendMessage(chatId, `${ADD_STEPS[0].prompt}\n\n/cancel — отмена`);
}

export async function handleAddStep(
  chatId: number,
  text: string,
  session: BotSession
): Promise<void> {
  // REASON: Timeout — если диалог завис больше 30 минут, сбросить
  if (session.data._updated_at) {
    const elapsed = Date.now() - Number(session.data._updated_at);
    if (elapsed > 30 * 60 * 1000) {
      await clearSession(chatId);
      await sendMessage(chatId, "⏰ Диалог устарел. Начни заново: ➕ Добавить тур", {
        reply_keyboard: MAIN_MENU,
      });
      return;
    }
  }

  const currentIndex = ADD_STEPS.findIndex((s) => s.key === session.step);
  if (currentIndex === -1) {
    await clearSession(chatId);
    return;
  }

  const currentStep = ADD_STEPS[currentIndex];
  const data: Record<string, unknown> = { ...session.data, _updated_at: Date.now() };

  // Parse value based on field type
  if (currentStep.key === "what_included") {
    data[currentStep.key] = text
      .split("\n")
      .map((s: string) => s.replace(/^[•\-–]\s*/, "").trim())
      .filter(Boolean);
  } else if (currentStep.key === "price_from") {
    const num = parseInt(text.replace(/\s/g, ""), 10);
    if (isNaN(num)) {
      await sendMessage(chatId, "❌ Введи число (например: 799000)");
      return;
    }
    data[currentStep.key] = num;
  } else {
    data[currentStep.key] = text;
  }

  // Next step or show confirmation
  const nextIndex = currentIndex + 1;
  if (nextIndex < ADD_STEPS.length) {
    await setSession(chatId, "add_tour", ADD_STEPS[nextIndex].key, data);
    await sendMessage(chatId, ADD_STEPS[nextIndex].prompt);
    return;
  }

  // All text steps done — save tour to DB immediately, then offer photo upload
  const slug = generateSlug(data.title as string);
  const supabase = createServiceClient();

  const { data: inserted, error } = await supabase.from("tours").insert({
    slug,
    title: data.title,
    destination: data.destination,
    dates: data.dates,
    price_from: data.price_from != null ? Number(data.price_from) : null,
    short_description: data.short_description,
    what_included: data.what_included,
    is_active: true,
  }).select("id").single();

  if (error || !inserted) {
    await clearSession(chatId);
    await sendMessage(chatId, `❌ Ошибка: ${error?.message || "не удалось создать тур"}`, { reply_keyboard: MAIN_MENU });
    return;
  }

  // REASON: Тур создан — предлагаем добавить фото. ID нужен для Storage
  await setSession(chatId, "add_tour_photo", "waiting", { ...data, tour_id: inserted.id });

  await sendMessage(
    chatId,
    `✅ Тур <b>${escapeHtml(String(data.title))}</b> создан!\n\n📸 Теперь отправь фото (одно или несколько).\nКогда закончишь — нажми /done\nПропустить — /skip`
  );
}

// ============ EDIT TOUR FLOW ============

export async function handleEditStep(
  chatId: number,
  text: string,
  session: BotSession
): Promise<void> {
  const field = session.step;
  const tourId = session.data.tour_id as string;

  if (!field || !tourId) {
    await clearSession(chatId);
    return;
  }

  let value: unknown;
  if (field === "what_included") {
    value = text
      .split("\n")
      .map((s: string) => s.replace(/^[•\-–]\s*/, "").trim())
      .filter(Boolean);
  } else if (field === "price_from") {
    const num = parseInt(text.replace(/\s/g, ""), 10);
    if (isNaN(num)) {
      await sendMessage(chatId, "❌ Введи число");
      return;
    }
    value = num;
  } else {
    value = text;
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("tours")
    .update({ [field]: value })
    .eq("id", tourId);

  await clearSession(chatId);
  if (error) {
    await sendMessage(chatId, `❌ Ошибка: ${error.message}`, { reply_keyboard: MAIN_MENU });
  } else {
    await sendMessage(chatId, "✅ Обновлено!", { reply_keyboard: MAIN_MENU });
  }
}

// ============ HELPERS ============

export function generateSlug(title: string): string {
  const translitMap: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh",
    з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
    п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts",
    ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu",
    я: "ya",
  };

  return title
    .toLowerCase()
    .split("")
    .map((c) => translitMap[c] || c)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 80);
}
