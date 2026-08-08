"use client";

import { useState, useTransition } from "react";
import { updateEnquiry } from "@/lib/admin/actions";

interface Enquiry {
  id: string;
  type: string;
  message: string | null;
  preferred_time: string | null;
  status: string;
  created_at: string;
}

export function EnquiryRow({ enquiry, leadName }: { enquiry: Enquiry; leadName: string }) {
  const [status, setStatus] = useState(enquiry.status);
  const [pending, start] = useTransition();

  function cycle() {
    const next = status === "open" ? "actioned" : status === "actioned" ? "closed" : "open";
    setStatus(next);
    start(() => updateEnquiry(enquiry.id, next));
  }

  const tone = enquiry.type === "consultation" ? "var(--green)" : enquiry.type === "proposal" ? "var(--gold)" : "var(--muted)";

  return (
    <div className="panel-2 p-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="badge" style={{ color: tone, textTransform: "capitalize" }}>{enquiry.type}</span>
          <span className="font-medium truncate">{leadName}</span>
        </div>
        {(enquiry.message || enquiry.preferred_time) && (
          <div className="text-xs mt-1 truncate" style={{ color: "var(--muted)" }}>
            {enquiry.preferred_time ? `⏰ ${enquiry.preferred_time} · ` : ""}{enquiry.message}
          </div>
        )}
      </div>
      <button className="btn btn-ghost" style={{ padding: "0.35rem 0.75rem", fontSize: 12, textTransform: "capitalize", opacity: pending ? 0.6 : 1 }} onClick={cycle}>
        {status}
      </button>
    </div>
  );
}
