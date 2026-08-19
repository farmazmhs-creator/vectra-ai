import { headers } from "next/headers";
import { ipAddress } from "@vercel/functions";
import { hmacHex } from "./crypto";
import { supabaseService } from "@/lib/supabase/service";

type Action = "start" | "unlock" | "consult" | "exchange" | "admin_login";

// Conservative defaults; overridable via server-only env (not hardcoded across the app).
const LIMITS: Record<Action, { limit: number; window: number }> = {
  start: { limit: Number(process.env.RL_START ?? 20), window: 600 },
  unlock: { limit: Number(process.env.RL_UNLOCK ?? 5), window: 600 },
  consult: { limit: Number(process.env.RL_CONSULT ?? 5), window: 3600 },
  exchange: { limit: Number(process.env.RL_EXCHANGE ?? 30), window: 600 },
  admin_login: { limit: Number(process.env.RL_ADMIN ?? 5), window: 900 },
};

// IP is an abuse-control signal only, never identity. Raw IP is HMAC'd, never stored/logged.
async function bucketFor(action: Action): Promise<string> {
  const salt = process.env.RATE_LIMIT_SALT;
  let ipHash = "noip";
  try {
    const h = await headers();
    const req = new Request("https://rl.local", { headers: new Headers(Object.fromEntries(h.entries())) });
    const ip = ipAddress(req);
    if (ip && salt) ipHash = hmacHex(salt, ip.toLowerCase());
  } catch {
    ipHash = "noip";
  }
  return `${action}:${ipHash}`;
}

export type RateOutcome = "ok" | "blocked" | "error";

export async function rateLimit(action: Action): Promise<RateOutcome> {
  const { limit, window } = LIMITS[action];
  try {
    const bucket = await bucketFor(action);
    const db = supabaseService();
    if (Math.random() < 0.01) {
      try { await db.rpc("rate_limit_purge", { p_max_age_seconds: 86400 }); } catch { /* best effort */ }
    }
    const { data, error } = await db.rpc("rate_limit_hit", {
      p_bucket: bucket, p_limit: limit, p_window_seconds: window,
    });
    if (error) return "error";
    return data === true ? "ok" : "blocked";
  } catch {
    return "error";
  }
}
