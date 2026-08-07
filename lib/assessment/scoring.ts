import { DIMENSION_LABELS, optionLabels } from "./questions";
import type {
  Answers,
  DimensionCode,
  DimensionScore,
  DiagnosticResult,
  Programme,
  Recommendation,
  Route,
  SubRoute,
  TnaSnapshot,
} from "./types";

// Which scored questions feed each dimension (PRD §10.6 mapping)
const DIMENSION_QUESTIONS: Record<DimensionCode, string[]> = {
  D1: ["Q4"],
  D2: ["Q1"],
  D3: ["Q2", "Q3"],
  D4: ["Q7"],
  D5: ["Q5", "Q6"],
  D6: ["Q9"],
  D7: ["Q10"],
  D8: ["Q11a", "Q12"],
};

// Route weights (PRD §10.8). Percentages sum to 100.
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

function dimensionInterpretation(code: DimensionCode, score: number): string {
  const band = score >= 65 ? "strong" : score >= 45 ? "developing" : "early";
  const map: Record<DimensionCode, [string, string, string]> = {
    D1: [
      "Practical AI competency is still forming — prompting and verification need structured development.",
      "A working level of practical competency exists and can be sharpened into reliable, repeatable use.",
      "Strong practical competency: users prompt, refine and verify with confidence.",
    ],
    D2: [
      "Tool access / investment is limited or unclear, which constrains what capability can be applied.",
      "Some approved tool access exists but is not yet used to its full potential.",
      "Suitable tools are available and intentionally embedded into work.",
    ],
    D3: [
      "Actual adoption is low or experimental — usage has not yet become a habit.",
      "Adoption is emerging across several tasks but is not yet consistent or broad.",
      "AI is used routinely and broadly across meaningful work.",
    ],
    D4: [
      "AI is not yet integrated into recurring workflows — value stays ad-hoc.",
      "Some repeatable AI-assisted steps exist but are not standardised.",
      "AI is integrated into standardised, connected workflows.",
    ],
    D5: [
      "Verification and data-governance practices are inconsistent, creating avoidable risk.",
      "Reasonable checking and guidance exist but are not fully embedded.",
      "Responsible use, verification and governance are embedded and reinforced.",
    ],
    D6: [
      "Direction and enablement for AI adoption is largely absent.",
      "Some encouragement and pilots exist but direction is not yet firm.",
      "Leadership actively enables adoption and connects it to outcomes.",
    ],
    D7: [
      "Workforce capability is thin and change-readiness is untested.",
      "Basic capability exists but is uneven across the relevant people.",
      "Capability is developed, shared and reinforced across the group.",
    ],
    D8: [
      "Impact of AI use is not measured, so value cannot be evidenced or scaled.",
      "Some value is captured but measurement is not yet systematic.",
      "Adoption and outcomes are measured and ready to scale.",
    ],
  };
  const idx = band === "early" ? 0 : band === "developing" ? 1 : 2;
  return map[code][idx];
}

function stageFor(score: number): { stage: string; blurb: string } {
  if (score < 25)
    return { stage: "Exploratory", blurb: "AI capability is limited, informal or not yet enabled." };
  if (score < 45)
    return { stage: "Emerging", blurb: "Early usage exists but capability, access or direction is inconsistent." };
  if (score < 65)
    return { stage: "Developing", blurb: "Useful adoption exists, but repeatability, governance or role-specific capability remains uneven." };
  if (score < 80)
    return { stage: "Operational", blurb: "AI is used meaningfully with growing consistency, controls and workflow relevance." };
  return { stage: "Scaling / Strategic", blurb: "AI capability is embedded, measured and positioned for broader scaling and advanced use." };
}

// PRD §10.10 investment / utilisation state machine
function investmentState(a: Answers): { state: string; note: string } {
  const access = num(a, "Q1") ?? 0; // 0 none, 1 public, 2 limited approved, 3 licensed, 4 embedded
  const usage = num(a, "Q2") ?? 0;
  const workflow = num(a, "Q7") ?? 0;
  const governance = num(a, "Q6") ?? 0;
  const tools = arr(a, "Q1b").filter((t) => t !== "none");
  const licensed = access >= 3;
  const approved = access >= 2;

  if (!approved && usage <= 1)
    return {
      state: "Not Yet Enabled",
      note: "No approved AI tool and little usage — capability building and tool-selection clarity may be needed before scale.",
    };
  if (!approved && usage >= 3)
    return {
      state: "Unmanaged Adoption / Shadow-AI Exposure",
      note: "Meaningful use is happening on personal / public tools while approved access and governance lag behind behaviour.",
    };
  if (licensed && usage <= 1)
    return {
      state: "Underutilised AI Investment",
      note: "Commercial investment exists but adoption, skill or use-case activation is weak — the licence is not yet paying back.",
    };
  if (licensed && governance <= 1 && usage >= 3)
    return {
      state: "Value with Control Risk",
      note: "Capability is developing faster than governance — safe-use practices need to catch up.",
    };
  if (tools.length >= 3 && workflow <= 2)
    return {
      state: "Tool Fragmentation",
      note: "Multiple tools are in fragmented use — duplicated capability and inconsistent standards may need rationalisation.",
    };
  if (licensed && usage >= 3 && workflow >= 3 && governance >= 3)
    return {
      state: "Value Realisation / Scale Ready",
      note: "Strong capability, workflow use and governance — focus can shift to advanced workflows, measurement and scale.",
    };
  if (approved)
    return {
      state: "Adoption Opportunity",
      note: "Users are active but value is still concentrated in basic productivity — the opportunity is deeper workflow integration.",
    };
  return {
    state: "Emerging Adoption",
    note: "Early, informal AI use — the priority is building reliable everyday capability.",
  };
}

function classifyNeeds(dims: DimensionScore[], a: Answers): string[] {
  const by = Object.fromEntries(dims.map((d) => [d.code, d.score])) as Record<DimensionCode, number>;
  const needs: string[] = [];
  if (by.D1 < 65 || by.D3 < 65 || by.D4 < 65) needs.push("Training / capability need");
  if ((num(a, "Q1") ?? 0) < 2) needs.push("Tool / access need");
  if (by.D5 < 65) needs.push("Policy / governance need");
  if (by.D4 < 55) needs.push("Process redesign need");
  if (by.D6 < 55) needs.push("Leadership decision need");
  return needs.length ? needs : ["Training / capability need"];
}

function buildRecommendations(
  gaps: DimensionScore[],
  route: Route,
  programmes: Programme[],
): Recommendation[] {
  const sub = route === "client" ? "individual" : route;
  const active = programmes.filter((p) => p.active);
  const recs: Recommendation[] = [];
  const used = new Set<string>();

  for (const gap of gaps) {
    // best programme that targets this gap dimension and fits the route
    const match = active
      .filter((p) => p.target_dimensions.includes(gap.code) && !used.has(p.code))
      .sort((x, y) => {
        const xf = x.route_fit.includes(sub) ? 0 : 1;
        const yf = y.route_fit.includes(sub) ? 0 : 1;
        return xf - yf || x.sort_order - y.sort_order;
      })[0];
    if (match) {
      used.add(match.code);
      recs.push({
        gap: gap.label,
        programme_code: match.code,
        programme: match.title,
        intended_capability: match.intended_capability ?? "",
      });
    }
  }

  // Ensure at least two recommendations
  if (recs.length < 2) {
    for (const p of active.sort((x, y) => x.sort_order - y.sort_order)) {
      if (used.has(p.code)) continue;
      used.add(p.code);
      recs.push({
        gap: gaps[0]?.label ?? "General capability",
        programme_code: p.code,
        programme: p.title,
        intended_capability: p.intended_capability ?? "",
      });
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
): DiagnosticResult {
  const sub = effectiveSubRoute(route, subRoute);
  const weights = WEIGHTS[sub];

  // Dimension scores (0-100), average of answered scored questions, normalised from 0-4.
  const dimension_scores: DimensionScore[] = DIMS.map((code) => {
    const vals = DIMENSION_QUESTIONS[code]
      .map((q) => num(answers, q))
      .filter((v): v is number => v !== null);
    const avg = vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : 0;
    const score = Math.round((avg / 4) * 100);
    return {
      code,
      label: DIMENSION_LABELS[code],
      score,
      interpretation: dimensionInterpretation(code, score),
    };
  });

  const overall = Math.round(
    dimension_scores.reduce((s, d) => s + d.score * (weights[d.code] / 100), 0),
  );
  const { stage, blurb } = stageFor(overall);

  const sorted = [...dimension_scores].sort((a, b) => b.score - a.score);
  const strengths = sorted.filter((d) => d.score >= 60).slice(0, 4);
  const gaps = [...dimension_scores].sort((a, b) => a.score - b.score).slice(0, 4);

  const { state: investment_state, note: investment_note } = investmentState(answers);

  const pains = optionLabels("Q8", arr(answers, "Q8"));
  const outcomes = optionLabels("Q13", arr(answers, "Q13"));
  const requiredCaps = optionLabels("Q15cap", arr(answers, "Q15cap"));
  const successEvidence = optionLabels("Q15ev", arr(answers, "Q15ev"));
  const learnerGroup = optionLabels("Q14", arr(answers, "Q14"));
  const ft1 = typeof answers["FT1"] === "string" ? (answers["FT1"] as string).trim() : "";

  const recommendations = buildRecommendations(
    strengths.length ? gaps : dimension_scores.slice().sort((a, b) => a.score - b.score).slice(0, 4),
    route,
    programmes,
  );

  const tnaLabel =
    route === "individual" || (route === "client" && sub === "individual")
      ? "Personal AI Training Needs Analysis"
      : route === "team" || (route === "client" && sub === "team")
        ? "Team AI Training Needs Analysis"
        : "Indicative Organisation AI Training Needs Analysis";

  const topGap = gaps[0];
  const objective =
    (ft1 ? `${ft1} ` : "") +
    (outcomes.length
      ? `Priority outcomes: ${outcomes.slice(0, 3).join(", ")}.`
      : "Build practical, reliable AI capability applied to real work.");

  const tna_snapshot: TnaSnapshot = {
    label: tnaLabel,
    objective: objective.trim(),
    current_state: `Currently at the ${stage} stage (overall ${overall}/100). ${blurb}`,
    required_capability: requiredCaps.length
      ? requiredCaps
      : ["Use approved AI tools confidently", "Verify outputs and apply judgement", "Apply AI to recurring role tasks"],
    root_cause: topGap
      ? `Lowest capability area is "${topGap.label}" (${topGap.score}/100). ${topGap.interpretation}`
      : "Capability is uneven across dimensions.",
    need_classification: classifyNeeds(dimension_scores, answers),
    learner_group: learnerGroup.length ? learnerGroup : ["Myself / relevant users"],
    recommended_intervention: recommendations.map((r) => `${r.programme_code} — ${r.programme}`),
    success_evidence: successEvidence.length
      ? successEvidence
      : ["Pre-vs-post capability assessment improves", "A learning is applied at work within 7–14 days"],
  };

  const nextStage =
    overall < 25 ? "Emerging" : overall < 45 ? "Developing" : overall < 65 ? "Operational" : "Scaling / Strategic";
  const opportunity_horizon =
    `Today you are ${stage}. With focused capability building over the next quarter, moving toward the ${nextStage} stage is realistic. ` +
    (outcomes.length
      ? `That would translate directly into: ${outcomes.slice(0, 3).join(", ")}. `
      : "") +
    `Stronger capability in ${gaps.slice(0, 2).map((g) => g.label).join(" and ")} would reduce ${
      pains.length ? pains.slice(0, 2).join(" and ").toLowerCase() : "avoidable manual effort and rework"
    }, without requiring guaranteed ROI claims.`;

  const next_path = [
    { phase: "Days 0–30 — Foundations", focus: `Establish reliable everyday capability and safe use (${gaps[0]?.label ?? "core competency"}).` },
    { phase: "Days 30–60 — Applied practice", focus: "Apply AI to real recurring tasks; build reusable prompts / templates for the team." },
    { phase: "Days 60–90 — Reinforcement & transfer", focus: "Standardise what works, confirm workplace application, and reassess capability." },
  ];

  return {
    route,
    overall_score: overall,
    stage,
    stage_blurb: blurb,
    dimension_scores,
    strengths,
    gaps,
    investment_state,
    investment_note,
    pains,
    outcomes,
    tna_snapshot,
    recommendations,
    opportunity_horizon,
    next_path,
  };
}

// Lead priority (PRD §8.5 / §9.4) — decision authority + timing, not score.
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
