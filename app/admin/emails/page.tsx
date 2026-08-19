import { supabaseService } from "@/lib/supabase/service";
import { requireAdminSession } from "@/lib/auth/require";
import { AdminHeader } from "../AdminChrome";

export const dynamic = "force-dynamic";

const STATUS_COLOR: Record<string, string> = { sent: "var(--green)", queued: "var(--gold)", failed: "var(--red)" };

export default async function EmailsAdmin() {
  await requireAdminSession();
  const db = supabaseService();
  const { data: emails } = await db.from("email_log").select("*").order("created_at", { ascending: false }).limit(200);
  const list = emails ?? [];
  const configured = list.some((e) => e.provider === "resend");

  return (
    <div className="min-h-screen">
      <AdminHeader active="emails" />
      <div className="container-x py-8">
        <h1 className="text-2xl font-bold mb-1">Email log</h1>
        <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
          Every acknowledgement, result summary and trainer alert is recorded here.
        </p>
        {!configured && (
          <div className="panel-2 p-4 mb-6 text-sm" style={{ color: "var(--muted)", borderColor: "rgba(231,182,75,0.4)" }}>
            <strong style={{ color: "var(--gold)" }}>Sending not yet activated.</strong> Emails are being <b>queued</b> (recorded) but not delivered.
            To send for real, set <code>RESEND_API_KEY</code> (and optionally <code>EMAIL_FROM</code>, <code>TRAINER_EMAIL</code>) in Vercel → Settings → Environment Variables. No code change needed.
          </div>
        )}
        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: "var(--muted-2)", textAlign: "left" }}>
                  <th className="p-3 font-medium">When</th>
                  <th className="p-3 font-medium">Type</th>
                  <th className="p-3 font-medium">To</th>
                  <th className="p-3 font-medium">Subject</th>
                  <th className="p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {list.map((e) => (
                  <tr key={e.id} style={{ borderTop: "1px solid var(--border)" }}>
                    <td className="p-3" style={{ color: "var(--muted-2)", whiteSpace: "nowrap" }}>{new Date(e.created_at).toLocaleString()}</td>
                    <td className="p-3" style={{ color: "var(--muted)" }}>{e.type}</td>
                    <td className="p-3">{e.to_name ? <span>{e.to_name}<br /><span className="text-xs" style={{ color: "var(--muted-2)" }}>{e.to_email}</span></span> : e.to_email}</td>
                    <td className="p-3">{e.subject}</td>
                    <td className="p-3"><span className="badge" style={{ color: STATUS_COLOR[e.status] ?? "var(--muted)", borderColor: STATUS_COLOR[e.status] ?? "var(--border-2)" }}>{e.status}</span></td>
                  </tr>
                ))}
                {list.length === 0 && <tr><td colSpan={5} className="p-8 text-center" style={{ color: "var(--muted)" }}>No emails yet. Complete an assessment to generate one.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
