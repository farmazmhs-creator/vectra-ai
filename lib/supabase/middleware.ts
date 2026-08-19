import { NextResponse, type NextRequest } from "next/server";

// The app does not use Supabase Auth sessions, so middleware simply passes the
// request through. (Admin gating happens in the root middleware.)
export async function updateSession(request: NextRequest) {
  return NextResponse.next({ request });
}
