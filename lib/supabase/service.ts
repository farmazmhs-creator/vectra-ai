import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./config";

// SERVER-ONLY. Uses the service-role key, which bypasses RLS. This module must
// never be imported by a client ("use client") component. The key is read from a
// non-NEXT_PUBLIC env var, is never returned to the client, and is never logged.
export function supabaseService() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured (server-only).");
  return createClient(SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
