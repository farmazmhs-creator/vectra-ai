import { DIMENSION_LABELS, optionLabels } from "./questions";
import { optLabelI18n } from "./questions-bm";
import {
  DIMENSION_LABELS_BM, stageForI18n, interpI18n, NEEDS_BM, INVESTMENT_BM,
  DEFAULT_CAPS_BM, DEFAULT_EVIDENCE_BM, DEFAULT_LEARNER_BM, nextPathI18n, tnaLabelI18n,
} from "./report-i18n";
import type { Lang } from "@/lib/i18n";
import type {
  Answers, DimensionCode, DimensionScore, DiagnosticResult, Programme,
  Recommendation, Route, SubRoute, TnaSnapshot,
} from "./types";

const DIMENSION_QUESTIONS: Record<DimensionCode, string[]> = {
  D1: ["Q4"], D2: ["Q1"], D3: ["Q2", "Q3"], D4: ["Q7"],
  D5: ["Q5", "Q6"], D6: ["Q9"], D7: ["Q10"], D8: ["Q11a", "Q12"],
};

const WEIGHTS: Record<SubRoute, Record<DimensionCode, number>> = {
  organisation: { D1: 10, D2: 10, D3: 15, D4: 15, D5: 15, D6: 15, D7: 10, D8: 10 },
  team: { D1: 15, D2: 10, D3: 15, D4: 20, D5: 10, D6: 10, D7: 15, D8: 5 },
  individual: { D1: 25, D2: 5, D3: 15, D4: 20, D5: 15, D6: 5, D7: 10, D8: 5 },
};

const DIMS: DimensionCode[] = ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8"];

function num(a: Answers, code: string): number | null {
  const v = a[code];
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
function arr(a: Answers, code: string): string[] {
  const v = a[code];
  return Array.isArray(v) ? (v as string[]) : [];
}
function effectiveSubRoute(route: Route, sub?: SubRoute): SubRoute {
  if (route === "client") return sub ?? "individual";
  if (route === "individual" || route === "team" || route === "organisation") return route;
  return "individual";
}

function dimensionInterpretationEN(code: DimensionCode, score: number): string {
  const idx = score >= 65 ? 2 : score >= 45 ? 1 : 0;
  const map: Record<DimensionCode, [string, string, string]> = {
    D1: ["Practical AI competency is still forming — prompting and verification need structured development.", "A working level of practical competency exists and can be sharpened into reliable, repeatable use.", "Strong practical competency: users prompt, refine and verify with confidence."],
    D2: ["Tool access / investment is limited or unclear, which constrains what capability can be applied.", "Some approved tool access exists but is not yet used to its full potential.", "Suitable tools are available and intentionally embedded into work."],
    D3: ["Actual adoption is low or experimental — usage has not yet become a habit.", "Adoption is emerging across several tasks but is not yet consistent or broad.", "AI is used routinely and broadly across meaningful work."],
    D4: ["AI is not yet integrated into recurring workflows — value stays ad-hoc.", "Some repeatable AI-assisted steps exist but are not standardised.", "AI is integrated into standardised, connected workflows."],
    D5: ["Verification and data-governance practices are inconsistent, creating avoidable risk.", "Reasonable checking and guidance exist but are not fully embedded.", "Responsible use, verification and governance are embedded and reinforced."],
    D6: ["Direction and enablement for AI adoption is largely absent.", "Some encouragement and pilots exist but direction is not yet firm.", "Leadership actively enables adoption and connects it to outcomes."],
    D7: ["Workforce capability is thin and change-readiness is untested.", "Basic capability exists but is uneven across the relevant people.", "Capability is developed, shared and reinforced across the group."],
    D8: ["Impact of AI use is not measured, so value cannot be evidenced or scaled.", "Some value is captured but measurement is not yet systematic.", "Adoption and outcomes are measured and ready to scale."],
  };
  return map[code][idx];
}

function stageForEN(score: number): { stage: string; blurb: string } {
  if (score < 25) return { stage: "Exploratory", blurb: "AI capability is limited, informal or not yet enabled." };
  if (score < 45) return { stage: "Emerging", blurb: "Early usage exists but capability, access or direction is inconsistent." };
  if (score < 65) return { stage: "Developing", blurb: "Useful adoption exists, but repeatability, governance or role-specific capability remains uneven." };
  if (score < 80) return { stage: "Operational", blurb: "AI is used meaningfully with growing consistency, controls and workflow relevance." };
  return { stage: "Scaling / Strategic", blurb: "AI capability is embedded, measured and positioned for broader scaling and advanced use." };
}

function investmentStateEN(a: Answers): { state: string; note: string } {
  const access = num(a, "Q1") ?? 0;
  const usage = num(a, "Q2") ?? 0;
  const workflow = num(a, "Q7") ?? 0;
  const governance = num(a, "Q6") ?? 0;
  const tools = arr(a, "Q1b").filter((t) => t !== "none");
  const licensed = access >= 3;
  const approved = access >= 2;
  if (!approved && usage <= 1) return { state: "Not Yet Enabled", note: "No approved AI tool and little usage — capability building and tool-selection clarity may be needed before scale." };
  if (!approved && usage >= 3) return { state: "Unmanaged Adoption / Shadow-AI Exposure", note: "Meaningful use is happening on personal / public tools while approved access and governance lag behind behaviour." };
  if (licensed && usage <= 1) return { state: "Underutilised AI Investment", note: "Commercial investment exists but adoption, skill or use-case activation is weak — the licence is not yet paying back." };
  if (licensed && governance <= 1 && usage >= 3) return { state: "Value with Control Risk", note: "Capability is developing faster than governance — safe-use practices need to catch up." };
  if (tools.length >= 3 && workflow <= 2) return { state: "Tool Fragmentation", note: "Multiple tools are in fragmented use — duplicated capability and inconsistent standards may need rationalisation." };
  if (licensed && usage >= 3 && workflow >= 3 && governance >= 3) return { state: "Value Realisation / Scale Ready", note: "Strong capability, workflow use and governance — focus can shift to advanced workflows, measurement and scale." };
  if (approved) return { state: "Adoption Opportunity", note: "Users are active but value is still concentrated in basic productivity — the opportunity is deeper workflow integration." };
  return { state: "Emerging Adoption", note: "Early, informal AI use — the priority is building reliable everyday capability." };
}

function classifyNeedsEN(dims: DimensionScore[], a: Answers): string[] {
  const by = Object.fromEntries(dims.map((d) => [d.code, d.score])) as Record<DimensionCode, number>;
  const needs: string[] = [];
  if (by.D1 < 65 || by.D3 < 65 || by.D4 < 65) needs.push("Training / capability need");
  if ((num(a, "Q1") ?? 0) < 2) needs.push("Tool / access need");
  if (by.D5 < 65) needs.push("Policy / governance need");
  if (by.D4 < 55) needs.push("Process redesign need");
  if (by.D6 < 55) needs.push("Leadership decision need");
  return needs.length ? needs : ["Training / capability need"];
}

function buildRecommendations(gaps: DimensionScore[], route: Route, programmes: Programme[]): Recommendation[] {
  const sub = route === "client" ? "individual" : route;
  const active = programmes.filter((p) => p.active);
  const recs: Recommendation[] = [];
  const used = new Set<string>();
  for (const gap of gaps) {
    const match = active
      .filter((p) => p.target_dimensions.includes(gap.code) && !used.has(p.code))
      .sort((x, y) => {
        const xf = x.route_fit.includes(sub) ? 0 : 1;
        const yf = y.route_fit.includes(sub) ? 0 : 1;
        return xf - yf || x.sort_order - y.sort_order;
      })[0];
    if (match) {
      used.add(match.code);
      recs.push({ gap: gap.label, programme_code: match.code, programme: match.title, intended_capability: match.intended_capability ?? "" });
    }
  }
  if (recs.length < 2) {
    for (const p of active.sort((x, y) => x.sort_order - y.sort_order)) {
      if (used.has(p.code)) continue;
      used.add(p.code);
      recs.push({ gap: gaps[0]?.label ?? "General capability", programme_code: p.code, programme: p.title, intended_capability: p.intended_capability ?? "" });
      if (recs.length >= 3) break;
    }
  }
  return recs.slice(0, 4);
}

export function scoreAssessment(
  route: Route,
  subRoute: SubRoute | undefined,
  answers: Answers,
  programmes: Programme[],
  lang: Lang = "en",
): DiagnosticResult {
  const bm = lang === "bm";
  const sub = effectiveSubRoute(route, subRoute);
  const weights = WEIGHTS[sub];
  const dimLabel = (c: DimensionCode) => (bm ? DIMENSION_LABELS_BM[c] : DIMENSION_LABELS[c]);

  const dimension_scores: DimensionScore[] = DIMS.map((code) => {
    const vals = DIMENSION_QUESTIONS[code].map((q) => num(answers, q)).filter((v): v is number => v !== null);
    const avg = vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : 0;
    const score = Math.round((avg / 4) * 100);
    return {
      code,
      label: dimLabel(code),
      score,
      interpretation: bm ? interpI18n(lang, code, score) : dimensionInterpretationEN(code, score),
    };
  });

  const overall = Math.round(dimension_scores.reduce((s, d) => s + d.score * (weights[d.code] / 100), 0));
  const { stage, blurb } = bm ? stageForI18n(lang, overall) : stageForEN(overall);

  const sorted = [...dimension_scores].sort((a, b) => b.score - a.score);
  const strengths = sorted.filter((d) => d.score >= 60).slice(0, 4);
  const gaps = [...dimension_scores].sort((a, b) => a.score - b.score).slice(0, 4);

  const invEN = investmentStateEN(answers);
  const investment_state = bm ? INVESTMENT_BM[invEN.state]?.state ?? invEN.state : invEN.state;
  const investment_note = bm ? INVESTMENT_BM[invEN.state]?.note ?? invEN.note : invEN.note;

  const labels = (code: string) => (bm ? arr(answers, code).map((c) => optLabelI18n(lang, code, c)) : optionLabels(code, arr(answers, code)));
  const pains = labels("Q8");
  const outcomes = labels("Q13");
  const requiredCaps = labels("Q15cap");
  const successEvidence = labels("Q15ev");
  const learnerGroup = labels("Q14");
  const ft1 = typeof answers["FT1"] === "string" ? (answers["FT1"] as string).trim() : "";

  const needsEN = classifyNeedsEN(dimension_scores, answers);
  const need_classification = bm ? needsEN.map((n) => NEEDS_BM[n] ?? n) : needsEN;

  const recommendations = buildRecommendations(gaps, route, programmes);

  const tnaKind: "individual" | "team" | "organisation" =
    route === "individual" || (route === "client" && sub === "individual") ? "individual"
      : route === "team" || (route === "client" && sub === "team") ? "team" : "organisation";
  const tnaLabel = tnaLabelI18n(lang, tnaKind);

  const topGap = gaps[0];
  const gapPair = gaps.slice(0, 2).map((g) => g.label).join(bm ? " dan " : " and ");
  const painPair = pains.length ? pains.slice(0, 2).join(bm ? " dan " : " and ").toLowerCase() : (bm ? "usaha manual dan kerja semula yang boleh dielakkan" : "avoidable manual effort and rework");

  const objective = bm
    ? `${ft1 ? ft1 + " " : ""}${outcomes.length ? "Hasil keutamaan: " + outcomes.slice(0, 3).join(", ") + "." : "Bina keupayaan AI yang praktikal dan boleh dipercayai untuk kerja sebenar."}`
    : `${ft1 ? ft1 + " " : ""}${outcomes.length ? "Priority outcomes: " + outcomes.slice(0, 3).join(", ") + "." : "Build practical, reliable AI capability applied to real work."}`;

  const current_state = bm
    ? `Kini pada peringkat ${stage} (keseluruhan ${overall}/100). ${blurb}`
    : `Currently at the ${stage} stage (overall ${overall}/100). ${blurb}`;

  const root_cause = topGap
    ? (bm
        ? `Kawasan keupayaan terendah ialah "${topGap.label}" (${topGap.score}/100). ${topGap.interpretation}`
        : `Lowest capability area is "${topGap.label}" (${topGap.score}/100). ${topGap.interpretation}`)
    : (bm ? "Keupayaan tidak sekata merentas dimensi." : "Capability is uneven across dimensions.");

  const tna_snapshot: TnaSnapshot = {
    label: tnaLabel,
    objective: objective.trim(),
    current_state,
    required_capability: requiredCaps.length ? requiredCaps : (bm ? DEFAULT_CAPS_BM : ["Use approved AI tools confidently", "Verify outputs and apply judgement", "Apply AI to recurring role tasks"]),
    root_cause,
    need_classification,
    learner_group: learnerGroup.length ? learnerGroup : (bm ? DEFAULT_LEARNER_BM : ["Myself / relevant users"]),
    recommended_intervention: recommendations.map((r) => `${r.programme_code} — ${r.programme}`),
    success_evidence: successEvidence.length ? successEvidence : (bm ? DEFAULT_EVIDENCE_BM : ["Pre-vs-post capability assessment improves", "A learning is applied at work within 7–14 days"]),
  };

  const nextStageEN = overall < 25 ? "Emerging" : overall < 45 ? "Developing" : overall < 65 ? "Operational" : "Scaling / Strategic";
  const nextStage = bm ? stageForI18n(lang, Math.min(overall + 25, 100)).stage : nextStageEN;

  const opportunity_horizon = bm
    ? `Hari ini anda berada di peringkat ${stage}. Dengan pembinaan keupayaan yang fokus dalam suku tahun berikutnya, bergerak ke arah peringkat ${nextStage} adalah realistik. ${outcomes.length ? "Itu akan diterjemahkan terus kepada: " + outcomes.slice(0, 3).join(", ") + ". " : ""}Keupayaan yang lebih kukuh dalam ${gapPair} akan mengurangkan ${painPair}, tanpa memerlukan tuntutan ROI yang dijamin.`
    : `Today you are ${stage}. With focused capability building over the next quarter, moving toward the ${nextStage} stage is realistic. ${outcomes.length ? "That would translate directly into: " + outcomes.slice(0, 3).join(", ") + ". " : ""}Stronger capability in ${gapPair} would reduce ${painPair}, without requiring guaranteed ROI claims.`;

  const next_path = nextPathI18n(lang, gaps[0]?.label ?? (bm ? "kompetensi teras" : "core competency"));

  return {
    route, overall_score: overall, stage, stage_blurb: blurb,
    dimension_scores, strengths, gaps,
    investment_state, investment_note, pains, outcomes,
    tna_snapshot, recommendations, opportunity_horizon, next_path,
  };
}

export function computeLeadPriority(kyc: { decision_authority?: string; timing?: string; training_intent?: string }): string {
  const da = kyc.decision_authority ?? "";
  const timing = kyc.timing ?? "";
  const highAuthority = da === "final" || da === "influence";
  const urgent = timing === "immediate" || timing === "1-3m";
  if (highAuthority && urgent) return "high";
  if (highAuthority || urgent) return "standard";
  if (da === "own" || kyc.training_intent === "assessing") return "low";
  return "standard";
}
