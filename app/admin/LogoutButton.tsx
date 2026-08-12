"use client";

import { logoutAdmin } from "@/lib/auth/actions";

export function LogoutButton() {
  return (
    <form action={logoutAdmin}>
      <button className="link-muted" style={{ fontSize: 14, background: "none", border: "none", cursor: "pointer" }}>
        Sign out
      </button>
    </form>
  );
}
