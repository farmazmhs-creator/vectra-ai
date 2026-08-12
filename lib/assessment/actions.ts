"use server";

import { supabaseData } from "@/lib/supabase/data";
import { getProgrammes } from "@/lib/data/programmes";
import { scoreAssessment, computeLeadPriority } from "./scoring";
import type { Answers, KycProfile, Route, SubRoute } from "./types";

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
  if (!input.full_name?.trim() || !input.phone?.trim()) {
    throw new Error("Full name and contact number are required.");
  }
  if (!input.consent) {
    throw new Error("Consent is required to continue.");
  }
  const db = supabaseData();

  const { data: lead, error: leadErr } = await db
    .from("leads")
    .insert({
      full_name: input.full_name.trim(),
      phone: input.phone.trim(),
      consent: input.consent,
      language: input.language ?? "en",
      source_page: input.source_page ?? "assessment",
    })
    .select("id")
    .single();
  if (leadErr) throw new Error(leadErr.message);

  const { data: assessment, error: aErr } = await db
    .from("assessments")
    .insert({
      lead_id: lead.id,
      route: input.route,
      client_subroute: input.client_subroute ?? null,
      language: input.language ?? "en",
    })
    .select("id")
    .single();
  if (aErr) throw new Error(aErr.message);

  return { leadId: lead.id, assessmentId: assessment.id };
}

interface CompleteInput {
  leadId: string;
  assessmentId: string;
  route: Route;
  client_subroute?: SubRoute;
  answers: Answers;
  kyc: KycProfile;
  lang?: "en" | "bm";
}

export async function completeAssessment(input: CompleteInput): Promise<{ resultId: string }> {
  const db = supabaseData();
  const { kyc } = input;

  if (!kyc.email?.trim() || !kyc.industry || !kyc.country || !kyc.position) {
    throw new Error("Please complete the required unlock fields.");
  }

  const lang = input.lang === "bm" ? "bm" : "en";
  const programmes = await getProgrammes(true);
  const result = scoreAssessment(input.route, input.client_subroute, input.answers, programmes, lang);
  const priority = computeLeadPriority(kyc);

  // 1. persist the answers + complete the assessment
  const { error: aErr } = await db
    .from("assessments")
    .update({
      answers: input.answers,
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .eq("id", input.assessmentId);
  if (aErr) throw new Error(aErr.message);

  // 2. update the lead with KYC profile
  const { error: lErr } = await db
    .from("leads")
    .update({
      user_context: kyc.user_context ?? null,
      email: kyc.email?.trim() ?? null,
      industry: kyc.industry ?? null,
      country: kyc.country ?? null,
      position: kyc.position ?? null,
      training_intent: kyc.training_intent ?? null,
      decision_authority: kyc.decision_authority ?? null,
      org_name: kyc.org_name ?? null,
      department: kyc.department ?? null,
      org_size: kyc.org_size ?? null,
      client_details: kyc.client_details ?? null,
      timing: kyc.timing ?? null,
      language: lang,
      kyc_completed_at: new Date().toISOString(),
      lead_priority: priority,
    })
    .eq("id", input.leadId);
  if (lErr) throw new Error(lErr.message);

  // 3. store the deterministic result
  const { data: row, error: rErr } = await db
    .from("results")
    .insert({
      assessment_id: input.assessmentId,
      lead_id: input.leadId,
      route: input.route,
      overall_score: result.overall_score,
      stage: result.stage,
      dimension_scores: result.dimension_scores,
      strengths: result.strengths,
      gaps: result.gaps,
      investment_state: result.investment_state,
      investment_note: result.investment_note,
      pains: result.pains,
      outcomes: result.outcomes,
      tna_snapshot: result.tna_snapshot,
      recommendations: result.recommendations,
      opportunity_horizon: result.opportunity_horizon,
      next_path: result.next_path,
    })
    .select("id")
    .single();
  if (rErr) throw new Error(rErr.message);

  return { resultId: row.id };
}

export async function markResultViewed(leadId: string): Promise<void> {
  const db = supabaseData();
  await db.from("leads").update({ result_viewed_at: new Date().toISOString() }).eq("id", leadId);
}

interface EnquiryInput {
  leadId?: string | null;
  resultId?: string | null;
  type: "proposal" | "consultation" | "enquiry";
  message?: string;
  preferred_time?: string;
}

export async function createEnquiry(input: EnquiryInput): Promise<{ ok: true }> {
  const db = supabaseData();
  const { error } = await db.from("enquiries").insert({
    lead_id: input.leadId ?? null,
    result_id: input.resultId ?? null,
    type: input.type,
    message: input.message ?? null,
    preferred_time: input.preferred_time ?? null,
  });
  if (error) throw new Error(error.message);
  // Bump lead status to reflect commercial intent
  if (input.leadId) {
    const status = input.type === "consultation" ? "booked" : "proposal";
    await db.from("leads").update({ lead_status: status }).eq("id", input.leadId);
  }
  return { ok: true };
}
