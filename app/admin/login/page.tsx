"use client";

import { useActionState } from "react";
import { loginAdmin } from "@/lib/auth/actions";
import { Brand } from "@/app/components/Chrome";

export default function AdminLogin() {
  const [state, formAction, pending] = useActionState(loginAdmin, {});

  return (
    <div className="min-h-screen gradient-hero grid place-items-center p-6">
      <div className="panel p-8 w-full" style={{ maxWidth: 400 }}>
        <div className="mb-6"><Brand /></div>
        <span className="badge mb-3">Operator Console</span>
        <h1 className="text-2xl font-bold mb-1">Admin sign in</h1>
        <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
          This area holds lead and assessment data. Enter the admin password to continue.
        </p>
        <form action={formAction} className="grid gap-4">
          <div>
            <label className="field-label" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" className="input" autoFocus placeholder="••••••••" />
          </div>
          {state?.error && <div className="text-sm" style={{ color: "var(--red)" }}>{state.error}</div>}
          <button className="btn btn-primary" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
        </form>
      </div>
    </div>
  );
}
