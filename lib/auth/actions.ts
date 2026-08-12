"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, checkPassword, expectedToken } from "./admin";

export async function loginAdmin(_prev: unknown, formData: FormData): Promise<{ error?: string }> {
  const pw = String(formData.get("password") ?? "");
  if (!checkPassword(pw)) {
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
