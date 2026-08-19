import { cookies, headers } from "next/headers";
import { ADMIN_COOKIE, isValidSession } from "./admin";

export async function isAdmin(): Promise<boolean> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  return isValidSession(token);
}

// Every privileged server action / admin data-fn calls this BEFORE any service-role DB access.
// Middleware is a navigation convenience only — this is the security boundary.
export async function requireAdminSession(): Promise<void> {
  if (!(await isAdmin())) throw new Error("unauthorized");
}

// Same-origin guard for state-changing admin operations (defence-in-depth alongside Next's own check).
export async function requireSameOrigin(): Promise<void> {
  const h = await headers();
  const origin = h.get("origin");
  const host = h.get("host");
  if (!origin || !host) throw new Error("bad_origin");
  try {
    if (new URL(origin).host !== host) throw new Error("bad_origin");
  } catch {
    throw new Error("bad_origin");
  }
}
