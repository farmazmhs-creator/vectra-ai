"use client";

import { useState, useTransition } from "react";
import { updateLead, addNote, deleteNote } from "@/lib/admin/actions";

const STATUSES = ["new", "contacted", "qualified", "proposal", "booked", "closed"];
const PRIORITIES = ["high", "standard", "low"];

interface Note { id: string; body: string; author: string; created_at: string; }

export function LeadControls({
  leadId,
  status,
  priority,
  notes,
}: {
  leadId: string;
  status: string;
  priority: string;
  notes: Note[];
}) {
  const [s, setS] = useState(status);
  const [p, setP] = useState(priority);
  const [body, setBody] = useState("");
  const [pending, start] = useTransition();

  return (
    <div className="grid gap-5">
      <div className="panel p-5">
        <h3 className="font-semibold mb-3">Pipeline</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="field-label">Status</label>
            <select className="select" value={s} onChange={(e) => { setS(e.target.value); start(() => updateLead(leadId, { lead_status: e.target.value })); }}>
              {STATUSES.map((x) => <option key={x} value={x} style={{ textTransform: "capitalize" }}>{x}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Priority</label>
            <select className="select" value={p} onChange={(e) => { setP(e.target.value); start(() => updateLead(leadId, { lead_priority: e.target.value })); }}>
              {PRIORITIES.map((x) => <option key={x} value={x} style={{ textTransform: "capitalize" }}>{x}</option>)}
            </select>
          </div>
        </div>
        {pending && <div className="text-xs mt-2" style={{ color: "var(--muted-2)" }}>Saving…</div>}
      </div>

      <div className="panel p-5">
        <h3 className="font-semibold mb-3">Notes</h3>
        <div className="grid gap-2 mb-3">
          {notes.length === 0 && <p className="text-sm" style={{ color: "var(--muted-2)" }}>No notes yet.</p>}
          {notes.map((n) => (
            <div key={n.id} className="panel-2 p-3 flex items-start justify-between gap-3">
              <div>
                <div className="text-sm">{n.body}</div>
                <div className="text-xs mt-1" style={{ color: "var(--muted-2)" }}>{n.author} · {new Date(n.created_at).toLocaleString()}</div>
              </div>
              <button className="link-muted text-xs" onClick={() => start(() => deleteNote(n.id, leadId))}>Delete</button>
            </div>
          ))}
        </div>
        <textarea className="textarea" rows={2} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Add a follow-up note…" />
        <button
          className="btn btn-primary mt-3"
          style={{ padding: "0.5rem 1rem", fontSize: 14 }}
          disabled={!body.trim() || pending}
          onClick={() => { const b = body; setBody(""); start(() => addNote(leadId, b)); }}
        >
          Add note
        </button>
      </div>
    </div>
  );
}
