import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// REASON: Supabase client is lazy — only valid when env vars are properly set
export const supabase = isConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function isConfigured(): boolean {
  return (
    !!supabaseUrl &&
    supabaseUrl !== "your_supabase_url" &&
    supabaseUrl.startsWith("http")
  );
}

export function createServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return createClient(supabaseUrl, serviceKey);
}
