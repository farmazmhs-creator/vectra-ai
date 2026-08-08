import Link from "next/link";
import { Brand } from "@/app/components/Chrome";

export function AdminHeader({ active }: { active?: "leads" | "programmes" }) {
  return (
    <header className="sticky top-0 z-30" style={{ background: "rgba(7,7,12,0.8)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--border)" }}>
      <div className="container-x flex items-center justify-between" style={{ height: 64 }}>
        <div className="flex items-center gap-5">
          <Brand small />
          <span className="badge">Operator Console</span>
        </div>
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/admin" className={active === "leads" ? "" : "link-muted"} style={active === "leads" ? { color: "var(--text)", fontWeight: 600 } : {}}>Leads</Link>
          <Link href="/admin/programmes" className={active === "programmes" ? "" : "link-muted"} style={active === "programmes" ? { color: "var(--text)", fontWeight: 600 } : {}}>Programmes</Link>
          <Link href="/" className="link-muted">View site ↗</Link>
        </nav>
      </div>
    </header>
  );
}

export function StatusBadge({ value, kind }: { value: string; kind: "status" | "priority" }) {
  const map: Record<string, string> = {
    // status
    new: "var(--accent-2)", contacted: "var(--muted)", qualified: "var(--green)", proposal: "var(--gold)", booked: "var(--green)", closed: "var(--muted-2)",
    // priority
    high: "var(--red)", standard: "var(--muted)", low: "var(--muted-2)",
  };
  const color = map[value] ?? "var(--muted)";
  return <span className="badge" style={{ color, borderColor: color, textTransform: "capitalize" }}>{kind === "priority" ? `${value} priority` : value}</span>;
}
