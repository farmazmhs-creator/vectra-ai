import { QUESTIONS } from "@/lib/assessment/questions";
import type { Answers, KycProfile, Route, SubRoute } from "@/lib/assessment/types";

// Strip ASCII control chars (by codepoint, no control-char literal), collapse whitespace, trim, cap.
export function sanitizeText(input: unknown, max = 200): string {
  if (typeof input !== "string") return "";
  let out = "";
  for (const ch of input) {
    const c = ch.codePointAt(0) ?? 0;
    out += c < 32 || c === 127 ? " " : ch;
  }
  return out.replace(/\s+/g, " ").trim().slice(0, max);
}

const ROUTES: Route[] = ["individual", "team", "organisation", "client"];
const SUBROUTES: SubRoute[] = ["individual", "team", "organisation"];

export function validateRoute(r: unknown): Route {
  if (typeof r === "string" && (ROUTES as string[]).includes(r)) return r as Route;
  return "individual";
}
export function validateSubRoute(r: unknown): SubRoute | undefined {
  if (typeof r === "string" && (SUBROUTES as string[]).includes(r)) return r as SubRoute;
  return undefined;
}

// Rebuild a clean answers object: only known question codes, values validated per type.
// Rejects unknown keys (never persisted). Never trusts client-sent internal fields.
export function validateAnswers(input: unknown): Answers {
  const out: Answers = {};
  if (!input || typeof input !== "object") return out;
  const src = input as Record<string, unknown>;
  for (const q of QUESTIONS) {
    const v = src[q.code];
    if (v === undefined || v === null) continue;
    if (q.type === "single") {
      const opt = q.options?.find(
        (o) => (o.value !== undefined && Number(v) === o.value) || o.code === v,
      );
      if (opt) out[q.code] = opt.value !== undefined ? opt.value : opt.code;
    } else if (q.type === "multi") {
      if (Array.isArray(v)) {
        const codes = new Set(q.options?.map((o) => o.code));
        const picked = (v as unknown[])
          .filter((x): x is string => typeof x === "string" && codes.has(x))
          .slice(0, q.maxSelect ?? 8);
        if (picked.length) out[q.code] = picked;
      }
    } else if (q.type === "text") {
      const t = sanitizeText(v, q.maxLen ?? 250);
      if (t) out[q.code] = t;
    }
  }
  return out;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Whitelisted KYC. Unknown keys dropped; lengths capped.
export function validateKyc(input: unknown): KycProfile {
  const src = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const s = (k: string, max = 120) => sanitizeText(src[k], max);
  return {
    user_context: s("user_context", 40) || undefined,
    email: s("email", 160) || undefined,
    industry: s("industry", 80) || undefined,
    country: s("country", 80) || undefined,
    position: s("position", 120) || undefined,
    training_intent: s("training_intent", 40) || undefined,
    decision_authority: s("decision_authority", 40) || undefined,
    org_name: s("org_name", 160) || undefined,
    department: s("department", 120) || undefined,
    org_size: s("org_size", 40) || undefined,
    client_details: s("client_details", 200) || undefined,
    timing: s("timing", 40) || undefined,
  };
}

export function isValidEmail(email: string | undefined): boolean {
  return typeof email === "string" && EMAIL_RE.test(email) && email.length <= 160;
}
