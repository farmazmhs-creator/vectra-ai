"use client";

import { useEffect, useState } from "react";
import { createEnquiry, markResultViewed } from "@/lib/assessment/actions";
import { t, type Lang } from "@/lib/i18n";

export default function ResultActions({ leadId, resultId, lang }: { leadId: string; resultId: string; lang: Lang }) {
  const [open, setOpen] = useState<null | "proposal" | "consultation">(null);
  const [message, setMessage] = useState("");
  const [time, setTime] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const bm = lang === "bm";
  const tr = (k: Parameters<typeof t>[1]) => t(lang, k);

  useEffect(() => { markResultViewed(leadId).catch(() => {}); }, [leadId]);

  async function submit(type: "proposal" | "consultation") {
    setBusy(true);
    try {
      await createEnquiry({ leadId, resultId, type, message, preferred_time: time });
      setDone(
        type === "consultation"
          ? (bm ? "Terima kasih — permintaan perundingan anda telah diterima. Farmaz akan menghubungi anda untuk mengesahkan masa." : "Thank you — your consultation request has been received. Farmaz will be in touch to confirm a time.")
          : (bm ? "Terima kasih — permintaan cadangan tersuai anda telah diterima. Anda akan dihubungi tidak lama lagi." : "Thank you — your tailored proposal request has been received. You'll hear back shortly."),
      );
      setOpen(null);
    } catch {
      setDone(bm ? "Sesuatu tidak kena semasa menghantar permintaan anda. Sila cuba lagi." : "Something went wrong sending your request. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel p-6 sm:p-8" style={{ background: "linear-gradient(180deg, rgba(124,108,255,0.10), var(--panel))" }}>
      <p className="kicker mb-2">{tr("next_step_kicker")}</p>
      <h2 className="text-2xl font-bold mb-2">{tr("next_step_title")}</h2>
      <p style={{ color: "var(--muted)" }} className="mb-5">{tr("next_step_sub")}</p>

      {done ? (
        <div className="panel-2 p-4" style={{ borderColor: "rgba(67,209,158,0.4)", color: "var(--green)" }}>{done}</div>
      ) : open ? (
        <div className="panel-2 p-5">
          <label className="field-label">
            {open === "consultation" ? (bm ? "Hari / masa pilihan untuk panggilan" : "Preferred day / time for a call") : (bm ? "Apa-apa yang anda mahu cadangan ini liputi?" : "Anything you'd like the proposal to cover?")}
          </label>
          {open === "consultation" && (
            <input className="input mb-3" value={time} onChange={(e) => setTime(e.target.value)} placeholder={bm ? "cth. Pagi hari bekerja, minggu depan" : "e.g. Weekday mornings, next week"} />
          )}
          <textarea className="textarea" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={bm ? "Konteks pilihan…" : "Optional context…"} />
          <div className="flex gap-3 mt-4">
            <button className="btn btn-ghost" onClick={() => setOpen(null)} disabled={busy}>{bm ? "Batal" : "Cancel"}</button>
            <button className="btn btn-primary flex-1" onClick={() => submit(open)} disabled={busy}>
              {busy ? (bm ? "Menghantar…" : "Sending…") : open === "consultation" ? (bm ? "Minta perundingan saya" : "Request my consultation") : (bm ? "Hantar permintaan cadangan saya" : "Send my proposal request")}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3 no-print">
          <button className="btn btn-gold flex-1" onClick={() => setOpen("consultation")}>{tr("cta_book")}</button>
          <button className="btn btn-primary flex-1" onClick={() => setOpen("proposal")}>{tr("cta_proposal")}</button>
        </div>
      )}
    </div>
  );
}
