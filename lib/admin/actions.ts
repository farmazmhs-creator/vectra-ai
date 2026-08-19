"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseService } from "@/lib/supabase/service";
import { requireAdminSession, requireSameOrigin } from "@/lib/auth/require";
import { randomToken, sha256hex } from "@/lib/security/crypto";
import { emailResultResend } from "@/lib/email/send";
import type { ProgrammeInput } from "@/lib/assessment/types";

// Every privileged action independently verifies the admin session (and origin for mutations)
// BEFORE any service-role DB access. Middleware is not the security boundary.
async function guard() {
  await requireAdminSession();
  await requireSameOrigin();
}

export async function deleteLead(leadId: string) {
  await guard();
  const db = supabaseService();
  const { error } = await db.from("leads").delete().eq("id", leadId);
  if (error) throw new Error("Could not delete the lead.");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateLead(leadId: string, patch: { lead_status?: string; lead_priority?: string }) {
  await guard();
  const clean: Record<string, string> = {};
  const STATUS = ["new", "contacted", "qualified", "proposal", "booked", "closed"];
  const PRIORITY = ["high", "standard", "low"];
  if (patch.lead_status && STATUS.includes(patch.lead_status)) clean.lead_status = patch.lead_status;
  if (patch.lead_priority && PRIORITY.includes(patch.lead_priority)) clean.lead_priority = patch.lead_priority;
  if (!Object.keys(clean).length) return;
  const db = supabaseService();
  const { error } = await db.from("leads").update(clean).eq("id", leadId);
  if (error) throw new Error("Could not update the lead.");
  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin");
}

export async function addNote(leadId: string, body: string) {
  await guard();
  const text = (body ?? "").replace(/\s+/g, " ").trim().slice(0, 2000);
  if (!text) return;
  const db = supabaseService();
  const { error } = await db.from("lead_notes").insert({ lead_id: leadId, body: text });
  if (error) throw new Error("Could not add the note.");
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function deleteNote(noteId: string, leadId: string) {
  await guard();
  const db = supabaseService();
  const { error } = await db.from("lead_notes").delete().eq("id", noteId);
  if (error) throw new Error("Could not delete the note.");
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function updateEnquiry(id: string, status: string) {
  await guard();
  const allowed = ["open", "actioned", "closed"];
  if (!allowed.includes(status)) return;
  const db = supabaseService();
  const { error } = await db.from("enquiries").update({ status }).eq("id", id);
  if (error) throw new Error("Could not update the request.");
  revalidatePath("/admin");
}

// Deliberate resend: rotate the result bearer (invalidating the old emailed link), send a fresh
// email logged as a new auditable attempt. Does not delete the original logical event.
export async function resendResultEmail(resultId: string) {
  await guard();
  const db = supabaseService();
  const { data: result } = await db.from("results").select("id, lead_id, overall_score, stage, route, gaps").eq("id", resultId).single();
  if (!result?.lead_id) throw new Error("Result not found.");
  const { data: lead } = await db.from("leads").select("*").eq("id", result.lead_id).single();
  if (!lead?.email) throw new Error("This lead has no email address.");
  const rawToken = randomToken(32);
  const { error: rotErr } = await db.from("results").update({
    public_token_hash: sha256hex(rawToken),
    public_token_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    public_token_revoked_at: null,
  }).eq("id", resultId);
  if (rotErr) throw new Error("Could not rotate the access link.");
  await emailResultResend(lead, { id: result.id, overall_score: result.overall_score, stage: result.stage, route: result.route, gaps: result.gaps ?? [] }, rawToken);
  revalidatePath(`/admin/leads/${result.lead_id}`);
}

export async function saveProgramme(input: ProgrammeInput) {
  await guard();
  const db = supabaseService();
  const payload = {
    code: input.code.trim(), title: input.title.trim(), summary: input.summary,
    modules: input.modules, target_dimensions: input.target_dimensions,
    intended_capability: input.intended_capability, route_fit: input.route_fit,
    active: input.active, sort_order: input.sort_order,
    title_bm: input.title_bm ?? null, summary_bm: input.summary_bm ?? null,
    intended_capability_bm: input.intended_capability_bm ?? null, modules_bm: input.modules_bm ?? [],
  };
  if (!payload.code || !payload.title) throw new Error("Code and title are required.");
  if (input.id) {
    const { error } = await db.from("programmes").update(payload).eq("id", input.id);
    if (error) throw new Error("Could not save the programme.");
  } else {
    const { error } = await db.from("programmes").insert(payload);
    if (error) throw new Error("Could not save the programme.");
  }
  revalidatePath("/admin/programmes");
  revalidatePath("/");
}

export async function deleteProgramme(id: string) {
  await guard();
  const db = supabaseService();
  const { error } = await db.from("programmes").delete().eq("id", id);
  if (error) throw new Error("Could not delete the programme.");
  revalidatePath("/admin/programmes");
  revalidatePath("/");
}
