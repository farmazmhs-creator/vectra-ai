import Link from "next/link";
import { t, type Lang } from "@/lib/i18n";
import { LangToggle } from "./LangToggle";

export function Brand({ small = false }: { small?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 no-underline">
      <span
        className="grid place-items-center rounded-lg"
        style={{
          width: small ? 30 : 34,
          height: small ? 30 : 34,
          background: "linear-gradient(180deg, var(--accent-2), var(--accent))",
          color: "#0b0b14",
          fontWeight: 800,
        }}
      >
        V
      </span>
      <span className="leading-tight">
        <span className="block font-bold" style={{ color: "var(--text)", fontSize: small ? 15 : 17 }}>
          Vectra AI
        </span>
        <span className="block" style={{ color: "var(--muted-2)", fontSize: 11 }}>
          Farmaz Somu · AI Trainer
        </span>
      </span>
    </Link>
  );
}

export function SiteHeader({ lang = "en" }: { lang?: Lang }) {
  return (
    <header className="sticky top-0 z-30" style={{ background: "rgba(7,7,12,0.72)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--border)" }}>
      <div className="container-x flex items-center justify-between" style={{ height: 64 }}>
        <Brand />
        <nav className="hidden md:flex items-center gap-6 text-sm" style={{ color: "var(--muted)" }}>
          <a href="/#what-you-get" className="link-muted">{t(lang, "nav_what")}</a>
          <a href="/#how-it-works" className="link-muted">{t(lang, "nav_how")}</a>
          <a href="/#programmes" className="link-muted">{t(lang, "nav_programmes")}</a>
          <Link href="/admin" className="link-muted">{t(lang, "nav_admin")}</Link>
        </nav>
        <div className="flex items-center gap-3">
          <LangToggle lang={lang} />
          <Link href="/assessment" className="btn btn-primary" style={{ padding: "0.6rem 1rem", fontSize: 14 }}>
            {t(lang, "cta_start")}
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="hairline mt-24">
      <div className="container-x py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Brand small />
        <p className="text-xs" style={{ color: "var(--muted-2)", maxWidth: 520 }}>
          The AI Readiness / Capability Assessment is a diagnostic based on your submitted responses. It does not
          constitute an audit, compliance certification or guaranteed ROI assessment. © {new Date().getFullYear()} Farmaz Somu · AI Trainer.
        </p>
      </div>
    </footer>
  );
}

export function ScoreBar({ score, color }: { score: number; color?: string }) {
  const c = color ?? (score >= 65 ? "var(--green)" : score >= 45 ? "var(--gold)" : "var(--red)");
  return (
    <div className="bar-track">
      <div className="bar-fill" style={{ width: `${Math.max(3, score)}%`, background: c }} />
    </div>
  );
}
