"use server";

import { revalidatePath } from "next/cache";
import { supabaseData } from "@/lib/supabase/data";
import type { ProgrammeInput } from "@/lib/assessment/types";

export async function updateLead(leadId: string, patch: { lead_status?: string; lead_priority?: string }) {
  const db = supabaseData();
  const { error } = await db.from("leads").update(patch).eq("id", leadId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin");
}

export async function addNote(leadId: string, body: string) {
  if (!body.trim()) return;
  const db = supabaseData();
  const { error } = await db.from("lead_notes").insert({ lead_id: leadId, body: body.trim() });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function deleteNote(noteId: string, leadId: string) {
  const db = supabaseData();
  const { error } = await db.from("lead_notes").delete().eq("id", noteId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function updateEnquiry(id: string, status: string) {
  const db = supabaseData();
  const { error } = await db.from("enquiries").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function saveProgramme(input: ProgrammeInput) {
  const db = supabaseData();
  const payload = {
    code: input.code.trim(),
    title: input.title.trim(),
    summary: input.summary,
    modules: input.modules,
    target_dimensions: input.target_dimensions,
    intended_capability: input.intended_capability,
    route_fit: input.route_fit,
    active: input.active,
    sort_order: input.sort_order,
  };
  if (!payload.code || !payload.title) throw new Error("Code and title are required.");
  if (input.id) {
    const { error } = await db.from("programmes").update(payload).eq("id", input.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await db.from("programmes").insert(payload);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/admin/programmes");
  revalidatePath("/");
}

export async function deleteProgramme(id: string) {
  const db = supabaseData();
  const { error } = await db.from("programmes").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/programmes");
  revalidatePath("/");
}
