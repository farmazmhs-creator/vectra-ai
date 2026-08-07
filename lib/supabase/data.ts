import { createClient } from "@supabase/supabase-js";

// Server-side data client. Uses the publishable/anon key with permissive RLS
// (demo-first — see CLAUDE.md rule 6). No user session is persisted; all
// mutations run through server actions so scoring logic stays server-side.
export function supabaseData() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Supabase env not configured (NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY).");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
