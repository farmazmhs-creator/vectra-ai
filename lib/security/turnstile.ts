// SERVER-ONLY. Verifies a Cloudflare Turnstile token via the Siteverify API.
// TURNSTILE_SECRET_KEY is read only here, never returned to the client and never logged.
// Single-use + short-lived tokens are enforced by Cloudflare (a spent/expired token
// returns success:false -> "failed"). We additionally pin the action and an explicit
// hostname allowlist. Missing secret or missing hostname allowlist -> "misconfigured"
// (the caller fails CLOSED when Turnstile is enabled).

const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const EXPECTED_ACTION = "unlock";

export type TurnstileOutcome =
  | { ok: true }
  | { ok: false; reason: "misconfigured" | "missing-token" | "network-error" | "failed" };

interface SiteverifyResponse {
  success?: boolean;
  action?: string;
  hostname?: string;
  "error-codes"?: string[];
}

export async function verifyTurnstile(token: unknown): Promise<TurnstileOutcome> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const expectedHosts = (process.env.TURNSTILE_EXPECTED_HOSTNAME ?? "")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);

  // Enforcement requires BOTH the secret and an explicit hostname allowlist. If either
  // is absent while Turnstile is enabled, fail closed rather than accept anything.
  if (!secret || expectedHosts.length === 0) return { ok: false, reason: "misconfigured" };
  if (typeof token !== "string" || token.length < 10 || token.length > 4096) {
    return { ok: false, reason: "missing-token" };
  }

  let json: SiteverifyResponse;
  try {
    const body = new URLSearchParams();
    body.set("secret", secret);
    body.set("response", token);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    let res: Response;
    try {
      res = await fetch(SITEVERIFY, { method: "POST", body, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
    if (!res.ok) return { ok: false, reason: "network-error" };
    json = (await res.json()) as SiteverifyResponse;
  } catch {
    return { ok: false, reason: "network-error" };
  }

  if (json.success !== true) return { ok: false, reason: "failed" }; // invalid / expired / duplicate
  if (json.action !== EXPECTED_ACTION) return { ok: false, reason: "failed" }; // action mismatch
  const host = String(json.hostname ?? "").toLowerCase();
  if (!expectedHosts.includes(host)) return { ok: false, reason: "failed" }; // hostname mismatch
  return { ok: true };
}
