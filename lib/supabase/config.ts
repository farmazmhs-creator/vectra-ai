// Publishable Supabase connection details for the Vectra AI project.
// The anon/publishable key is designed to be exposed to the browser and is
// protected by row-level security — it is NOT a secret. Prefer the Vercel env
// vars when present; fall back to the known project values so the app connects
// even when env is not injected (e.g. a fresh Vercel project).
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ixntuhbfsgockxejoxdv.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4bnR1aGJmc2dvY2t4ZWpveGR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwOTI0NDAsImV4cCI6MjEwMTY2ODQ0MH0.9mHz9hYZXpfz9B8R27XqrzwyC1u1y8wXA_LbbyZf2m0";
