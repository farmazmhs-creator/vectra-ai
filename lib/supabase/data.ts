import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config";

// Server-side data client. Uses the publishable/anon key with permissive RLS
// (demo-first — see CLAUDE.md rule 6). No user session is persisted; all
// mutations run through server actions so scoring logic stays server-side.
export function supabaseData() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
}
