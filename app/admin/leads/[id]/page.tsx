import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseService } from "@/lib/supabase/service";
import { requireAdminSession } from "@/lib/auth/require";
import { AdminHeader } from "../../AdminChrome";
import { LeadControls } from "./LeadControls";
import { DeleteLeadButton } from "./DeleteLeadButton";
import { QUESTIONS, optionLabels } from "@/lib/assessment/questions";
import type { Answers } from "@/lib/assessment/types";

export const dynamic = "force-dynamic";

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <div className="text-xs" style={{ color: "var(--muted-2)" }}>{label}</div>
      <div className="text-sm">{value}</div>
    </div>
  );
}

function renderAnswer(code: string, value: Answers[string]): string {
  const q = QUESTIONS.find((x) => x.code === code);
  if (!q) return String(value ?? "—");
  if (q.type === "single") {
    const opt = q.options?.find((o) => o.value === Number(value)) ?? q.options?.find((o) => o.code === value);
    return opt?.label ?? String(value ?? "—");
  }
  if (q.type === "multi" && Array.isArray(value)) return optionLabels(code, value).join(", ");
  return String(value ?? "—");
}

export default async function LeadDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireAdminSession();
  const db = supabaseService();
  const { data: lead } = await db.from("leads").select("*").eq("id", id).single();
  if (!lead) notFound();

  const [{ data: assessment }, { data: result }, { data: notes }] = await Promise.all([
    db.from("assessments").select("*").eq("lead_id", id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    db.from("results").select("*").eq("lead_id", id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    db.from("lead_notes").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
  ]);

  const answers = (assessment?.answers ?? {}) as Answers;
  const answeredQs = QUESTIONS.filter((q) => answers[q.code] !== undefined && answers[q.code] !== null && !(Array.isArray(answers[q.code]) && (answers[q.code] as string[]).length === 0));

  return (
    <div className="min-h-screen">
      <AdminHeader active="leads" />
      <div className="container-x py-8" style={{ maxWidth: 1000 }}>
        <Link href="/admin" className="link-muted text-sm">← All leads</Link>
        <div className="flex items-start justify-between mt-2 mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">{lead.full_name}</h1>
            <p className="text-sm" style={{ color: "var(--muted)" }}>{lead.position ?? ""}{lead.org_name ? ` · ${lead.org_name}` : ""}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {result && (
              <Link href={`/result/${result.id}`} className="btn btn-ghost" style={{ padding: "0.5rem 1rem", fontSize: 14 }}>
                View report ↗ ({result.overall_score} · {result.stage})
              </Link>
            )}
            <DeleteLeadButton leadId={lead.id} name={lead.full_name} />
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-5">
          <div className="grid gap-5">
            <div className="panel p-5">
              <h3 className="font-semibold mb-3">Profile</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Phone" value={lead.phone} />
                <Field label="Email" value={lead.email} />
                <Field label="Context" value={lead.user_context} />
                <Field label="Industry" value={lead.industry} />
                <Field label="Country / region" value={lead.country} />
                <Field label="Department" value={lead.department} />
                <Field label="Organisation size" value={lead.org_size} />
                <Field label="Training intent" value={lead.training_intent} />
                <Field label="Decision authority" value={lead.decision_authority} />
                <Field label="Preferred timing" value={lead.timing} />
                <Field label="Client details" value={lead.client_details} />
                <Field label="Assessment route" value={assessment?.route} />
              </div>
              <div className="text-xs mt-4" style={{ color: "var(--muted-2)" }}>
                Started {new Date(lead.created_at).toLocaleString()}
                {lead.kyc_completed_at ? ` · KYC completed ${new Date(lead.kyc_completed_at).toLocaleString()}` : " · KYC not completed"}
                {lead.result_viewed_at ? ` · Result viewed ${new Date(lead.result_viewed_at).toLocaleString()}` : ""}
              </div>
            </div>

            {answeredQs.length > 0 && (
              <div className="panel p-5">
                <h3 className="font-semibold mb-3">Assessment responses</h3>
                <div className="grid gap-2">
                  {answeredQs.map((q) => (
                    <div key={q.code} className="py-2" style={{ borderTop: "1px solid var(--border)" }}>
                      <div className="text-xs" style={{ color: "var(--muted-2)" }}>{q.code} · {q.prompt}</div>
                      <div className="text-sm">{q.type === "text" ? String(answers[q.code]) : renderAnswer(q.code, answers[q.code])}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <LeadControls
            leadId={lead.id}
            status={lead.lead_status}
            priority={lead.lead_priority}
            notes={(notes ?? []) as { id: string; body: string; author: string; created_at: string }[]}
          />
        </div>
      </div>
    </div>
  );
}
