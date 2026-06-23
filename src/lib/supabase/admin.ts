import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./env";

export function createAdminClient() {
  const { url } = getSupabaseEnv();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function isSupabaseAdminConfigured() {
  return Boolean(getSupabaseEnv().url && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
