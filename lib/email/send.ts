import { supabaseService } from "@/lib/supabase/service";

const FROM = process.env.EMAIL_FROM || "Farmaz Somu | AI Trainer <onboarding@resend.dev>";
const TRAINER_EMAIL = process.env.TRAINER_EMAIL || "farmazmhs@gmail.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://vectra-ai-sooty.vercel.app";

// Escape all user-controlled text before it enters an HTML email body.
function esc(s: unknown): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );
}

interface OutboundEmail {
  leadId?: string | null;
  resultId?: string | null; // when set, (result_id,type) is the idempotency key (outbox)
  to: string;
  toName?: string | null;
  type: "result_summary" | "result_resend" | "trainer_alert" | "enquiry_alert";
  subject: string;
  html: string;
}

// Records the email (the row is the idempotency key when resultId is set) and delivers via Resend
// when configured. Never throws. A unique (result_id,type) conflict means "already sent" → skip.
async function sendEmail(email: OutboundEmail): Promise<void> {
  const db = supabaseService();
  const key = process.env.RESEND_API_KEY || process.env.RESEND;
  const { data: row, error: insErr } = await db
    .from("email_log")
    .insert({
      lead_id: email.leadId ?? null,
      result_id: email.resultId ?? null,
      to_email: email.to,
      to_name: email.toName ?? null,
      type: email.type,
      subject: email.subject,
      body: email.html,
      status: key ? "sending" : "queued",
      attempts: key ? 1 : 0,
      last_attempt_at: key ? new Date().toISOString() : null,
    })
    .select("id")
    .maybeSingle();
  if (insErr || !row) return; // duplicate (already sent) or log failure → do not send
  if (!key) return; // queued; delivery not configured

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: email.to, subject: email.subject, html: email.html }),
    });
    await db
      .from("email_log")
      .update({ status: res.ok ? "sent" : "failed", provider: "resend", error: res.ok ? null : `${res.status} ${await res.text()}`.slice(0, 300) })
      .eq("id", row.id);
  } catch (e) {
    await db.from("email_log").update({ status: "failed", provider: "resend", error: String(e).slice(0, 300) }).eq("id", row.id);
  }
}

function shell(title: string, bodyHtml: string): string {
  return `<div style="font-family:Segoe UI,Arial,sans-serif;background:#f4f4f8;padding:24px">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e5ee">
    <div style="background:#12121d;color:#fff;padding:20px 24px">
      <div style="font-weight:800;font-size:18px">Vectra AI</div>
      <div style="color:#a48bff;font-size:12px">Farmaz Somu · AI Trainer</div>
    </div>
    <div style="padding:24px;color:#1c1c28;font-size:15px;line-height:1.55">
      <h1 style="font-size:20px;margin:0 0 12px">${esc(title)}</h1>
      ${bodyHtml}
    </div>
    <div style="padding:16px 24px;color:#8a8aa0;font-size:11px;border-top:1px solid #eee">
      This is a diagnostic based on submitted responses — not an audit or guaranteed ROI assessment.
    </div>
  </div>
</div>`;
}

interface LeadLike { id: string; full_name?: string | null; email?: string | null; phone?: string | null; org_name?: string | null; language?: string | null; lead_priority?: string | null; industry?: string | null; }
interface ResultLike { id: string; overall_score: number; stage: string; route: string; gaps?: { label: string }[]; }

// rawToken is the result bearer; the link uses a URL fragment so the token never hits server logs.
export async function emailResultToCustomer(lead: LeadLike, result: ResultLike, rawToken: string): Promise<void> {
  if (!lead.email) return;
  const bm = lead.language === "bm";
  const first = esc((lead.full_name ?? "").split(" ")[0] || (bm ? "anda" : "there"));
  const link = `${APP_URL}/r#t=${rawToken}`;
  const gaps = esc((result.gaps ?? []).slice(0, 2).map((g) => g.label).join(bm ? " dan " : " and ") || "—");
  const title = bm ? "Keputusan diagnostik AI anda" : "Your AI diagnostic results";
  const body = bm
    ? `<p>Hai ${first},</p>
       <p>Terima kasih kerana melengkapkan penilaian percuma. Skor kesediaan AI anda ialah <b>${esc(result.overall_score)}/100</b> — peringkat <b>${esc(result.stage)}</b>.</p>
       <p>Bidang keutamaan untuk penambahbaikan: <b>${gaps}</b>.</p>
       <p><a href="${link}" style="display:inline-block;background:#7c6cff;color:#0b0b14;font-weight:700;padding:10px 18px;border-radius:8px;text-decoration:none">Lihat laporan penuh &amp; TNA →</a></p>
       <p>Balas e-mel ini untuk membincangkan keputusan anda atau meminta cadangan tersuai.</p>`
    : `<p>Hi ${first},</p>
       <p>Thanks for completing the free assessment. Your AI readiness score is <b>${esc(result.overall_score)}/100</b> — the <b>${esc(result.stage)}</b> stage.</p>
       <p>Priority areas for improvement: <b>${gaps}</b>.</p>
       <p><a href="${link}" style="display:inline-block;background:#7c6cff;color:#0b0b14;font-weight:700;padding:10px 18px;border-radius:8px;text-decoration:none">View your full report &amp; TNA →</a></p>
       <p>Reply to this email to discuss your results or request a tailored proposal.</p>`;
  await sendEmail({ leadId: lead.id, resultId: result.id, to: lead.email, toName: lead.full_name, type: "result_summary", subject: title, html: shell(title, body) });
}

// Deliberate admin resend with a freshly rotated bearer. Logged as a distinct 'result_resend'
// event (no outbox dedup) so it always delivers and stays auditable.
export async function emailResultResend(lead: LeadLike, result: ResultLike, rawToken: string): Promise<void> {
  if (!lead.email) return;
  const bm = lead.language === "bm";
  const first = esc((lead.full_name ?? "").split(" ")[0] || (bm ? "anda" : "there"));
  const link = `${APP_URL}/r#t=${rawToken}`;
  const title = bm ? "Pautan laporan AI anda (dihantar semula)" : "Your AI report link (resent)";
  const body = bm
    ? `<p>Hai ${first},</p><p>Berikut pautan selamat terkini untuk laporan diagnostik AI anda.</p>
       <p><a href="${link}" style="display:inline-block;background:#7c6cff;color:#0b0b14;font-weight:700;padding:10px 18px;border-radius:8px;text-decoration:none">Lihat laporan saya →</a></p>`
    : `<p>Hi ${first},</p><p>Here is your latest secure link to your AI diagnostic report.</p>
       <p><a href="${link}" style="display:inline-block;background:#7c6cff;color:#0b0b14;font-weight:700;padding:10px 18px;border-radius:8px;text-decoration:none">View my report →</a></p>`;
  await sendEmail({ leadId: lead.id, to: lead.email, toName: lead.full_name, type: "result_resend", subject: title, html: shell(title, body) });
}

export async function emailLeadAlertToTrainer(lead: LeadLike, result: ResultLike): Promise<void> {
  const link = `${APP_URL}/admin/leads/${lead.id}`;
  const title = `New ${lead.lead_priority === "high" ? "HIGH-PRIORITY " : ""}lead: ${esc(lead.full_name ?? "—")}`;
  const body = `<p><b>${esc(lead.full_name ?? "—")}</b>${lead.org_name ? ` · ${esc(lead.org_name)}` : ""}${lead.industry ? ` · ${esc(lead.industry)}` : ""}</p>
     <p>Score <b>${esc(result.overall_score)}/100</b> · ${esc(result.stage)} · ${esc(result.route)}</p>
     <p>📧 ${esc(lead.email ?? "—")} · 📞 ${esc(lead.phone ?? "—")} · priority: <b>${esc(lead.lead_priority)}</b></p>
     <p><a href="${link}" style="display:inline-block;background:#12121d;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">Open in operator console →</a></p>`;
  await sendEmail({ leadId: lead.id, resultId: result.id, to: TRAINER_EMAIL, toName: "Farmaz Somu", type: "trainer_alert", subject: title, html: shell(title, body) });
}

export async function emailEnquiryAlertToTrainer(lead: LeadLike | null, type: string, message?: string | null, preferredTime?: string | null): Promise<void> {
  const t = esc(type);
  const title = `New ${t} request${lead?.full_name ? ` from ${esc(lead.full_name)}` : ""}`;
  const link = lead ? `${APP_URL}/admin/leads/${lead.id}` : `${APP_URL}/admin`;
  const body = `<p>A <b>${t}</b> request has come in${lead?.full_name ? ` from <b>${esc(lead.full_name)}</b>` : ""}.</p>
     ${preferredTime ? `<p>Preferred time: ${esc(preferredTime)}</p>` : ""}
     ${message ? `<p>Message: “${esc(message)}”</p>` : ""}
     <p>📧 ${esc(lead?.email ?? "—")} · 📞 ${esc(lead?.phone ?? "—")}</p>
     <p><a href="${link}" style="display:inline-block;background:#12121d;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">Open in operator console →</a></p>`;
  await sendEmail({ leadId: lead?.id ?? null, to: TRAINER_EMAIL, toName: "Farmaz Somu", type: "enquiry_alert", subject: title, html: shell(title, body) });
}
