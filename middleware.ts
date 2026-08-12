import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { ADMIN_COOKIE, isValidSession } from "@/lib/auth/admin";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Gate the operator console (holds lead PII). /admin/login is public.
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    if (!(await isValidSession(token))) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
