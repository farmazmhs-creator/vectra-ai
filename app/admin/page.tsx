import Link from "next/link";
import { supabaseService } from "@/lib/supabase/service";
import { requireAdminSession } from "@/lib/auth/require";
import { AdminHeader, StatusBadge } from "./AdminChrome";
import { EnquiryRow } from "./EnquiryRow";

export const dynamic = "force-dynamic";

function Stat({ label, value, tone }: { label: string; value: number | string; tone?: string }) {
  return (
    <div className="panel p-5">
      <div className="text-3xl font-extrabold" style={{ color: tone ?? "var(--text)" }}>{value}</div>
      <div className="text-sm" style={{ color: "var(--muted)" }}>{label}</div>
    </div>
  );
}

export default async function AdminHome() {
  await requireAdminSession();
  const db = supabaseService();
  const [{ data: leads }, { data: enquiries }, { data: results }] = await Promise.all([
    db.from("leads").select("*").order("created_at", { ascending: false }).limit(200),
    db.from("enquiries").select("*").order("created_at", { ascending: false }).limit(25),
    db.from("results").select("id, lead_id, overall_score, stage, route"),
  ]);

  const leadList = leads ?? [];
  const resById = new Map((results ?? []).map((r) => [r.lead_id, r]));
  const completed = leadList.filter((l) => l.kyc_completed_at).length;
  const highPriority = leadList.filter((l) => l.lead_priority === "high").length;
  const openEnq = (enquiries ?? []).filter((e) => e.status === "open").length;

  return (
    <div className="min-h-screen">
      <AdminHeader active="leads" />
      <div className="container-x py-8">
        <h1 className="text-2xl font-bold mb-1">Leads & pipeline</h1>
        <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>Every assessment start, KYC profile and commercial request lands here.</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Stat label="Total leads" value={leadList.length} />
          <Stat label="Completed assessments" value={completed} tone="var(--green)" />
          <Stat label="High-priority leads" value={highPriority} tone="var(--red)" />
          <Stat label="Open requests" value={openEnq} tone="var(--gold)" />
        </div>

        {enquiries && enquiries.length > 0 && (
          <div className="panel p-5 mb-8">
            <h2 className="font-semibold mb-3">Commercial requests</h2>
            <div className="grid gap-2">
              {enquiries.map((e) => <EnquiryRow key={e.id} enquiry={e} leadName={leadList.find((l) => l.id === e.lead_id)?.full_name ?? "—"} />)}
            </div>
          </div>
        )}

        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ color: "var(--muted-2)", textAlign: "left" }}>
                  <th className="p-3 font-medium">Name</th>
                  <th className="p-3 font-medium">Context</th>
                  <th className="p-3 font-medium">Score</th>
                  <th className="p-3 font-medium">Priority</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Created</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {leadList.map((l) => {
                  const r = resById.get(l.id);
                  return (
                    <tr key={l.id} style={{ borderTop: "1px solid var(--border)" }}>
                      <td className="p-3">
                        <div className="font-medium">{l.full_name}</div>
                        <div className="text-xs" style={{ color: "var(--muted-2)" }}>{l.email ?? l.phone}</div>
                      </td>
                      <td className="p-3" style={{ color: "var(--muted)" }}>
                        {l.org_name ? <div>{l.org_name}</div> : <div>{l.user_context ?? "—"}</div>}
                        <div className="text-xs" style={{ color: "var(--muted-2)" }}>{l.industry ?? ""}{l.department ? ` · ${l.department}` : ""}</div>
                      </td>
                      <td className="p-3">{r ? <span><b>{r.overall_score}</b> <span style={{ color: "var(--muted-2)" }}>· {r.stage}</span></span> : <span style={{ color: "var(--muted-2)" }}>incomplete</span>}</td>
                      <td className="p-3"><StatusBadge value={l.lead_priority} kind="priority" /></td>
                      <td className="p-3"><StatusBadge value={l.lead_status} kind="status" /></td>
                      <td className="p-3" style={{ color: "var(--muted-2)" }}>{new Date(l.created_at).toLocaleDateString()}</td>
                      <td className="p-3 text-right"><Link href={`/admin/leads/${l.id}`} className="btn btn-ghost" style={{ padding: "0.4rem 0.8rem", fontSize: 13 }}>Open</Link></td>
                    </tr>
                  );
                })}
                {leadList.length === 0 && (
                  <tr><td colSpan={7} className="p-8 text-center" style={{ color: "var(--muted)" }}>No leads yet. Take the <Link href="/assessment" className="link-muted" style={{ textDecoration: "underline" }}>assessment</Link> to create one.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
