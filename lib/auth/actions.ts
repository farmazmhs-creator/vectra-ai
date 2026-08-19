"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, checkPassword, expectedToken } from "./admin";
import { requireSameOrigin } from "./require";
import { rateLimit } from "@/lib/security/ratelimit";

export async function loginAdmin(_prev: unknown, formData: FormData): Promise<{ error?: string }> {
  try {
    await requireSameOrigin();
  } catch {
    return { error: "Invalid request. Please reload and try again." };
  }
  // Brute-force throttle (HMAC-hashed IP; generic error).
  const rl = await rateLimit("admin_login");
  if (rl !== "ok") {
    return { error: "Too many attempts. Please wait a few minutes and try again." };
  }
  const pw = String(formData.get("password") ?? "");
  if (!(await checkPassword(pw))) {
    return { error: "Incorrect password." };
  }
  const token = await expectedToken();
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  redirect("/admin");
}

export async function logoutAdmin(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}
