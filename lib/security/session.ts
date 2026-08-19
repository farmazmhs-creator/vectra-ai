import { cookies } from "next/headers";
import { hmacHex, timingSafeEqualHex } from "./crypto";

// Assessment session credential cookie (raw token; DB stores only its sha256 hash).
export const ASMT_COOKIE = "vec_asmt";
export const ASMT_TTL_SECONDS = 2 * 60 * 60; // 2 hours

// Result-access cookie (HMAC-signed, bound to a result id; never contains the bearer token or PII).
export const RES_COOKIE = "vec_res";
export const RES_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

function resultSecret(): string {
  const s = process.env.RESULT_COOKIE_SECRET;
  if (!s) throw new Error("RESULT_COOKIE_SECRET is not configured (server-only).");
  return s;
}

export async function setAssessmentCookie(rawToken: string): Promise<void> {
  const store = await cookies();
  store.set(ASMT_COOKIE, rawToken, {
    httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: ASMT_TTL_SECONDS,
  });
}

export async function getAssessmentToken(): Promise<string | undefined> {
  return (await cookies()).get(ASMT_COOKIE)?.value;
}

// Signed payload: "1.<resultId>.<expMs>.<hmac>"
export async function setResultCookie(resultId: string): Promise<void> {
  const exp = Date.now() + RES_TTL_SECONDS * 1000;
  const payload = `1.${resultId}.${exp}`;
  const sig = hmacHex(resultSecret(), payload);
  const store = await cookies();
  store.set(RES_COOKIE, `${payload}.${sig}`, {
    httpOnly: true, secure: true, sameSite: "lax", path: "/result", maxAge: RES_TTL_SECONDS,
  });
}

export async function resultCookieAuthorises(resultId: string): Promise<boolean> {
  const raw = (await cookies()).get(RES_COOKIE)?.value;
  if (!raw) return false;
  const parts = raw.split(".");
  if (parts.length !== 4) return false;
  const [v, rid, expStr, sig] = parts;
  if (v !== "1") return false;
  const payload = `${v}.${rid}.${expStr}`;
  if (!timingSafeEqualHex(hmacHex(resultSecret(), payload), sig)) return false;
  if (rid !== resultId) return false;
  const exp = Number(expStr);
  return Number.isFinite(exp) && exp > Date.now();
}
