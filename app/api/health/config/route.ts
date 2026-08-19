import { NextResponse } from "next/server";

// Gate-1 verification only: reports PRESENCE (booleans) of required server-only
// secrets — never their values. Temporary; removed after Gate 1 is confirmed.
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    {
      service_role: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      rate_limit_salt: Boolean(process.env.RATE_LIMIT_SALT),
      result_cookie_secret: Boolean(process.env.RESULT_COOKIE_SECRET),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
