import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";

export function sha256hex(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

export function hmacHex(secret: string, message: string): string {
  return createHmac("sha256", secret).update(message).digest("hex");
}

// URL-safe token; default 32 bytes = 256 bits of entropy.
export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

// Constant-time comparison of two hex strings.
export function timingSafeEqualHex(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
  } catch {
    return false;
  }
}
