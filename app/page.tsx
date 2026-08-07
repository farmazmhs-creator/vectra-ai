import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/app/components/Chrome";
import { getProgrammes } from "@/lib/data/programmes";

export const dynamic = "force-dynamic";

function CTA({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="text-center my-10">
      <Link href="/assessment" className="btn btn-gold" style={{ fontSize: 16, padding: "0.95rem 1.75rem" }}>
        {label}
      </Link>
      {sub && <div className="text-xs mt-3" style={{ color: "var(--muted-2)" }}>{sub}</div>}
    </div>
  );
}

const VALUE_TILES = [
  ["Your AI capability score", "A clear 0–100 readiness score with your maturity stage."],
  ["Dimension-by-dimension analysis", "See exactly where you're strong and where the gaps are, across 8 dimensions."],
  ["Strengths & priority gaps", "Evidence-backed, not guesswork — and what's actually trainable."],
  ["AI investment & utilisation review", "Are your licensed tools underused? Shadow-AI risk? We flag it."],
  ["Instant TNA Snapshot", "An HRD Corp-structured Training Needs Analysis you can act on."],
  ["Opportunity Horizon", "What stronger capability could unlock — mapped to your outcomes."],
  ["Training recommendations", "Gap → programme → intended capability. No arbitrary course promotion."],
  ["A 30–90 day capability path", "A practical roadmap, ready for an internal discussion."],
];

const HOW = [
  ["1", "Answer", "5–7 minutes of structured questions. No essays — mostly tap and select."],
  ["2", "Unlock", "Tell us a little about your context to unlock your personalised results."],
  ["3", "Get results", "Your instant diagnostic, TNA snapshot and recommendations — on screen, immediately."],
  ["4", "Take action", "Discuss your results or request a tailored proposal. No obligation."],
];

const WHY = [
  ["Decision clarity", "Know where you stand before you invest in training."],
  ["Training-fit confidence", "Recommendations traceable to real, identified needs."],
  ["Time & resource efficiency", "A defensible TNA in minutes, not weeks of internal analysis."],
  ["Next-step planning", "Evidence for internal training discussions and budget decisions."],
];

export default async function Home() {
  let programmes: Awaited<ReturnType<typeof getProgrammes>> = [];
  try {
    programmes = await getProgrammes(true);
  } catch {
    programmes = [];
  }

  return (
    <div>
      <SiteHeader />

      {/* HERO */}
      <section className="gradient-hero">
        <div className="container-x py-16 sm:py-24 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <span className="badge badge-free mb-5">100% FREE · 5–7 minutes · Instant results</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.05] tracking-tight mb-5">
              Where does your <span style={{ color: "var(--accent-2)" }}>AI capability</span> really stand?
            </h1>
            <p className="text-lg mb-8" style={{ color: "var(--muted)", maxWidth: 560 }}>
              Get a credible AI readiness diagnostic for yourself, your team or your organisation — with an instant
              HRD Corp-structured TNA snapshot and a clear training pathway. Built for L&D, Talent, HR and decision-makers.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/assessment" className="btn btn-primary" style={{ fontSize: 16, padding: "0.95rem 1.75rem" }}>
                Start My FREE Assessment
              </Link>
              <span className="text-sm" style={{ color: "var(--gold)" }}>↖ It&apos;s completely FREE — no payment, no obligation.</span>
            </div>
          </div>

          {/* Result preview card */}
          <div className="panel p-6" style={{ boxShadow: "0 30px 80px -40px rgba(124,108,255,0.6)" }}>
            <div className="flex items-center justify-between mb-4">
              <span className="kicker">Sample result</span>
              <span className="badge">Instant</span>
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-4 items-center mb-4">
              <div className="panel-2 p-4 text-center" style={{ minWidth: 96 }}>
                <div className="text-4xl font-extrabold" style={{ color: "var(--gold)" }}>58</div>
                <div className="text-[11px]" style={{ color: "var(--muted-2)" }}>/ 100</div>
              </div>
              <div>
                <div className="badge mb-2" style={{ color: "var(--gold)", borderColor: "rgba(231,182,75,0.4)" }}>Developing</div>
                <p className="text-sm" style={{ color: "var(--muted)" }}>Useful adoption exists, but repeatability and governance remain uneven.</p>
              </div>
            </div>
            <div className="grid gap-2">
              {[["Practical competency", 68], ["Adoption & usage", 55], ["Workflow integration", 40], ["Governance", 45]].map(([l, v]) => (
                <div key={l as string} className="flex items-center gap-3">
                  <span className="text-xs w-32" style={{ color: "var(--muted-2)" }}>{l}</span>
                  <div className="bar-track flex-1"><div className="bar-fill" style={{ width: `${v}%`, background: (v as number) >= 60 ? "var(--green)" : "var(--gold)" }} /></div>
                </div>
              ))}
            </div>
            <p className="text-[11px] mt-4" style={{ color: "var(--muted-2)" }}>Representative layout · not real customer data</p>
          </div>
        </div>
      </section>

      {/* WHAT YOU GET FREE */}
      <section id="what-you-get" className="container-x py-16">
        <span className="kicker">Your free gift includes</span>
        <h2 className="text-3xl font-bold mt-2 mb-8">What you get — free</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VALUE_TILES.map(([t, d]) => (
            <div key={t} className="panel p-5">
              <div className="font-semibold mb-1.5">{t}</div>
              <div className="text-sm" style={{ color: "var(--muted)" }}>{d}</div>
            </div>
          ))}
        </div>
        <CTA label="Unlock My FREE Results" sub="No payment. No obligation. Instant." />
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="gradient-hero">
        <div className="container-x py-16">
          <span className="kicker">How it works</span>
          <h2 className="text-3xl font-bold mt-2 mb-8">Answer → Unlock → Get results → Take action</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOW.map(([n, t, d]) => (
              <div key={n} className="panel p-6">
                <div className="grid place-items-center rounded-full mb-3 font-bold" style={{ width: 36, height: 36, background: "var(--panel-2)", border: "1px solid var(--border-2)", color: "var(--accent-2)" }}>{n}</div>
                <div className="font-semibold mb-1">{t}</div>
                <div className="text-sm" style={{ color: "var(--muted)" }}>{d}</div>
              </div>
            ))}
          </div>
          <CTA label="Take the FREE Assessment Now" sub="5–7 minutes · your results on screen instantly" />
        </div>
      </section>

      {/* WHY */}
      <section className="container-x py-16">
        <span className="kicker">Why take this assessment?</span>
        <h2 className="text-3xl font-bold mt-2 mb-8">Make a confident, evidence-based training decision</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {WHY.map(([t, d]) => (
            <div key={t} className="panel p-5">
              <div className="font-semibold mb-1.5">{t}</div>
              <div className="text-sm" style={{ color: "var(--muted)" }}>{d}</div>
            </div>
          ))}
        </div>
        <CTA label="See My AI Capability for FREE" />
      </section>

      {/* PROGRAMMES */}
      <section id="programmes" className="gradient-hero">
        <div className="container-x py-16">
          <span className="kicker">Training programmes</span>
          <h2 className="text-3xl font-bold mt-2 mb-2">Practical, role-based AI capability programmes</h2>
          <p style={{ color: "var(--muted)" }} className="mb-8 max-w-2xl">Your assessment maps your gaps to the right programme. Here&apos;s the current catalog.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {programmes.map((p) => (
              <div key={p.id} className="panel p-5">
                <div className="badge mb-2" style={{ color: "var(--accent-2)" }}>{p.code}</div>
                <div className="font-semibold mb-1.5">{p.title}</div>
                <div className="text-sm mb-3" style={{ color: "var(--muted)" }}>{p.summary}</div>
                <ul className="text-xs grid gap-1" style={{ color: "var(--muted-2)" }}>
                  {(p.modules ?? []).slice(0, 4).map((m) => <li key={m}>· {m}</li>)}
                </ul>
              </div>
            ))}
            {programmes.length === 0 && <p style={{ color: "var(--muted)" }}>Programme catalog loads from the database.</p>}
          </div>
        </div>
      </section>

      {/* PRIVACY */}
      <section className="container-x py-14">
        <div className="panel p-6 sm:p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">Private and confidential</h3>
          <p style={{ color: "var(--muted)" }} className="max-w-2xl mx-auto">
            Your responses are used to generate your diagnostic and, only if you ask, to follow up. We don&apos;t publish
            pricing or share your data. No accounts, no spam.
          </p>
        </div>
      </section>

      {/* FINAL CTA STRIP */}
      <section className="container-x pb-4">
        <div className="panel p-8 sm:p-12 text-center" style={{ background: "linear-gradient(180deg, rgba(231,182,75,0.10), var(--panel))" }}>
          <h2 className="text-3xl font-bold mb-3">Get My FREE AI Diagnostic</h2>
          <p style={{ color: "var(--muted)" }} className="mb-6 max-w-xl mx-auto">See where you stand, what to fix first, and the training pathway to get there — in the next 7 minutes.</p>
          <Link href="/assessment" className="btn btn-gold" style={{ fontSize: 16, padding: "0.95rem 1.75rem" }}>Start My FREE Assessment</Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
