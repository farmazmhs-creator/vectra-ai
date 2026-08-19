// Lightweight admin gate. The operator console holds lead PII, so it must be
// protected. Uses an HMAC-signed session token so the cookie can't be forged
// without the secret. The secret is ADMIN_PASSWORD, set in Vercel env.
//
// SECURITY: there is NO baked-in default password. If ADMIN_PASSWORD is unset
// the gate fails CLOSED — every login is rejected and no session cookie can
// validate — rather than falling back to a publicly-known value. Works in both
// the Node (server action) and Edge (middleware) runtimes via Web Crypto.

export const ADMIN_COOKIE = "vectra_admin";

// Returns the configured admin secret, or null when unset (-> fail closed).
function secret(): string | null {
  const s = process.env.ADMIN_PASSWORD;
  return s && s.length > 0 ? s : null;
}

async function hmacHex(message: string, key: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function expectedToken(): Promise<string> {
  const s = secret();
  if (!s) throw new Error("ADMIN_PASSWORD is not configured");
  return hmacHex("vectra-admin-session-v1", s);
}

// Constant-time password check: compare HMAC(pw-check, candidate) to HMAC(pw-check, secret).
// Avoids a short-circuiting `===` on the secret. Fails closed when unconfigured.
export async function checkPassword(pw: string): Promise<boolean> {
  const s = secret();
  if (!s) return false; // no ADMIN_PASSWORD set -> reject every login
  if (typeof pw !== "string" || pw.length === 0) return false;
  const a = await hmacHex("pw-check", pw);
  const b = await hmacHex("pw-check", s);
  let diff = a.length ^ b.length;
  for (let i = 0; i < a.length && i < b.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function isValidSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const s = secret();
  if (!s) return false; // no ADMIN_PASSWORD set -> no cookie can validate
  const expected = await hmacHex("vectra-admin-session-v1", s);
  // constant-ish comparison
  if (token.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < token.length; i++) diff |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}
