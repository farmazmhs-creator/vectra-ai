"use client";

import { useState, useTransition } from "react";
import { deleteLead } from "@/lib/admin/actions";

export function DeleteLeadButton({ leadId, name }: { leadId: string; name: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, start] = useTransition();

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs" style={{ color: "var(--muted)" }}>Delete {name}?</span>
        <button
          className="btn"
          style={{ padding: "0.4rem 0.8rem", fontSize: 13, background: "var(--red)", color: "#2a0a0f" }}
          disabled={pending}
          onClick={() => start(() => deleteLead(leadId))}
        >
          {pending ? "Deleting…" : "Yes, delete"}
        </button>
        <button className="btn btn-ghost" style={{ padding: "0.4rem 0.8rem", fontSize: 13 }} disabled={pending} onClick={() => setConfirming(false)}>
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      className="btn btn-ghost"
      style={{ padding: "0.5rem 1rem", fontSize: 14, borderColor: "rgba(255,107,125,0.4)", color: "var(--red)" }}
      onClick={() => setConfirming(true)}
    >
      Delete lead
    </button>
  );
}
