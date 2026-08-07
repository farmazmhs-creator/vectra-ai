"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Brand } from "@/app/components/Chrome";
import { visibleQuestions, ROUTE_LABELS } from "@/lib/assessment/questions";
import type { Question } from "@/lib/assessment/questions";
import type { Answers, KycProfile, Route, SubRoute } from "@/lib/assessment/types";
import { startAssessment, completeAssessment } from "@/lib/assessment/actions";

type Phase = "route" | "entry" | "questions" | "kyc";

const ROUTE_CHOICES: { route: Route; title: string; desc: string }[] = [
  { route: "individual", title: "Myself", desc: "Individual AI Capability Profile" },
  { route: "team", title: "My team or department", desc: "Team AI Capability Assessment" },
  { route: "organisation", title: "My organisation", desc: "Organisation AI Readiness Snapshot" },
  { route: "client", title: "My client", desc: "Consultant / training-provider route" },
];

const SUBROUTE_CHOICES: { sub: SubRoute; title: string }[] = [
  { sub: "individual", title: "An individual client" },
  { sub: "team", title: "A client's team or department" },
  { sub: "organisation", title: "A client's organisation" },
];

const INDUSTRIES = ["Financial Services", "Manufacturing", "Technology / Software", "Professional Services", "Healthcare", "Education", "Government / Public Sector", "Retail / E-commerce", "Oil & Gas / Energy", "Telecommunications", "Logistics / Supply Chain", "Non-profit", "Other"];
const COUNTRIES = ["Malaysia", "Singapore", "Indonesia", "Thailand", "Philippines", "Vietnam", "Brunei", "United Arab Emirates", "United Kingdom", "Australia", "Other"];
const DEPARTMENTS = ["Organisation-wide / multiple departments", "Finance and Accounting", "Human Resources / People & Culture", "Learning and Development (L&D)", "Talent Development / Talent Management", "Shared Services or Operations", "Sales and Business Development", "Marketing and Communications", "Customer Service", "Information Technology", "Procurement and Supply Chain", "Project Management", "Leadership or Management", "Other"];
const ORG_SIZES = ["1–10 employees", "11–50", "51–200", "201–500", "501–1,000", "1,001–5,000", "More than 5,000", "Not sure"];

export default function AssessmentClient() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("route");
  const [route, setRoute] = useState<Route>("individual");
  const [subRoute, setSubRoute] = useState<SubRoute | undefined>(undefined);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);

  const [ids, setIds] = useState<{ leadId: string; assessmentId: string } | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [qIndex, setQIndex] = useState(0);

  const [kyc, setKyc] = useState<KycProfile>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const questions = useMemo(() => visibleQuestions(answers, route), [answers, route]);
  const current: Question | undefined = questions[qIndex];

  function setAnswer(code: string, value: Answers[string]) {
    setAnswers((prev) => ({ ...prev, [code]: value }));
  }

  function toggleMulti(code: string, opt: string, maxSelect?: number) {
    setAnswers((prev) => {
      const existing = Array.isArray(prev[code]) ? [...(prev[code] as string[])] : [];
      const idx = existing.indexOf(opt);
      if (idx >= 0) existing.splice(idx, 1);
      else {
        if (maxSelect && existing.length >= maxSelect) existing.shift();
        existing.push(opt);
      }
      return { ...prev, [code]: existing };
    });
  }

  async function beginAssessment() {
    setError(null);
    if (!fullName.trim() || !phone.trim()) return setError("Please enter your name and contact number.");
    if (!consent) return setError("Please confirm consent to continue.");
    setBusy(true);
    try {
      const res = await startAssessment({
        full_name: fullName,
        phone,
        consent,
        route,
        client_subroute: route === "client" ? subRoute : undefined,
        source_page: "assessment",
      });
      setIds(res);
      setPhase("questions");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function answered(q: Question): boolean {
    const v = answers[q.code];
    if (q.type === "single") return v !== undefined && v !== null;
    return true; // multi / text are optional to reduce friction
  }

  function nextQuestion() {
    setError(null);
    if (current && current.type === "single" && !answered(current)) {
      return setError("Please choose an option to continue.");
    }
    if (qIndex < questions.length - 1) setQIndex((i) => i + 1);
    else setPhase("kyc");
  }

  function prevQuestion() {
    setError(null);
    if (qIndex > 0) setQIndex((i) => i - 1);
    else setPhase("entry");
  }

  async function submitKyc() {
    setError(null);
    const isOrg = kyc.user_context === "organisation";
    if (!kyc.user_context) return setError("Please tell us your context.");
    if (!kyc.email?.trim()) return setError("Email address is required to unlock your results.");
    if (!/^\S+@\S+\.\S+$/.test(kyc.email)) return setError("Please enter a valid email address.");
    if (!kyc.industry) return setError("Please select your industry.");
    if (!kyc.country) return setError("Please select your country / region.");
    if (!kyc.position?.trim()) return setError("Please enter your position or job title.");
    if (!kyc.training_intent) return setError("Please select your training intent.");
    if (!kyc.decision_authority) return setError("Please select your decision authority.");
    if (isOrg && !kyc.org_name?.trim()) return setError("Please enter your organisation name.");
    if (!ids) return setError("Session expired. Please restart the assessment.");

    setBusy(true);
    try {
      const { resultId } = await completeAssessment({
        leadId: ids.leadId,
        assessmentId: ids.assessmentId,
        route,
        client_subroute: route === "client" ? subRoute : undefined,
        answers,
        kyc,
      });
      router.push(`/result/${resultId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not generate your result. Please try again.");
      setBusy(false);
    }
  }

  const totalSteps = questions.length;
  const progress =
    phase === "questions" ? Math.round(((qIndex + 1) / (totalSteps + 1)) * 100) : phase === "kyc" ? 96 : 0;

  return (
    <div className="min-h-screen gradient-hero">
      <div className="container-x py-6 flex items-center justify-between">
        <Brand />
        <span className="badge badge-free">100% FREE · No obligation</span>
      </div>

      <div className="container-x pb-20" style={{ maxWidth: 760 }}>
        {(phase === "questions" || phase === "kyc") && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2 text-sm" style={{ color: "var(--muted)" }}>
              <span>{phase === "kyc" ? "Unlock your results" : `${current?.section ?? ""}`}</span>
              <span>
                {phase === "kyc" ? "Final step" : `Question ${qIndex + 1} of ${totalSteps}`}
              </span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {error && (
          <div className="panel-2 mb-4" style={{ borderColor: "rgba(255,107,125,0.5)", padding: "0.75rem 1rem", color: "var(--red)" }}>
            {error}
          </div>
        )}

        {/* ── ROUTE ── */}
        {phase === "route" && (
          <div className="panel p-6 sm:p-8">
            <p className="kicker mb-2">Free AI Readiness Assessment</p>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Who are you completing this assessment for?</h1>
            <p style={{ color: "var(--muted)" }} className="mb-6">
              This takes 5–7 minutes. No payment required. You&apos;ll get your AI capability result, key gaps, an Instant
              TNA Snapshot and recommended next steps — instantly.
            </p>
            <div className="grid gap-3">
              {ROUTE_CHOICES.map((c) => (
                <button
                  key={c.route}
                  className={`opt ${route === c.route ? "selected" : ""}`}
                  onClick={() => {
                    setRoute(c.route);
                    if (c.route !== "client") setSubRoute(undefined);
                  }}
                >
                  <span className="dot" />
                  <span>
                    <span className="block font-semibold">{c.title}</span>
                    <span className="block text-sm" style={{ color: "var(--muted)" }}>{c.desc}</span>
                  </span>
                </button>
              ))}
            </div>

            {route === "client" && (
              <div className="mt-5">
                <p className="field-label">Who is being assessed?</p>
                <div className="grid gap-3">
                  {SUBROUTE_CHOICES.map((s) => (
                    <button key={s.sub} className={`opt ${subRoute === s.sub ? "selected" : ""}`} onClick={() => setSubRoute(s.sub)}>
                      <span className="dot" />
                      <span className="font-medium">{s.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              className="btn btn-primary w-full mt-6"
              disabled={route === "client" && !subRoute}
              onClick={() => setPhase("entry")}
            >
              Continue
            </button>
          </div>
        )}

        {/* ── ENTRY (Stage 1) ── */}
        {phase === "entry" && (
          <div className="panel p-6 sm:p-8">
            <p className="kicker mb-2">{ROUTE_LABELS[route]}</p>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Start My Free Assessment</h1>
            <p style={{ color: "var(--muted)" }} className="mb-6">
              Just two details to begin — no payment, no obligation. You&apos;ll answer a few structured questions, then
              unlock your personalised results.
            </p>
            <div className="grid gap-4">
              <div>
                <label className="field-label">Full name</label>
                <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Aisyah Rahman" />
              </div>
              <div>
                <label className="field-label">Contact number</label>
                <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. +60 12-345 6789" />
              </div>
              <label className="flex items-start gap-3 text-sm" style={{ color: "var(--muted)" }}>
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ marginTop: 3 }} />
                <span>I consent to continue and to the processing of the data I submit, so my results can be generated and a follow-up made if I request one.</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="btn btn-ghost" onClick={() => setPhase("route")}>Back</button>
              <button className="btn btn-primary flex-1" disabled={busy} onClick={beginAssessment}>
                {busy ? "Starting…" : "Start My Free Assessment"}
              </button>
            </div>
          </div>
        )}

        {/* ── QUESTIONS ── */}
        {phase === "questions" && current && (
          <div className="panel p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-1">{current.prompt}</h2>
            {current.help && <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>{current.help}</p>}
            {!current.help && <div className="mb-5" />}

            {current.type === "single" && (
              <div className="grid gap-3">
                {current.options!.map((o) => {
                  const selected = Number(answers[current.code]) === o.value;
                  return (
                    <button
                      key={o.code}
                      className={`opt ${selected ? "selected" : ""}`}
                      onClick={() => setAnswer(current.code, o.value!)}
                    >
                      <span className="dot" />
                      <span>{o.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {current.type === "multi" && (
              <div className="grid gap-3">
                {current.options!.map((o) => {
                  const arr = Array.isArray(answers[current.code]) ? (answers[current.code] as string[]) : [];
                  const selected = arr.includes(o.code);
                  return (
                    <button
                      key={o.code}
                      className={`opt multi ${selected ? "selected" : ""}`}
                      onClick={() => toggleMulti(current.code, o.code, current.maxSelect)}
                    >
                      <span className="dot" />
                      <span>{o.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {current.type === "text" && (
              <textarea
                className="textarea"
                rows={3}
                maxLength={current.maxLen ?? 250}
                value={(answers[current.code] as string) ?? ""}
                onChange={(e) => setAnswer(current.code, e.target.value)}
                placeholder="Type a short answer…"
              />
            )}

            <div className="flex gap-3 mt-6">
              <button className="btn btn-ghost" onClick={prevQuestion}>Back</button>
              <button className="btn btn-primary flex-1" onClick={nextQuestion}>
                {qIndex < questions.length - 1 ? "Next" : "Continue to unlock"}
              </button>
            </div>
          </div>
        )}

        {/* ── KYC UNLOCK (Stage 3) ── */}
        {phase === "kyc" && (
          <div className="panel p-6 sm:p-8">
            <p className="kicker mb-2">Your free assessment is complete</p>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Unlock your personalised results</h1>
            <p style={{ color: "var(--muted)" }} className="mb-6">
              Tell us a little more about your context to unlock your free results, Instant TNA Snapshot and training
              recommendations.
            </p>

            <div className="grid gap-4">
              <div>
                <label className="field-label">I am completing this as *</label>
                <select className="select" value={kyc.user_context ?? ""} onChange={(e) => setKyc({ ...kyc, user_context: e.target.value })}>
                  <option value="">Select…</option>
                  <option value="individual">An individual / for my own development</option>
                  <option value="organisation">Representing a company or organisation</option>
                </select>
              </div>
              <div>
                <label className="field-label">Email address *</label>
                <input className="input" value={kyc.email ?? ""} onChange={(e) => setKyc({ ...kyc, email: e.target.value })} placeholder="you@company.com" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Industry *</label>
                  <select className="select" value={kyc.industry ?? ""} onChange={(e) => setKyc({ ...kyc, industry: e.target.value })}>
                    <option value="">Select…</option>
                    {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Country / region *</label>
                  <select className="select" value={kyc.country ?? ""} onChange={(e) => setKyc({ ...kyc, country: e.target.value })}>
                    <option value="">Select…</option>
                    {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="field-label">Position / job title *</label>
                <input className="input" value={kyc.position ?? ""} onChange={(e) => setKyc({ ...kyc, position: e.target.value })} placeholder="e.g. L&D Manager" />
              </div>

              {kyc.user_context === "organisation" && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="field-label">Organisation name *</label>
                    <input className="input" value={kyc.org_name ?? ""} onChange={(e) => setKyc({ ...kyc, org_name: e.target.value })} />
                  </div>
                  <div>
                    <label className="field-label">Department / function</label>
                    <select className="select" value={kyc.department ?? ""} onChange={(e) => setKyc({ ...kyc, department: e.target.value })}>
                      <option value="">Select…</option>
                      {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {(route === "organisation" || (route === "client" && subRoute === "organisation")) && (
                <div>
                  <label className="field-label">Organisation size</label>
                  <select className="select" value={kyc.org_size ?? ""} onChange={(e) => setKyc({ ...kyc, org_size: e.target.value })}>
                    <option value="">Select…</option>
                    {ORG_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}

              {route === "client" && (
                <div>
                  <label className="field-label">Client organisation details</label>
                  <input className="input" value={kyc.client_details ?? ""} onChange={(e) => setKyc({ ...kyc, client_details: e.target.value })} placeholder="Client name / sector (kept separate from your own data)" />
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Who is the training for? *</label>
                  <select className="select" value={kyc.training_intent ?? ""} onChange={(e) => setKyc({ ...kyc, training_intent: e.target.value })}>
                    <option value="">Select…</option>
                    <option value="myself">Myself</option>
                    <option value="team">My team or department</option>
                    <option value="organisation">My organisation</option>
                    <option value="client">My client</option>
                    <option value="assessing">I&apos;m only assessing for now</option>
                    <option value="unsure">I&apos;m not sure yet</option>
                  </select>
                </div>
                <div>
                  <label className="field-label">Your decision authority *</label>
                  <select className="select" value={kyc.decision_authority ?? ""} onChange={(e) => setKyc({ ...kyc, decision_authority: e.target.value })}>
                    <option value="">Select…</option>
                    <option value="final">I&apos;m the final decision-maker</option>
                    <option value="influence">I influence / recommend the decision</option>
                    <option value="researching">I&apos;m researching for the decision-maker</option>
                    <option value="own">This is for my own development</option>
                    <option value="unsure">I&apos;m not sure</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="field-label">When would you ideally want to start?</label>
                <select className="select" value={kyc.timing ?? ""} onChange={(e) => setKyc({ ...kyc, timing: e.target.value })}>
                  <option value="">Select…</option>
                  <option value="immediate">Immediately / within 30 days</option>
                  <option value="1-3m">Within 1–3 months</option>
                  <option value="3-6m">Within 3–6 months</option>
                  <option value="6m+">More than 6 months</option>
                  <option value="exploring">Exploring only / no timeline yet</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button className="btn btn-ghost" onClick={() => setPhase("questions")} disabled={busy}>Back</button>
              <button className="btn btn-gold flex-1" disabled={busy} onClick={submitKyc}>
                {busy ? "Generating your report…" : "Unlock My FREE Results →"}
              </button>
            </div>
            <p className="text-xs mt-4" style={{ color: "var(--muted-2)" }}>
              Your data is kept private and used only to generate your report and, if you ask, to follow up. No payment. No obligation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
