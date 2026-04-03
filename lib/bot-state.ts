// REASON: Conversation state for multi-step bot dialogs (add/edit tour)
// Stored in Supabase bot_sessions table for persistence across serverless invocations

import { createServiceClient } from "./supabase";

export interface BotSession {
  chat_id: number;
  action: string | null; // 'add_tour' | 'edit_tour' | null
  step: string | null;
  data: Record<string, unknown>;
}

export async function getSession(chatId: number): Promise<BotSession> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("bot_sessions")
    .select("*")
    .eq("chat_id", chatId)
    .single();

  if (data) return data as BotSession;
  return { chat_id: chatId, action: null, step: null, data: {} };
}

export async function setSession(
  chatId: number,
  action: string | null,
  step: string | null,
  data: Record<string, unknown>
): Promise<void> {
  const supabase = createServiceClient();
  await supabase.from("bot_sessions").upsert({
    chat_id: chatId,
    action,
    step,
    data,
    updated_at: new Date().toISOString(),
  });
}

export async function clearSession(chatId: number): Promise<void> {
  await setSession(chatId, null, null, {});
}
