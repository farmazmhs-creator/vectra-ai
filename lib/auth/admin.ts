// Lightweight admin gate. The operator console holds lead PII, so it must be
// protected. Uses an HMAC-signed session token so the cookie can't be forged
// without the secret. The secret is ADMIN_PASSWORD (set in Vercel env) or a
// baked default that the owner can change. Works in both the Node (server
// action) and Edge (middleware) runtimes via Web Crypto.

export const ADMIN_COOKIE = "vectra_admin";

// Change this by setting ADMIN_PASSWORD in Vercel → Settings → Environment Variables.
const DEFAULT_ADMIN_PASSWORD = "VectraAdmin2026";

function secret(): string {
  return process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
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
  return hmacHex("vectra-admin-session-v1", secret());
}

export function checkPassword(pw: string): boolean {
  return typeof pw === "string" && pw.length > 0 && pw === secret();
}

export async function isValidSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const expected = await expectedToken();
  // constant-ish comparison
  if (token.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < token.length; i++) diff |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}
