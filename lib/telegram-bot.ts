// REASON: Telegram Bot API wrapper — used by webhook handler and notification system
// CONTRACTS: All methods return void, log errors. Bot token from env.

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const API_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;

// ============ TYPES ============

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: CallbackQuery;
}

export interface TelegramPhoto {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  file_size?: number;
}

export interface TelegramMessage {
  message_id: number;
  from?: { id: number; first_name: string };
  chat: { id: number };
  text?: string;
  photo?: TelegramPhoto[];
}

export interface CallbackQuery {
  id: string;
  from: { id: number; first_name: string };
  message?: { message_id: number; chat: { id: number } };
  data?: string;
}

export interface InlineButton {
  text: string;
  callback_data?: string;
  url?: string;
}

export type InlineKeyboard = InlineButton[][];

export interface ReplyKeyboardButton {
  text: string;
}

export type ReplyKeyboard = ReplyKeyboardButton[][];

// REASON: Persistent keyboard at bottom of chat — Delya taps buttons instead of typing commands
export const MAIN_MENU: ReplyKeyboard = [
  [{ text: "📋 Мои туры" }, { text: "➕ Добавить тур" }],
  [{ text: "📩 Заявки" }, { text: "📊 Статистика" }],
];

// ============ API METHODS ============

export async function sendMessage(
  chatId: number,
  text: string,
  options?: {
    inline_keyboard?: InlineKeyboard;
    reply_keyboard?: ReplyKeyboard;
    parse_mode?: string;
  }
): Promise<void> {
  const body: Record<string, unknown> = {
    chat_id: chatId,
    text,
    parse_mode: options?.parse_mode || "HTML",
  };

  if (options?.inline_keyboard) {
    body.reply_markup = { inline_keyboard: options.inline_keyboard };
  } else if (options?.reply_keyboard) {
    body.reply_markup = {
      keyboard: options.reply_keyboard,
      resize_keyboard: true,
    };
  }

  const response = await fetch(`${API_BASE}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Telegram sendMessage error:", error);
  }
}

export async function answerCallbackQuery(
  callbackQueryId: string,
  text?: string
): Promise<void> {
  await fetch(`${API_BASE}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackQueryId, text }),
  });
}

export async function editMessageText(
  chatId: number,
  messageId: number,
  text: string,
  inlineKeyboard?: InlineKeyboard
): Promise<void> {
  const body: Record<string, unknown> = {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: "HTML",
  };

  if (inlineKeyboard) {
    body.reply_markup = { inline_keyboard: inlineKeyboard };
  }

  await fetch(`${API_BASE}/editMessageText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// REASON: Only Delya and dev accounts can use admin commands
// TELEGRAM_CHAT_ID может содержать несколько ID через запятую
export function isAdmin(chatId: number): boolean {
  const adminIds = (process.env.TELEGRAM_CHAT_ID || "5135760040").split(",");
  return adminIds.includes(String(chatId));
}
