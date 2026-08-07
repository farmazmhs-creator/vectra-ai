import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseData } from "@/lib/supabase/data";
import { SiteFooter, Brand, ScoreBar } from "@/app/components/Chrome";
import { ROUTE_LABELS } from "@/lib/assessment/questions";
import type { DimensionScore, Recommendation, Route, TnaSnapshot } from "@/lib/assessment/types";
import ResultActions from "./ResultActions";

export const dynamic = "force-dynamic";

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="panel p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-4">
        <span className="grid place-items-center rounded-lg text-sm font-bold" style={{ width: 28, height: 28, background: "var(--panel-2)", border: "1px solid var(--border-2)", color: "var(--accent-2)" }}>{n}</span>
        <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Chip({ children, tone }: { children: React.ReactNode; tone?: "gold" | "accent" | "muted" }) {
  const color = tone === "gold" ? "var(--gold)" : tone === "accent" ? "var(--accent-2)" : "var(--muted)";
  return <span className="badge" style={{ color }}>{children}</span>;
}

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = supabaseData();
  const { data: result } = await db.from("results").select("*").eq("id", id).single();
  if (!result) notFound();
  const { data: lead } = await db.from("leads").select("*").eq("id", result.lead_id).single();

  const route = result.route as Route;
  const dims = (result.dimension_scores ?? []) as DimensionScore[];
  const strengths = (result.strengths ?? []) as DimensionScore[];
  const gaps = (result.gaps ?? []) as DimensionScore[];
  const recs = (result.recommendations ?? []) as Recommendation[];
  const tna = (result.tna_snapshot ?? {}) as TnaSnapshot;
  const nextPath = (result.next_path ?? []) as { phase: string; focus: string }[];
  const pains = (result.pains ?? []) as string[];
  const outcomes = (result.outcomes ?? []) as string[];
  const score = result.overall_score as number;
  const firstName = (lead?.full_name ?? "").split(" ")[0] || "there";

  const stageColor = score >= 65 ? "var(--green)" : score >= 45 ? "var(--gold)" : "var(--accent-2)";

  return (
    <div className="min-h-screen">
      <div className="gradient-hero">
        <div className="container-x py-6 flex items-center justify-between">
          <Brand />
          <span className="badge badge-free">Instant Diagnostic Report</span>
        </div>

        {/* Hero summary */}
        <div className="container-x pb-10">
          <div className="panel p-6 sm:p-8">
            <p className="kicker mb-2">{ROUTE_LABELS[route]}</p>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">
              {firstName}, here is your AI {route === "organisation" ? "Readiness" : "Capability"} diagnostic
            </h1>
            <p style={{ color: "var(--muted)" }} className="mb-6">Generated instantly from your responses · {new Date(result.created_at).toLocaleDateString()}</p>

            <div className="grid sm:grid-cols-[220px_1fr] gap-6 items-center">
              <div className="panel-2 p-6 text-center">
                <div className="text-6xl font-extrabold" style={{ color: stageColor }}>{score}</div>
                <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>out of 100</div>
                <div className="mt-3 inline-block badge" style={{ color: stageColor, borderColor: stageColor }}>{result.stage}</div>
              </div>
              <div>
                <p className="mb-4" style={{ color: "var(--text)" }}>{tna?.current_state}</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {dims.slice(0, 8).map((d) => (
                    <div key={d.code} className="flex items-center gap-3">
                      <span className="text-xs w-7" style={{ color: "var(--muted-2)" }}>{d.code}</span>
                      <div className="flex-1"><ScoreBar score={d.score} /></div>
                      <span className="text-xs w-8 text-right" style={{ color: "var(--muted)" }}>{d.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-x grid gap-5 pb-4" style={{ maxWidth: 920 }}>
        {/* 1. Executive summary */}
        <Section n={1} title="Executive Diagnostic Summary">
          <div className="grid sm:grid-cols-3 gap-3 mb-4">
            <div className="panel-2 p-4"><div className="text-xs" style={{ color: "var(--muted-2)" }}>Assessment</div><div className="font-semibold">{ROUTE_LABELS[route]}</div></div>
            <div className="panel-2 p-4"><div className="text-xs" style={{ color: "var(--muted-2)" }}>Overall score</div><div className="font-semibold">{score} / 100</div></div>
            <div className="panel-2 p-4"><div className="text-xs" style={{ color: "var(--muted-2)" }}>Stage</div><div className="font-semibold">{result.stage}</div></div>
          </div>
          <p style={{ color: "var(--muted)" }}>{result.stage} — {tna?.current_state}</p>
        </Section>

        {/* 2. Profile */}
        <Section n={2} title="Your AI Capability / Readiness Profile">
          <div className="grid gap-4">
            {dims.map((d) => (
              <div key={d.code}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium">{d.code} · {d.label}</span>
                  <span className="text-sm" style={{ color: "var(--muted)" }}>{d.score}/100</span>
                </div>
                <ScoreBar score={d.score} />
                <p className="text-xs mt-1.5" style={{ color: "var(--muted-2)" }}>{d.interpretation}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 3. Investment review */}
        <Section n={3} title="AI / LLM Investment & Utilisation Review">
          <div className="badge mb-3" style={{ color: "var(--gold)", borderColor: "rgba(231,182,75,0.4)" }}>{result.investment_state}</div>
          <p style={{ color: "var(--muted)" }}>{(result as { investment_note?: string }).investment_note ?? tna?.root_cause}</p>
        </Section>

        {/* 4. Strengths */}
        <Section n={4} title="Key Strengths">
          {strengths.length ? (
            <ul className="grid gap-3">
              {strengths.map((s) => (
                <li key={s.code} className="panel-2 p-4">
                  <div className="flex items-center justify-between"><span className="font-semibold">{s.label}</span><Chip tone="gold">{s.score}/100</Chip></div>
                  <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>{s.interpretation}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "var(--muted)" }}>Your strongest foundations are still emerging — the priority gaps below are where focused training will move the needle fastest.</p>
          )}
        </Section>

        {/* 5. Gaps */}
        <Section n={5} title="Priority Gaps, Risks & Constraints">
          <ul className="grid gap-3">
            {gaps.map((g) => (
              <li key={g.code} className="panel-2 p-4">
                <div className="flex items-center justify-between"><span className="font-semibold">{g.label}</span><Chip>{g.score}/100</Chip></div>
                <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>{g.interpretation}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-sm panel-2 p-4" style={{ color: "var(--muted)" }}>
            <strong style={{ color: "var(--text)" }}>Training-solvable vs not:</strong> {tna?.need_classification?.join(" · ")}
          </div>
        </Section>

        {/* 6. Pains & outcomes */}
        <Section n={6} title="Pain Points & Desired Outcomes">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <div className="text-xs mb-2" style={{ color: "var(--muted-2)" }}>Biggest opportunities you selected</div>
              <div className="flex flex-wrap gap-2">{pains.length ? pains.map((p) => <Chip key={p}>{p}</Chip>) : <span style={{ color: "var(--muted)" }}>—</span>}</div>
            </div>
            <div>
              <div className="text-xs mb-2" style={{ color: "var(--muted-2)" }}>Outcomes you want</div>
              <div className="flex flex-wrap gap-2">{outcomes.length ? outcomes.map((o) => <Chip key={o} tone="accent">{o}</Chip>) : <span style={{ color: "var(--muted)" }}>—</span>}</div>
            </div>
          </div>
        </Section>

        {/* 7. Opportunity horizon */}
        <Section n={7} title="Opportunity Horizon">
          <p style={{ color: "var(--text)" }}>{result.opportunity_horizon}</p>
        </Section>

        {/* 8. TNA snapshot */}
        <Section n={8} title={`Instant Training Needs Analysis Snapshot`}>
          <div className="badge mb-4" style={{ color: "var(--accent-2)", borderColor: "var(--border-2)" }}>{tna?.label}</div>
          <div className="grid gap-3 text-sm">
            <Row label="Objective">{tna?.objective}</Row>
            <Row label="Current state">{tna?.current_state}</Row>
            <Row label="Required future capability">
              <ul className="list-disc pl-5">{(tna?.required_capability ?? []).map((c) => <li key={c}>{c}</li>)}</ul>
            </Row>
            <Row label="Root cause">{tna?.root_cause}</Row>
            <Row label="Training need classification">{tna?.need_classification?.join(" · ")}</Row>
            <Row label="Priority learner group">{tna?.learner_group?.join(", ")}</Row>
            <Row label="Recommended intervention">
              <ul className="list-disc pl-5">{(tna?.recommended_intervention ?? []).map((c) => <li key={c}>{c}</li>)}</ul>
            </Row>
            <Row label="Success evidence">
              <ul className="list-disc pl-5">{(tna?.success_evidence ?? []).map((c) => <li key={c}>{c}</li>)}</ul>
            </Row>
          </div>
        </Section>

        {/* 9. Training prescription */}
        <Section n={9} title="Training Prescription — Gap → Programme → Intended Capability">
          <div className="grid gap-3">
            {recs.map((r, i) => (
              <div key={i} className="panel-2 p-4">
                <div className="grid sm:grid-cols-[1fr_auto] gap-2 items-start">
                  <div>
                    <div className="text-xs" style={{ color: "var(--muted-2)" }}>Identified gap</div>
                    <div className="font-medium mb-2">{r.gap}</div>
                    <div className="text-xs" style={{ color: "var(--muted-2)" }}>Intended capability</div>
                    <div className="text-sm" style={{ color: "var(--muted)" }}>{r.intended_capability}</div>
                  </div>
                  <div className="text-right">
                    <Chip tone="accent">{r.programme_code}</Chip>
                    <div className="font-semibold mt-1 text-sm">{r.programme}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 10. Next path */}
        <Section n={10} title="Suggested Next 30–90 Day Capability Path">
          <div className="grid sm:grid-cols-3 gap-3">
            {nextPath.map((p) => (
              <div key={p.phase} className="panel-2 p-4">
                <div className="font-semibold text-sm mb-1">{p.phase}</div>
                <div className="text-sm" style={{ color: "var(--muted)" }}>{p.focus}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* 12. CTA */}
        {lead && <ResultActions leadId={lead.id} resultId={result.id} />}

        {/* 11. Methodology */}
        <div className="panel-2 p-5 text-xs" style={{ color: "var(--muted-2)" }}>
          <strong style={{ color: "var(--muted)" }}>Methodology & limitations:</strong> This score is calculated deterministically from your submitted responses.
          {route === "organisation" ? " The Organisation Snapshot reflects a single respondent's informed view, not a full enterprise-wide audit." : ""}
          {" "}Results are diagnostic and do not constitute an audit, compliance certification or guaranteed ROI assessment. The TNA is structured in alignment with HRD Corp published TNA principles; it is an automated diagnostic, not a formal HRD Corp approval.
        </div>

        <div className="text-center py-4">
          <Link href="/" className="link-muted text-sm">← Back to home</Link>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid sm:grid-cols-[200px_1fr] gap-1 sm:gap-4 py-2" style={{ borderTop: "1px solid var(--border)" }}>
      <div style={{ color: "var(--muted-2)" }}>{label}</div>
      <div style={{ color: "var(--text)" }}>{children}</div>
    </div>
  );
}
