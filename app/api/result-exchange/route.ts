import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { sha256hex } from "@/lib/security/crypto";
import { setResultCookie } from "@/lib/security/session";
import { rateLimit } from "@/lib/security/ratelimit";
import { supabaseService } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

const TOKEN_RE = /^[A-Za-z0-9_-]{20,120}$/;
const SECURE_HEADERS = { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" };

// Same-origin POST exchange: validates the bearer, sets an HttpOnly result-access cookie,
// returns only { ok, id }. Generic failure (never reveals whether a result exists). No token logging.
export async function POST(req: Request) {
  const h = await headers();
  const origin = h.get("origin");
  const host = h.get("host");
  const generic = NextResponse.json({ ok: false }, { headers: SECURE_HEADERS });

  try {
    if (!origin || !host || new URL(origin).host !== host) return generic;
  } catch {
    return generic;
  }

  const rl = await rateLimit("exchange");
  if (rl !== "ok") {
    return NextResponse.json({ ok: false, retry: true }, { status: 429, headers: SECURE_HEADERS });
  }

  let token = "";
  try {
    const body = (await req.json()) as { t?: unknown };
    token = typeof body?.t === "string" ? body.t : "";
  } catch {
    return generic;
  }
  if (!TOKEN_RE.test(token)) return generic;

  const hash = sha256hex(token);
  const db = supabaseService();
  const { data } = await db
    .from("results")
    .select("id")
    .eq("public_token_hash", hash)
    .is("public_token_revoked_at", null)
    .gt("public_token_expires_at", new Date().toISOString())
    .limit(1)
    .maybeSingle();

  if (!data?.id) return generic;
  await setResultCookie(data.id);
  return NextResponse.json({ ok: true, id: data.id }, { headers: SECURE_HEADERS });
}
