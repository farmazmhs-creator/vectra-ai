import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseService } from "@/lib/supabase/service";
import { resultCookieAuthorises } from "@/lib/security/session";
import { isAdmin } from "@/lib/auth/require";
import { SiteFooter, Brand, ScoreBar } from "@/app/components/Chrome";
import { ROUTE_LABELS } from "@/lib/assessment/questions";
import { ROUTE_LABELS_BM } from "@/lib/assessment/questions-bm";
import { t, type Lang } from "@/lib/i18n";
import type { DimensionScore, Recommendation, Route, TnaSnapshot } from "@/lib/assessment/types";
import ResultActions from "./ResultActions";
import { PrintButton } from "./PrintButton";

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

  // Authorisation gate: admin session OR a valid result-access cookie for THIS id. No enumeration.
  const admin = await isAdmin();
  if (!admin && !(await resultCookieAuthorises(id))) notFound();

  const db = supabaseService();
  // Whitelisted report fields only — no lead_id/assessment_id/token hashes reach the client/RSC.
  const { data: result } = await db
    .from("results")
    .select("id, route, overall_score, stage, dimension_scores, strengths, gaps, investment_state, investment_note, pains, outcomes, tna_snapshot, recommendations, opportunity_horizon, next_path, created_at, lead_id")
    .eq("id", id)
    .single();
  if (!result) notFound();
  // Only the respondent's own first name + language are read from the lead (for greeting/locale).
  const { data: lead } = await db.from("leads").select("full_name, language").eq("id", result.lead_id).single();

  const lang: Lang = lead?.language === "bm" ? "bm" : "en";
  const bm = lang === "bm";
  const tr = (k: Parameters<typeof t>[1]) => t(lang, k);

  const route = result.route as Route;
  const routeLabel = bm ? ROUTE_LABELS_BM[route] : ROUTE_LABELS[route];
  const dims = (result.dimension_scores ?? []) as DimensionScore[];
  const strengths = (result.strengths ?? []) as DimensionScore[];
  const gaps = (result.gaps ?? []) as DimensionScore[];
  const recs = (result.recommendations ?? []) as Recommendation[];
  const tna = (result.tna_snapshot ?? {}) as TnaSnapshot;
  const nextPath = (result.next_path ?? []) as { phase: string; focus: string }[];
  const pains = (result.pains ?? []) as string[];
  const outcomes = (result.outcomes ?? []) as string[];
  const score = result.overall_score as number;
  const firstName = (lead?.full_name ?? "").split(" ")[0] || (bm ? "anda" : "there");
  const kind = route === "organisation" ? (bm ? "Kesediaan" : "Readiness") : (bm ? "Keupayaan" : "Capability");
  const heading = bm
    ? `${firstName}, ini diagnostik ${kind} AI anda`
    : `${firstName}, here is your AI ${kind} diagnostic`;

  const stageColor = score >= 65 ? "var(--green)" : score >= 45 ? "var(--gold)" : "var(--accent-2)";

  return (
    <div className="min-h-screen">
      <div className="gradient-hero">
        <div className="container-x py-6 flex items-center justify-between">
          <Brand />
          <div className="flex items-center gap-3">
            <PrintButton label={tr("download_pdf")} />
            <span className="badge badge-free">{tr("instant_report")}</span>
          </div>
        </div>

        <div className="container-x pb-10">
          <div className="panel p-6 sm:p-8">
            <p className="kicker mb-2">{routeLabel}</p>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">{heading}</h1>
            <p style={{ color: "var(--muted)" }} className="mb-6">{tr("generated_instantly")} · {new Date(result.created_at).toLocaleDateString()}</p>

            <div className="grid sm:grid-cols-[220px_1fr] gap-6 items-center">
              <div className="panel-2 p-6 text-center">
                <div className="text-6xl font-extrabold" style={{ color: stageColor }}>{score}</div>
                <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>{tr("out_of_100")}</div>
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
        <Section n={1} title={tr("sec1")}>
          <div className="grid sm:grid-cols-3 gap-3 mb-4">
            <div className="panel-2 p-4"><div className="text-xs" style={{ color: "var(--muted-2)" }}>{tr("r_assessment")}</div><div className="font-semibold">{routeLabel}</div></div>
            <div className="panel-2 p-4"><div className="text-xs" style={{ color: "var(--muted-2)" }}>{tr("r_overall")}</div><div className="font-semibold">{score} / 100</div></div>
            <div className="panel-2 p-4"><div className="text-xs" style={{ color: "var(--muted-2)" }}>{tr("r_stage")}</div><div className="font-semibold">{result.stage}</div></div>
          </div>
          <p style={{ color: "var(--muted)" }}>{result.stage} — {tna?.current_state}</p>
        </Section>

        <Section n={2} title={tr("sec2")}>
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

        <Section n={3} title={tr("sec3")}>
          <div className="badge mb-3" style={{ color: "var(--gold)", borderColor: "rgba(231,182,75,0.4)" }}>{result.investment_state}</div>
          <p style={{ color: "var(--muted)" }}>{(result as { investment_note?: string }).investment_note ?? tna?.root_cause}</p>
        </Section>

        <Section n={4} title={tr("sec4")}>
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
            <p style={{ color: "var(--muted)" }}>{bm ? "Asas terkuat anda masih muncul — jurang keutamaan di bawah ialah tempat latihan fokus akan memberi kesan terpantas." : "Your strongest foundations are still emerging — the priority gaps below are where focused training will move the needle fastest."}</p>
          )}
        </Section>

        <Section n={5} title={tr("sec5")}>
          <ul className="grid gap-3">
            {gaps.map((g) => (
              <li key={g.code} className="panel-2 p-4">
                <div className="flex items-center justify-between"><span className="font-semibold">{g.label}</span><Chip>{g.score}/100</Chip></div>
                <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>{g.interpretation}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-sm panel-2 p-4" style={{ color: "var(--muted)" }}>
            <strong style={{ color: "var(--text)" }}>{tr("r_trainable")}</strong> {tna?.need_classification?.join(" · ")}
          </div>
        </Section>

        <Section n={6} title={tr("sec6")}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <div className="text-xs mb-2" style={{ color: "var(--muted-2)" }}>{tr("r_biggest")}</div>
              <div className="flex flex-wrap gap-2">{pains.length ? pains.map((p) => <Chip key={p}>{p}</Chip>) : <span style={{ color: "var(--muted)" }}>—</span>}</div>
            </div>
            <div>
              <div className="text-xs mb-2" style={{ color: "var(--muted-2)" }}>{tr("r_outcomes")}</div>
              <div className="flex flex-wrap gap-2">{outcomes.length ? outcomes.map((o) => <Chip key={o} tone="accent">{o}</Chip>) : <span style={{ color: "var(--muted)" }}>—</span>}</div>
            </div>
          </div>
        </Section>

        <Section n={7} title={tr("sec7")}>
          <p style={{ color: "var(--text)" }}>{result.opportunity_horizon}</p>
        </Section>

        <Section n={8} title={tr("sec8")}>
          <div className="badge mb-4" style={{ color: "var(--accent-2)", borderColor: "var(--border-2)" }}>{tna?.label}</div>
          <div className="grid gap-3 text-sm">
            <Row label={tr("tna_objective")}>{tna?.objective}</Row>
            <Row label={tr("tna_current")}>{tna?.current_state}</Row>
            <Row label={tr("tna_required")}><ul className="list-disc pl-5">{(tna?.required_capability ?? []).map((c) => <li key={c}>{c}</li>)}</ul></Row>
            <Row label={tr("tna_root")}>{tna?.root_cause}</Row>
            <Row label={tr("tna_class")}>{tna?.need_classification?.join(" · ")}</Row>
            <Row label={tr("tna_learner")}>{tna?.learner_group?.join(", ")}</Row>
            <Row label={tr("tna_intervention")}><ul className="list-disc pl-5">{(tna?.recommended_intervention ?? []).map((c) => <li key={c}>{c}</li>)}</ul></Row>
            <Row label={tr("tna_evidence")}><ul className="list-disc pl-5">{(tna?.success_evidence ?? []).map((c) => <li key={c}>{c}</li>)}</ul></Row>
          </div>
        </Section>

        <Section n={9} title={tr("sec9")}>
          <div className="grid gap-3">
            {recs.map((r, i) => (
              <div key={i} className="panel-2 p-4">
                <div className="grid sm:grid-cols-[1fr_auto] gap-2 items-start">
                  <div>
                    <div className="text-xs" style={{ color: "var(--muted-2)" }}>{tr("r_identified_gap")}</div>
                    <div className="font-medium mb-2">{r.gap}</div>
                    <div className="text-xs" style={{ color: "var(--muted-2)" }}>{tr("r_intended_cap")}</div>
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

        <Section n={10} title={tr("sec10")}>
          <div className="grid sm:grid-cols-3 gap-3">
            {nextPath.map((p) => (
              <div key={p.phase} className="panel-2 p-4">
                <div className="font-semibold text-sm mb-1">{p.phase}</div>
                <div className="text-sm" style={{ color: "var(--muted)" }}>{p.focus}</div>
              </div>
            ))}
          </div>
        </Section>

        <ResultActions resultId={result.id} lang={lang} />

        <div className="panel-2 p-5 text-xs" style={{ color: "var(--muted-2)" }}>
          <strong style={{ color: "var(--muted)" }}>{bm ? "Metodologi & batasan:" : "Methodology & limitations:"}</strong>{" "}
          {bm
            ? "Skor ini dikira secara deterministik daripada jawapan yang anda serahkan."
            : "This score is calculated deterministically from your submitted responses."}
          {route === "organisation" ? (bm ? " Gambaran Organisasi mencerminkan pandangan seorang responden, bukan audit seluruh perusahaan." : " The Organisation Snapshot reflects a single respondent's informed view, not a full enterprise-wide audit.") : ""}
          {" "}
          {bm
            ? "Keputusan adalah diagnostik dan bukan audit, pensijilan pematuhan atau jaminan ROI. TNA distruktur selaras dengan prinsip TNA terbitan HRD Corp; ia diagnostik automatik, bukan kelulusan rasmi HRD Corp."
            : "Results are diagnostic and do not constitute an audit, compliance certification or guaranteed ROI assessment. The TNA is structured in alignment with HRD Corp published TNA principles; it is an automated diagnostic, not a formal HRD Corp approval."}
        </div>

        <div className="text-center py-4 no-print">
          <Link href="/" className="link-muted text-sm">{tr("back_home")}</Link>
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
