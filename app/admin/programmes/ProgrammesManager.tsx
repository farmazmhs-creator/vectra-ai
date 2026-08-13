"use client";

import { useState, useTransition } from "react";
import { saveProgramme, deleteProgramme } from "@/lib/admin/actions";
import type { DimensionCode, Programme, ProgrammeInput } from "@/lib/assessment/types";
import { DIMENSION_LABELS } from "@/lib/assessment/questions";

const DIMS = Object.keys(DIMENSION_LABELS) as DimensionCode[];
const ROUTES = ["individual", "team", "organisation", "client"];

const EMPTY: ProgrammeInput = {
  code: "", title: "", summary: "", modules: [], target_dimensions: [], intended_capability: "", route_fit: [], active: true, sort_order: 100,
  title_bm: "", summary_bm: "", intended_capability_bm: "", modules_bm: [],
};

export function ProgrammesManager({ programmes }: { programmes: Programme[] }) {
  const [editing, setEditing] = useState<ProgrammeInput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function edit(p: Programme) {
    setError(null);
    setEditing({
      id: p.id, code: p.code, title: p.title, summary: p.summary ?? "", modules: p.modules ?? [],
      target_dimensions: p.target_dimensions ?? [], intended_capability: p.intended_capability ?? "",
      route_fit: p.route_fit ?? [], active: p.active, sort_order: p.sort_order,
      title_bm: p.title_bm ?? "", summary_bm: p.summary_bm ?? "", intended_capability_bm: p.intended_capability_bm ?? "", modules_bm: p.modules_bm ?? [],
    });
  }

  function save() {
    if (!editing) return;
    setError(null);
    start(async () => {
      try {
        await saveProgramme(editing);
        setEditing(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Save failed");
      }
    });
  }

  function toggle<T>(list: T[], v: T): T[] {
    return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
  }

  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-5 items-start">
      <div className="grid gap-3">
        {programmes.map((p) => (
          <div key={p.id} className="panel p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="badge" style={{ color: "var(--accent-2)" }}>{p.code}</span>
                  {!p.active && <span className="badge" style={{ color: "var(--muted-2)" }}>inactive</span>}
                </div>
                <div className="font-semibold mt-1.5">{p.title}</div>
                <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>{p.summary}</div>
                <div className="text-xs mt-2" style={{ color: "var(--muted-2)" }}>Targets: {(p.target_dimensions ?? []).join(", ") || "—"}</div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button className="btn btn-ghost" style={{ padding: "0.35rem 0.75rem", fontSize: 13 }} onClick={() => edit(p)}>Edit</button>
                <button className="link-muted text-xs" onClick={() => start(() => deleteProgramme(p.id))}>Delete</button>
              </div>
            </div>
          </div>
        ))}
        {programmes.length === 0 && <p style={{ color: "var(--muted)" }}>No programmes yet.</p>}
        <button className="btn btn-primary mt-2" style={{ width: "fit-content" }} onClick={() => { setError(null); setEditing({ ...EMPTY }); }}>+ New programme</button>
      </div>

      {editing && (
        <div className="panel p-5 lg:sticky lg:top-20">
          <h3 className="font-semibold mb-3">{editing.id ? "Edit programme" : "New programme"}</h3>
          {error && <div className="text-sm mb-3" style={{ color: "var(--red)" }}>{error}</div>}
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="field-label">Code</label><input className="input" value={editing.code} onChange={(e) => setEditing({ ...editing, code: e.target.value })} /></div>
              <div><label className="field-label">Sort order</label><input className="input" type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></div>
            </div>
            <div><label className="field-label">Title</label><input className="input" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
            <div><label className="field-label">Summary</label><textarea className="textarea" rows={2} value={editing.summary} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} /></div>
            <div><label className="field-label">Modules (one per line)</label><textarea className="textarea" rows={3} value={editing.modules.join("\n")} onChange={(e) => setEditing({ ...editing, modules: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} /></div>
            <div><label className="field-label">Intended capability</label><textarea className="textarea" rows={2} value={editing.intended_capability} onChange={(e) => setEditing({ ...editing, intended_capability: e.target.value })} /></div>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
              <div className="badge mb-2" style={{ color: "var(--accent-2)" }}>Bahasa Malaysia</div>
              <label className="field-label">Tajuk (BM)</label>
              <input className="input mb-2" value={editing.title_bm ?? ""} onChange={(e) => setEditing({ ...editing, title_bm: e.target.value })} placeholder="Falls back to English if empty" />
              <label className="field-label">Ringkasan (BM)</label>
              <textarea className="textarea mb-2" rows={2} value={editing.summary_bm ?? ""} onChange={(e) => setEditing({ ...editing, summary_bm: e.target.value })} />
              <label className="field-label">Modul (BM, satu setiap baris)</label>
              <textarea className="textarea mb-2" rows={3} value={(editing.modules_bm ?? []).join("\n")} onChange={(e) => setEditing({ ...editing, modules_bm: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} />
              <label className="field-label">Keupayaan disasarkan (BM)</label>
              <textarea className="textarea" rows={2} value={editing.intended_capability_bm ?? ""} onChange={(e) => setEditing({ ...editing, intended_capability_bm: e.target.value })} />
            </div>

            <div>
              <label className="field-label">Target dimensions</label>
              <div className="flex flex-wrap gap-1.5">
                {DIMS.map((d) => (
                  <button key={d} className={`badge ${editing.target_dimensions.includes(d) ? "" : ""}`} style={{ cursor: "pointer", color: editing.target_dimensions.includes(d) ? "var(--accent-2)" : "var(--muted-2)", borderColor: editing.target_dimensions.includes(d) ? "var(--accent)" : "var(--border-2)" }} onClick={() => setEditing({ ...editing, target_dimensions: toggle(editing.target_dimensions, d) })}>{d}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="field-label">Route fit</label>
              <div className="flex flex-wrap gap-1.5">
                {ROUTES.map((r) => (
                  <button key={r} className="badge" style={{ cursor: "pointer", textTransform: "capitalize", color: editing.route_fit.includes(r) ? "var(--accent-2)" : "var(--muted-2)", borderColor: editing.route_fit.includes(r) ? "var(--accent)" : "var(--border-2)" }} onClick={() => setEditing({ ...editing, route_fit: toggle(editing.route_fit, r) })}>{r}</button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm" style={{ color: "var(--muted)" }}>
              <input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Active (shown on site & used for recommendations)
            </label>
            <div className="flex gap-3 mt-1">
              <button className="btn btn-ghost" onClick={() => setEditing(null)} disabled={pending}>Cancel</button>
              <button className="btn btn-primary flex-1" onClick={save} disabled={pending}>{pending ? "Saving…" : "Save programme"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
