import { supabaseService } from "@/lib/supabase/service";
import type { Programme } from "@/lib/assessment/types";

export async function getProgrammes(activeOnly = false): Promise<Programme[]> {
  const db = supabaseService();
  let q = db.from("programmes").select("*").order("sort_order", { ascending: true });
  if (activeOnly) q = q.eq("active", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Programme[];
}
