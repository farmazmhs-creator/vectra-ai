// Shared assessment / diagnostic types for Vectra AI

export type Route = "individual" | "team" | "organisation" | "client";
export type SubRoute = "individual" | "team" | "organisation";

export type DimensionCode =
  | "D1" | "D2" | "D3" | "D4" | "D5" | "D6" | "D7" | "D8";

// Raw answers keyed by question code. Scored questions store a 0-4 number.
// Multi-selects store string[] of option codes. Free text stores string.
export type Answers = Record<string, number | string | string[] | null | undefined>;

export interface KycProfile {
  user_context?: string;
  email?: string;
  industry?: string;
  country?: string;
  position?: string;
  training_intent?: string;
  decision_authority?: string;
  org_name?: string;
  department?: string;
  org_size?: string;
  client_details?: string;
  timing?: string;
}

export interface Programme {
  id: string;
  code: string;
  title: string;
  summary: string | null;
  modules: string[];
  target_dimensions: DimensionCode[];
  intended_capability: string | null;
  route_fit: string[];
  active: boolean;
  sort_order: number;
}

export interface ProgrammeInput {
  id?: string;
  code: string;
  title: string;
  summary: string;
  modules: string[];
  target_dimensions: DimensionCode[];
  intended_capability: string;
  route_fit: string[];
  active: boolean;
  sort_order: number;
}

export interface DimensionScore {
  code: DimensionCode;
  label: string;
  score: number; // 0-100
  interpretation: string;
}

export interface Recommendation {
  gap: string;
  programme_code: string;
  programme: string;
  intended_capability: string;
}

export interface TnaSnapshot {
  label: string; // Personal / Team / Indicative Organisation AI TNA
  objective: string;
  current_state: string;
  required_capability: string[];
  root_cause: string;
  need_classification: string[]; // training | tool/access | governance | process | leadership
  learner_group: string[];
  recommended_intervention: string[];
  success_evidence: string[];
}

export interface DiagnosticResult {
  route: Route;
  overall_score: number;
  stage: string;
  stage_blurb: string;
  dimension_scores: DimensionScore[];
  strengths: DimensionScore[];
  gaps: DimensionScore[];
  investment_state: string;
  investment_note: string;
  pains: string[];
  outcomes: string[];
  tna_snapshot: TnaSnapshot;
  recommendations: Recommendation[];
  opportunity_horizon: string;
  next_path: { phase: string; focus: string }[];
}
