// REASON: Telegram bot — routing, callbacks, simple commands
// CONTRACTS: handleUpdate() is the entry point called from webhook route

import { createServiceClient } from "./supabase";
import { getAnalyticsStats } from "./analytics";
import {
  sendMessage,
  answerCallbackQuery,
  editMessageText,
  isAdmin,
  MAIN_MENU,
  InlineKeyboard,
  TelegramUpdate,
  CallbackQuery,
} from "./telegram-bot";
import { getSession, clearSession } from "./bot-state";
import { handleAddStart, handleAddStep, handleEditStep, escapeHtml } from "./bot-tour-flow";
import { handlePhotoMessage } from "./bot-photo-handler";

// ============ ROUTING ============

export async function handleUpdate(update: TelegramUpdate): Promise<void> {
  if (update.callback_query) {
    return handleCallback(update.callback_query);
  }

  const message = update.message;
  if (!message) return;

  const chatId = message.chat.id;
  if (!isAdmin(chatId)) {
    await sendMessage(chatId, "⛔ Доступ только для администратора");
    return;
  }

  // REASON: Фото обрабатываем отдельно — для загрузки в Storage
  if (message.photo && message.photo.length > 0) {
    return handlePhotoMessage(chatId, message.photo);
  }

  if (message.text) {
    const text = message.text.trim();

    if (text === "/start") return handleStart(chatId);
    if (text === "📋 Мои туры" || text === "/tours") return handleTours(chatId);
    if (text === "➕ Добавить тур" || text === "/add") return handleAddStart(chatId);
    if (text === "📩 Заявки" || text === "/apps") return handleApps(chatId, "new");
    if (text === "📊 Статистика" || text === "/stats") return handleStats(chatId);
    if (text === "/cancel") return handleCancel(chatId);

    // Multi-step flows
    const session = await getSession(chatId);

    // REASON: /done завершает загрузку фото и /skip пропускает шаг фото в add flow
    if ((text === "/done" || text === "/skip") && (session.action === "upload_photo" || session.action === "add_tour_photo")) {
      if (session.action === "add_tour_photo") {
        // REASON: НЕ очищаем сессию до вызова — handlePhotoSkipInAddFlow читает session.data
        const { handlePhotoSkipInAddFlow } = await import("./bot-photo-handler");
        return handlePhotoSkipInAddFlow(chatId, session);
      }
      await clearSession(chatId);
      await sendMessage(chatId, "✅ Фото загружены!", { reply_keyboard: MAIN_MENU });
      return;
    }

    // REASON: Если Деля отправила текст во время ожидания фото — подсказать
    if (session.action === "upload_photo" || session.action === "add_tour_photo") {
      await sendMessage(chatId, "📸 Отправь фото или нажми /done\nОтменить — /cancel");
      return;
    }

    if (session.action === "add_tour") return handleAddStep(chatId, text, session);
    if (session.action === "edit_tour") return handleEditStep(chatId, text, session);

    await sendMessage(chatId, "Выбери действие 👇", { reply_keyboard: MAIN_MENU });
  }
}

// ============ /start ============

async function handleStart(chatId: number): Promise<void> {
  await sendMessage(
    chatId,
    "👋 Привет! Я — админка <b>Delina Travel</b>.\n\nВыбери действие внизу 👇",
    { reply_keyboard: MAIN_MENU }
  );
}

// ============ /tours ============

async function handleTours(chatId: number): Promise<void> {
  const supabase = createServiceClient();
  const { data: tours } = await supabase
    .from("tours")
    .select("*")
    .order("created_at", { ascending: false });

  if (!tours || tours.length === 0) {
    await sendMessage(chatId, "Туров пока нет. Нажми ➕ Добавить тур", {
      reply_keyboard: MAIN_MENU,
    });
    return;
  }

  for (const tour of tours) {
    const status = tour.is_active ? "🟢 Активен" : "🔴 Скрыт";
    const price = tour.price_from
      ? `${Number(tour.price_from).toLocaleString("ru")} ₸`
      : "—";

    const text = [
      `<b>${escapeHtml(tour.title)}</b>`,
      `📍 ${escapeHtml(tour.destination)}`,
      `📅 ${escapeHtml(tour.dates)}`,
      `💰 от ${price}`,
      status,
    ].join("\n");

    const keyboard: InlineKeyboard = [
      [
        { text: "✏️ Редактировать", callback_data: `edit:${tour.id}` },
        {
          text: tour.is_active ? "🔴 Скрыть" : "🟢 Показать",
          callback_data: `toggle:${tour.id}`,
        },
      ],
      [
        { text: "📋 Дублировать", callback_data: `duplicate:${tour.id}` },
        { text: "🗑 Удалить", callback_data: `delete:${tour.id}` },
      ],
    ];

    await sendMessage(chatId, text, { inline_keyboard: keyboard });
  }
}

// ============ /apps ============

async function handleApps(chatId: number, filter: string): Promise<void> {
  const supabase = createServiceClient();
  let query = supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(15);

  if (filter === "new") {
    query = query.or("status.eq.new,status.is.null");
  }

  const { data: apps } = await query;

  if (!apps || apps.length === 0) {
    const emptyText = filter === "new"
      ? "Новых заявок нет ✅\n\nНажми 📋 чтобы посмотреть все"
      : "Заявок пока нет 📭";
    await sendMessage(chatId, emptyText, { reply_keyboard: MAIN_MENU });
    return;
  }

  const title = filter === "new"
    ? `📩 <b>Новые заявки (${apps.length}):</b>`
    : `📋 <b>Все заявки (${apps.length}):</b>`;

  await sendMessage(chatId, title, { reply_keyboard: MAIN_MENU });

  for (const app of apps) {
    const date = new Date(app.created_at).toLocaleDateString("ru");
    const statusEmoji = getStatusEmoji(app.status);
    const phone = app.phone.replace(/[\s\-()]/g, "").replace(/^\+/, "");

    const text = [
      `${statusEmoji} <b>${escapeHtml(app.name)}</b>`,
      `📞 ${escapeHtml(app.phone)}`,
      `🗺 ${escapeHtml(app.tour_title || "не выбран")}`,
      app.message ? `💬 ${escapeHtml(app.message)}` : "",
      `📅 ${date}`,
    ]
      .filter(Boolean)
      .join("\n");

    const keyboard: InlineKeyboard = [
      [
        { text: "📞 Позвонить", url: `tel:+${phone}` },
        { text: "💬 WhatsApp", url: `https://wa.me/${phone}` },
      ],
    ];

    // REASON: Кнопки статуса только если заявка ещё не закрыта
    if (app.status !== "done") {
      keyboard.push([
        { text: "📝 В работе", callback_data: `app_status:${app.id}:contacted` },
        { text: "✅ Закрыта", callback_data: `app_status:${app.id}:done` },
      ]);
    }

    await sendMessage(chatId, text, { inline_keyboard: keyboard });
  }

  // Кнопка переключения фильтра
  if (filter === "new") {
    await sendMessage(chatId, "👆 Показаны только новые", {
      inline_keyboard: [[{ text: "📋 Показать все заявки", callback_data: "apps_all" }]],
    });
  }
}

function getStatusEmoji(status: string | null): string {
  switch (status) {
    case "contacted": return "📝";
    case "paid": return "💳";
    case "done": return "✅";
    default: return "🆕";
  }
}

// ============ /stats ============

async function handleStats(chatId: number): Promise<void> {
  try {
    return await handleStatsInner(chatId);
  } catch (error) {
    console.error("Stats error:", error);
    await sendMessage(chatId, "❌ Ошибка загрузки статистики", { reply_keyboard: MAIN_MENU });
  }
}

async function handleStatsInner(chatId: number): Promise<void> {
  const stats = await getAnalyticsStats();

  if (!stats) {
    await sendMessage(chatId, "📊 Статистика пока недоступна", { reply_keyboard: MAIN_MENU });
    return;
  }

  const supabase = createServiceClient();
  const [{ count: toursCount }, { count: newAppsCount }] = await Promise.all([
    supabase.from("tours").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("applications").select("id", { count: "exact", head: true }).or("status.eq.new,status.is.null"),
  ]);

  const topPagesText = stats.topPages.length
    ? stats.topPages.map((p) => `  ${p.page} — ${p.views}`).join("\n")
    : "  нет данных";

  const text = [
    "📊 <b>Статистика сайта</b>",
    "",
    "👁 <b>Просмотры:</b>",
    `  Сегодня: ${stats.viewsToday}`,
    `  За неделю: ${stats.views7d}`,
    `  За месяц: ${stats.views30d}`,
    "",
    "👤 <b>Уникальные посетители:</b>",
    `  За неделю: ${stats.uniqueVisitors7d}`,
    `  За месяц: ${stats.uniqueVisitors30d}`,
    "",
    "📩 <b>Заявки:</b>",
    `  За неделю: ${stats.applications7d}`,
    `  За месяц: ${stats.applications30d}`,
    `  Конверсия: ${stats.conversionRate}%`,
    "",
    `⚠️ Необработанных заявок: ${newAppsCount ?? 0}`,
    "",
    "📄 <b>Популярные страницы:</b>",
    topPagesText,
    "",
    `🗺 Активных туров: ${toursCount ?? 0}`,
  ].join("\n");

  await sendMessage(chatId, text, { reply_keyboard: MAIN_MENU });
}

// ============ /cancel ============

async function handleCancel(chatId: number): Promise<void> {
  await clearSession(chatId);
  await sendMessage(chatId, "❌ Отменено", { reply_keyboard: MAIN_MENU });
}

// ============ CALLBACKS ============

async function handleCallback(query: CallbackQuery): Promise<void> {
  const chatId = query.message?.chat.id;
  const messageId = query.message?.message_id;
  const data = query.data as string;

  if (!chatId || !isAdmin(chatId)) {
    await answerCallbackQuery(query.id, "⛔ Нет доступа");
    return;
  }

  const [action, id, ...rest] = data.split(":");
  const supabase = createServiceClient();

  switch (action) {
    case "toggle": {
      const { data: tour } = await supabase
        .from("tours").select("is_active, title").eq("id", id).single();
      if (!tour) break;
      const newStatus = !tour.is_active;
      await supabase.from("tours").update({ is_active: newStatus }).eq("id", id);
      await answerCallbackQuery(query.id, `${tour.title} → ${newStatus ? "🟢" : "🔴"}`);
      await handleTours(chatId);
      break;
    }

    case "delete": {
      if (rest[0] === "confirm") {
        await supabase.from("tours").delete().eq("id", id);
        await answerCallbackQuery(query.id, "🗑 Удалён");
        if (messageId) await editMessageText(chatId, messageId, "🗑 Тур удалён");
      } else {
        if (messageId) {
          await editMessageText(chatId, messageId, "⚠️ Точно удалить этот тур?", [
            [
              { text: "✅ Да, удалить", callback_data: `delete:${id}:confirm` },
              { text: "❌ Нет", callback_data: "cancel_action" },
            ],
          ]);
        }
        await answerCallbackQuery(query.id);
      }
      break;
    }

    case "duplicate": {
      const { data: original } = await supabase
        .from("tours").select("*").eq("id", id).single();
      if (!original) {
        await answerCallbackQuery(query.id, "❌ Тур не найден");
        break;
      }
      const { id: _id, created_at: _ca, slug: _slug, ...tourData } = original;
      const newSlug = original.slug + "-copy-" + Date.now().toString(36);
      await supabase.from("tours").insert({
        ...tourData,
        slug: newSlug,
        title: original.title + " (копия)",
        is_active: false,
      });
      await answerCallbackQuery(query.id, "📋 Скопировано");
      await sendMessage(chatId, "📋 Тур скопирован! Он скрыт — отредактируй даты и цену, потом включи.", {
        reply_keyboard: MAIN_MENU,
      });
      break;
    }

    case "edit": {
      const keyboard: InlineKeyboard = [
        [{ text: "📝 Название", callback_data: `ef:${id}:title` }],
        [{ text: "📍 Направление", callback_data: `ef:${id}:destination` }],
        [{ text: "📅 Даты", callback_data: `ef:${id}:dates` }],
        [{ text: "💰 Цена", callback_data: `ef:${id}:price_from` }],
        [{ text: "📄 Описание", callback_data: `ef:${id}:short_description` }],
        [{ text: "✅ Что включено", callback_data: `ef:${id}:what_included` }],
        [{ text: "📸 Добавить фото", callback_data: `add_photo:${id}` }],
        [{ text: "🔙 Назад", callback_data: "cancel_action" }],
      ];
      if (messageId) {
        await editMessageText(chatId, messageId, "Что редактировать?", keyboard);
      }
      await answerCallbackQuery(query.id);
      break;
    }

    case "ef": {
      // REASON: ef = edit field — начать редактирование одного поля тура
      const field = rest[0];
      if (!field) {
        await answerCallbackQuery(query.id, "❌ Ошибка");
        break;
      }
      const { setSession } = await import("./bot-state");
      const fieldNames: Record<string, string> = {
        title: "название", destination: "направление", dates: "даты",
        price_from: "цену (только число в тенге)", short_description: "краткое описание",
        what_included: "что включено (каждый пункт с новой строки)",
      };
      await setSession(chatId, "edit_tour", field, { tour_id: id });
      await sendMessage(chatId, `✏️ Введи новое <b>${fieldNames[field] || field}</b>:\n\n/cancel — отмена`);
      await answerCallbackQuery(query.id);
      break;
    }

    case "add_photo": {
      // REASON: Переводим бот в режим ожидания фото для конкретного тура
      const { setSession } = await import("./bot-state");
      await setSession(chatId, "upload_photo", "waiting", { tour_id: id });
      await sendMessage(chatId, "📸 Отправь фото тура (одно или несколько).\n\nКогда закончишь — нажми /done");
      await answerCallbackQuery(query.id);
      break;
    }

    case "app_status": {
      // REASON: Обновить статус заявки прямо из Telegram
      const newStatus = rest[0];
      if (!newStatus) {
        await answerCallbackQuery(query.id, "❌ Ошибка");
        break;
      }
      const statusLabels: Record<string, string> = {
        contacted: "📝 В работе", done: "✅ Закрыта",
      };
      const { error: statusError } = await supabase.from("applications").update({ status: newStatus }).eq("id", id);
      if (statusError) {
        await answerCallbackQuery(query.id, "❌ Ошибка обновления");
        break;
      }
      await answerCallbackQuery(query.id, statusLabels[newStatus] || newStatus);
      if (messageId) {
        await editMessageText(chatId, messageId,
          `${statusLabels[newStatus] || newStatus} — заявка обновлена`);
      }
      break;
    }

    case "apps_all": {
      await answerCallbackQuery(query.id);
      await handleApps(chatId, "all");
      break;
    }

    case "cancel_action": {
      if (messageId) await editMessageText(chatId, messageId, "↩️ Отменено");
      await answerCallbackQuery(query.id);
      break;
    }
  }
}
