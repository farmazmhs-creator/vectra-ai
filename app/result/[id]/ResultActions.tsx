"use client";

import { useEffect, useState } from "react";
import { createEnquiry, markResultViewed } from "@/lib/assessment/actions";

export default function ResultActions({ leadId, resultId }: { leadId: string; resultId: string }) {
  const [open, setOpen] = useState<null | "proposal" | "consultation">(null);
  const [message, setMessage] = useState("");
  const [time, setTime] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    markResultViewed(leadId).catch(() => {});
  }, [leadId]);

  async function submit(type: "proposal" | "consultation") {
    setBusy(true);
    try {
      await createEnquiry({ leadId, resultId, type, message, preferred_time: time });
      setDone(
        type === "consultation"
          ? "Thank you — your consultation request has been received. Farmaz will be in touch to confirm a time."
          : "Thank you — your tailored proposal request has been received. You&apos;ll hear back shortly.",
      );
      setOpen(null);
    } catch {
      setDone("Something went wrong sending your request. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel p-6 sm:p-8" style={{ background: "linear-gradient(180deg, rgba(124,108,255,0.10), var(--panel))" }}>
      <p className="kicker mb-2">Your next step</p>
      <h2 className="text-2xl font-bold mb-2">Discuss my results & explore my training recommendation</h2>
      <p style={{ color: "var(--muted)" }} className="mb-5">
        Turn this diagnostic into a concrete plan. Book a discovery call or request a tailored proposal mapped to your gaps —
        no obligation.
      </p>

      {done ? (
        <div className="panel-2 p-4" style={{ borderColor: "rgba(67,209,158,0.4)", color: "var(--green)" }}>{done}</div>
      ) : open ? (
        <div className="panel-2 p-5">
          <label className="field-label">
            {open === "consultation" ? "Preferred day / time for a call" : "Anything you'd like the proposal to cover?"}
          </label>
          {open === "consultation" && (
            <input className="input mb-3" value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g. Weekday mornings, next week" />
          )}
          <textarea className="textarea" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Optional context…" />
          <div className="flex gap-3 mt-4">
            <button className="btn btn-ghost" onClick={() => setOpen(null)} disabled={busy}>Cancel</button>
            <button className="btn btn-primary flex-1" onClick={() => submit(open)} disabled={busy}>
              {busy ? "Sending…" : open === "consultation" ? "Request my consultation" : "Send my proposal request"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="btn btn-gold flex-1" onClick={() => setOpen("consultation")}>Book a Consultation</button>
          <button className="btn btn-primary flex-1" onClick={() => setOpen("proposal")}>Request a Tailored Proposal</button>
        </div>
      )}
    </div>
  );
}
