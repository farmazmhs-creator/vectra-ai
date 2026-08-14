import { supabaseData } from "@/lib/supabase/data";

const FROM = process.env.EMAIL_FROM || "Farmaz Somu | AI Trainer <onboarding@resend.dev>";
const TRAINER_EMAIL = process.env.TRAINER_EMAIL || "farmazai1502@gmail.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://vectra-ai-sooty.vercel.app";

export interface OutboundEmail {
  leadId?: string | null;
  to: string;
  toName?: string | null;
  type: "acknowledgement" | "result_summary" | "trainer_alert" | "enquiry_alert";
  subject: string;
  html: string;
}

// Logs the email (always) and sends it via Resend when RESEND_API_KEY is set.
// Never throws — email problems must not break the core flow.
export async function sendEmail(email: OutboundEmail): Promise<void> {
  const db = supabaseData();
  // Accept either RESEND_API_KEY (canonical) or RESEND, to be forgiving of setup.
  const key = process.env.RESEND_API_KEY || process.env.RESEND;
  let status = "queued";
  let provider: string | null = null;
  let error: string | null = null;

  if (key) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: FROM, to: email.to, subject: email.subject, html: email.html }),
      });
      provider = "resend";
      if (res.ok) status = "sent";
      else { status = "failed"; error = `${res.status} ${await res.text()}`.slice(0, 500); }
    } catch (e) {
      status = "failed";
      provider = "resend";
      error = (e instanceof Error ? e.message : String(e)).slice(0, 500);
    }
  }

  try {
    await db.from("email_log").insert({
      lead_id: email.leadId ?? null,
      to_email: email.to,
      to_name: email.toName ?? null,
      type: email.type,
      subject: email.subject,
      body: email.html,
      status,
      provider,
      error,
    });
  } catch {
    // logging failure must not break the flow
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
      <h1 style="font-size:20px;margin:0 0 12px">${title}</h1>
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

export async function emailResultToCustomer(lead: LeadLike, result: ResultLike): Promise<void> {
  if (!lead.email) return;
  const bm = lead.language === "bm";
  const first = (lead.full_name ?? "").split(" ")[0] || (bm ? "anda" : "there");
  const link = `${APP_URL}/result/${result.id}`;
  const gaps = (result.gaps ?? []).slice(0, 2).map((g) => g.label).join(bm ? " dan " : " and ");
  const title = bm ? `Keputusan diagnostik AI anda` : `Your AI diagnostic results`;
  const body = bm
    ? `<p>Hai ${first},</p>
       <p>Terima kasih kerana melengkapkan penilaian percuma. Skor kesediaan AI anda ialah <b>${result.overall_score}/100</b> — peringkat <b>${result.stage}</b>.</p>
       <p>Bidang keutamaan untuk penambahbaikan: <b>${gaps || "—"}</b>.</p>
       <p><a href="${link}" style="display:inline-block;background:#7c6cff;color:#0b0b14;font-weight:700;padding:10px 18px;border-radius:8px;text-decoration:none">Lihat laporan penuh & TNA →</a></p>
       <p>Balas e-mel ini untuk membincangkan keputusan anda atau meminta cadangan tersuai.</p>`
    : `<p>Hi ${first},</p>
       <p>Thanks for completing the free assessment. Your AI readiness score is <b>${result.overall_score}/100</b> — the <b>${result.stage}</b> stage.</p>
       <p>Priority areas for improvement: <b>${gaps || "—"}</b>.</p>
       <p><a href="${link}" style="display:inline-block;background:#7c6cff;color:#0b0b14;font-weight:700;padding:10px 18px;border-radius:8px;text-decoration:none">View your full report & TNA →</a></p>
       <p>Reply to this email to discuss your results or request a tailored proposal.</p>`;
  await sendEmail({ leadId: lead.id, to: lead.email, toName: lead.full_name, type: "result_summary", subject: title, html: shell(title, body) });
}

export async function emailLeadAlertToTrainer(lead: LeadLike, result: ResultLike): Promise<void> {
  const link = `${APP_URL}/admin/leads/${lead.id}`;
  const title = `New ${lead.lead_priority === "high" ? "🔴 HIGH-PRIORITY " : ""}lead: ${lead.full_name ?? "—"}`;
  const body = `<p><b>${lead.full_name ?? "—"}</b>${lead.org_name ? ` · ${lead.org_name}` : ""}${lead.industry ? ` · ${lead.industry}` : ""}</p>
     <p>Score <b>${result.overall_score}/100</b> · ${result.stage} · ${result.route}</p>
     <p>📧 ${lead.email ?? "—"} · 📞 ${lead.phone ?? "—"} · priority: <b>${lead.lead_priority}</b></p>
     <p><a href="${link}" style="display:inline-block;background:#12121d;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">Open in operator console →</a></p>`;
  await sendEmail({ leadId: lead.id, to: TRAINER_EMAIL, toName: "Farmaz Somu", type: "trainer_alert", subject: title, html: shell(title, body) });
}

export async function emailEnquiryAlertToTrainer(lead: LeadLike | null, type: string, message?: string | null, preferredTime?: string | null): Promise<void> {
  const title = `New ${type} request${lead?.full_name ? ` from ${lead.full_name}` : ""}`;
  const link = lead ? `${APP_URL}/admin/leads/${lead.id}` : `${APP_URL}/admin`;
  const body = `<p>A <b>${type}</b> request has come in${lead?.full_name ? ` from <b>${lead.full_name}</b>` : ""}.</p>
     ${preferredTime ? `<p>Preferred time: ${preferredTime}</p>` : ""}
     ${message ? `<p>Message: “${message}”</p>` : ""}
     <p>📧 ${lead?.email ?? "—"} · 📞 ${lead?.phone ?? "—"}</p>
     <p><a href="${link}" style="display:inline-block;background:#12121d;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">Open in operator console →</a></p>`;
  await sendEmail({ leadId: lead?.id ?? null, to: TRAINER_EMAIL, toName: "Farmaz Somu", type: "enquiry_alert", subject: title, html: shell(title, body) });
}
