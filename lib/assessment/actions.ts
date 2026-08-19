"use server";

import { supabaseService } from "@/lib/supabase/service";
import { getProgrammes } from "@/lib/data/programmes";
import { scoreAssessment, computeLeadPriority } from "./scoring";
import { emailResultToCustomer, emailLeadAlertToTrainer, emailEnquiryAlertToTrainer } from "@/lib/email/send";
import { rateLimit } from "@/lib/security/ratelimit";
import { sha256hex, randomToken } from "@/lib/security/crypto";
import { setAssessmentCookie, getAssessmentToken, setResultCookie, resultCookieAuthorises, ASMT_TTL_SECONDS } from "@/lib/security/session";
import { isAdmin } from "@/lib/auth/require";
import { validateAnswers, validateKyc, validateRoute, validateSubRoute, isValidEmail, sanitizeText } from "@/lib/security/validate";
import type { Route, SubRoute } from "./types";

interface StartInput {
  full_name: string;
  phone: string;
  consent: boolean;
  route: Route;
  client_subroute?: SubRoute;
  language?: string;
  source_page?: string;
}

export async function startAssessment(input: StartInput): Promise<{ leadId: string; assessmentId: string }> {
  const full_name = sanitizeText(input.full_name, 120);
  const phone = sanitizeText(input.phone, 40);
  if (!full_name || !phone) throw new Error("Full name and contact number are required.");
  if (!input.consent) throw new Error("Consent is required to continue.");

  // Abuse control (fail-open: creating an in-progress row exposes no data).
  await rateLimit("start");

  const route = validateRoute(input.route);
  const subroute = validateSubRoute(input.client_subroute);
  const lang = input.language === "bm" ? "bm" : "en";

  const rawToken = randomToken(32);
  const sessionHash = sha256hex(rawToken);
  const expires = new Date(Date.now() + ASMT_TTL_SECONDS * 1000).toISOString();

  const db = supabaseService();
  const { data: lead, error: leadErr } = await db
    .from("leads")
    .insert({ full_name, phone, consent: true, language: lang, source_page: sanitizeText(input.source_page, 40) || "assessment" })
    .select("id").single();
  if (leadErr || !lead) throw new Error("Could not start the assessment. Please try again.");

  const { data: assessment, error: aErr } = await db
    .from("assessments")
    .insert({
      lead_id: lead.id, route, client_subroute: subroute ?? null, language: lang,
      session_token_hash: sessionHash, session_token_expires_at: expires,
    })
    .select("id").single();
  if (aErr || !assessment) throw new Error("Could not start the assessment. Please try again.");

  await setAssessmentCookie(rawToken);
  return { leadId: lead.id, assessmentId: assessment.id };
}

interface CompleteInput {
  assessmentId: string;
  leadId?: string; // ignored (server derives from the session-bound assessment)
  route: Route;
  client_subroute?: SubRoute;
  answers: unknown;
  kyc: unknown;
  lang?: "en" | "bm";
}

export async function completeAssessment(input: CompleteInput): Promise<{ resultId: string }> {
  const rl = await rateLimit("unlock");
  if (rl !== "ok") throw new Error("Too many attempts. Please wait a moment and try again.");

  const token = await getAssessmentToken();
  if (!token) throw new Error("Your session has expired. Please restart the assessment.");

  const kyc = validateKyc(input.kyc);
  if (!isValidEmail(kyc.email) || !kyc.industry || !kyc.country || !kyc.position) {
    throw new Error("Please complete the required unlock fields with a valid email.");
  }

  const route = validateRoute(input.route);
  const subroute = validateSubRoute(input.client_subroute);
  const lang = input.lang === "bm" ? "bm" : "en";
  const answers = validateAnswers(input.answers);

  const programmes = await getProgrammes(true);
  const result = scoreAssessment(route, subroute, answers, programmes, lang);
  const priority = computeLeadPriority(kyc);

  const leadPatch: Record<string, string | null> = {
    email: kyc.email ?? null, industry: kyc.industry ?? null, country: kyc.country ?? null,
    position: kyc.position ?? null, user_context: kyc.user_context ?? null, org_name: kyc.org_name ?? null,
    department: kyc.department ?? null, org_size: kyc.org_size ?? null, training_intent: kyc.training_intent ?? null,
    decision_authority: kyc.decision_authority ?? null, timing: kyc.timing ?? null, language: lang, lead_priority: priority,
  };
  const resultPayload = {
    route, overall_score: result.overall_score, stage: result.stage, dimension_scores: result.dimension_scores,
    strengths: result.strengths, gaps: result.gaps, investment_state: result.investment_state,
    investment_note: result.investment_note, pains: result.pains, outcomes: result.outcomes,
    tna_snapshot: result.tna_snapshot, recommendations: result.recommendations,
    opportunity_horizon: result.opportunity_horizon, next_path: result.next_path,
  };

  const rawResultToken = randomToken(32);
  const tokenHash = sha256hex(rawResultToken);
  const tokenExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const db = supabaseService();
  const { data, error } = await db.rpc("claim_and_create_result", {
    p_assessment_id: input.assessmentId,
    p_session_hash: sha256hex(token),
    p_answers: answers,
    p_lead_patch: leadPatch,
    p_result: resultPayload,
    p_token_hash: tokenHash,
    p_token_expires_at: tokenExpires,
  });
  if (error) throw new Error("Could not generate your result. Please try again.");
  const row = Array.isArray(data) ? data[0] : data;
  const resultId: string | undefined = row?.result_id;
  const isNew: boolean = row?.is_new === true;
  if (!resultId) throw new Error("Could not generate your result. Please try again.");

  await setResultCookie(resultId);

  if (isNew) {
    try {
      const { data: rr } = await db.from("results").select("lead_id").eq("id", resultId).single();
      const leadId = rr?.lead_id;
      if (leadId) {
        const { data: leadRow } = await db.from("leads").select("*").eq("id", leadId).single();
        const resultLike = { id: resultId, overall_score: result.overall_score, stage: result.stage, route, gaps: result.gaps };
        if (leadRow) {
          await emailResultToCustomer(leadRow, resultLike, rawResultToken);
          await emailLeadAlertToTrainer(leadRow, resultLike);
        }
      }
    } catch {
      // emails are best-effort and deduped by the outbox; never break completion
    }
  }

  return { resultId };
}

export async function markResultViewed(resultId: string): Promise<void> {
  if (!(await resultCookieAuthorises(resultId)) && !(await isAdmin())) return;
  const db = supabaseService();
  const { data } = await db.from("results").select("lead_id").eq("id", resultId).maybeSingle();
  if (data?.lead_id) {
    await db.from("leads").update({ result_viewed_at: new Date().toISOString() }).eq("id", data.lead_id);
  }
}

interface EnquiryInput {
  resultId: string;
  leadId?: string | null; // ignored (derived from the authorised result)
  type: "proposal" | "consultation" | "enquiry";
  message?: string;
  preferred_time?: string;
}

export async function createEnquiry(input: EnquiryInput): Promise<{ ok: true }> {
  const rl = await rateLimit("consult");
  if (rl !== "ok") throw new Error("Too many requests. Please wait a moment and try again.");

  const authorised = (await resultCookieAuthorises(input.resultId)) || (await isAdmin());
  if (!authorised) throw new Error("Not authorised.");

  const type = input.type === "consultation" ? "consultation" : input.type === "proposal" ? "proposal" : "enquiry";
  const message = sanitizeText(input.message, 500) || null;
  const preferred = sanitizeText(input.preferred_time, 120) || null;

  const db = supabaseService();
  const { data: res } = await db.from("results").select("lead_id").eq("id", input.resultId).maybeSingle();
  const leadId: string | null = res?.lead_id ?? null;

  const { error } = await db.from("enquiries").insert({
    lead_id: leadId, result_id: input.resultId, type, message, preferred_time: preferred,
  });
  if (error) throw new Error("Could not send your request. Please try again.");

  if (leadId) {
    const status = type === "consultation" ? "booked" : "proposal";
    await db.from("leads").update({ lead_status: status }).eq("id", leadId);
  }
  try {
    const { data: leadRow } = leadId ? await db.from("leads").select("*").eq("id", leadId).single() : { data: null };
    await emailEnquiryAlertToTrainer(leadRow, type, message ?? undefined, preferred ?? undefined);
  } catch {
    // best effort
  }
  return { ok: true };
}
