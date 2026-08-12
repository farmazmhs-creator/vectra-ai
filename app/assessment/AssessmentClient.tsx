"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Brand } from "@/app/components/Chrome";
import { LangToggle } from "@/app/components/LangToggle";
import { visibleQuestions, ROUTE_LABELS } from "@/lib/assessment/questions";
import type { Question } from "@/lib/assessment/questions";
import { qPrompt, qHelp, qSection, optLabelI18n, ROUTE_LABELS_BM } from "@/lib/assessment/questions-bm";
import { t, LANG_COOKIE, type Lang } from "@/lib/i18n";
import type { Answers, KycProfile, Route, SubRoute } from "@/lib/assessment/types";
import { startAssessment, completeAssessment } from "@/lib/assessment/actions";

type Phase = "route" | "entry" | "questions" | "kyc";

const ROUTE_CHOICES: { route: Route; en: string; bm: string; enD: string; bmD: string }[] = [
  { route: "individual", en: "Myself", bm: "Diri saya", enD: "Individual AI Capability Profile", bmD: "Profil Keupayaan AI Individu" },
  { route: "team", en: "My team or department", bm: "Pasukan atau jabatan saya", enD: "Team AI Capability Assessment", bmD: "Penilaian Keupayaan AI Pasukan" },
  { route: "organisation", en: "My organisation", bm: "Organisasi saya", enD: "Organisation AI Readiness Snapshot", bmD: "Gambaran Kesediaan AI Organisasi" },
  { route: "client", en: "My client", bm: "Klien saya", enD: "Consultant / training-provider route", bmD: "Laluan perunding / penyedia latihan" },
];
const SUBROUTE_CHOICES: { sub: SubRoute; en: string; bm: string }[] = [
  { sub: "individual", en: "An individual client", bm: "Klien individu" },
  { sub: "team", en: "A client's team or department", bm: "Pasukan atau jabatan klien" },
  { sub: "organisation", en: "A client's organisation", bm: "Organisasi klien" },
];

const INDUSTRIES = ["Financial Services", "Manufacturing", "Technology / Software", "Professional Services", "Healthcare", "Education", "Government / Public Sector", "Retail / E-commerce", "Oil & Gas / Energy", "Telecommunications", "Logistics / Supply Chain", "Non-profit", "Other"];
const COUNTRIES = ["Malaysia", "Singapore", "Indonesia", "Thailand", "Philippines", "Vietnam", "Brunei", "United Arab Emirates", "United Kingdom", "Australia", "Other"];
const DEPARTMENTS = ["Organisation-wide / multiple departments", "Finance and Accounting", "Human Resources / People & Culture", "Learning and Development (L&D)", "Talent Development / Talent Management", "Shared Services or Operations", "Sales and Business Development", "Marketing and Communications", "Customer Service", "Information Technology", "Procurement and Supply Chain", "Project Management", "Leadership or Management", "Other"];
const ORG_SIZES = ["1–10 employees", "11–50", "51–200", "201–500", "501–1,000", "1,001–5,000", "More than 5,000", "Not sure"];

export default function AssessmentClient({ lang: initialLang }: { lang: Lang }) {
  const router = useRouter();
  const [lang, setLangState] = useState<Lang>(initialLang);
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

  const tr = (k: Parameters<typeof t>[1]) => t(lang, k);
  const routeLabel = (r: Route) => (lang === "bm" ? ROUTE_LABELS_BM[r] : ROUTE_LABELS[r]);

  function setLang(l: Lang) {
    document.cookie = `${LANG_COOKIE}=${l}; path=/; max-age=${60 * 60 * 24 * 365}`;
    setLangState(l);
  }

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
      else { if (maxSelect && existing.length >= maxSelect) existing.shift(); existing.push(opt); }
      return { ...prev, [code]: existing };
    });
  }

  async function beginAssessment() {
    setError(null);
    if (!fullName.trim() || !phone.trim()) return setError(lang === "bm" ? "Sila masukkan nama dan nombor telefon anda." : "Please enter your name and contact number.");
    if (!consent) return setError(lang === "bm" ? "Sila sahkan persetujuan untuk meneruskan." : "Please confirm consent to continue.");
    setBusy(true);
    try {
      const res = await startAssessment({
        full_name: fullName, phone, consent, route,
        client_subroute: route === "client" ? subRoute : undefined,
        language: lang, source_page: "assessment",
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
    return true;
  }
  function nextQuestion() {
    setError(null);
    if (current && current.type === "single" && !answered(current)) return setError(tr("choose_to_continue"));
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
    const bm = lang === "bm";
    const isOrg = kyc.user_context === "organisation";
    if (!kyc.user_context) return setError(bm ? "Sila beritahu konteks anda." : "Please tell us your context.");
    if (!kyc.email?.trim()) return setError(bm ? "Alamat e-mel diperlukan untuk membuka keputusan anda." : "Email address is required to unlock your results.");
    if (!/^\S+@\S+\.\S+$/.test(kyc.email)) return setError(bm ? "Sila masukkan alamat e-mel yang sah." : "Please enter a valid email address.");
    if (!kyc.industry) return setError(bm ? "Sila pilih industri anda." : "Please select your industry.");
    if (!kyc.country) return setError(bm ? "Sila pilih negara / rantau anda." : "Please select your country / region.");
    if (!kyc.position?.trim()) return setError(bm ? "Sila masukkan jawatan anda." : "Please enter your position or job title.");
    if (!kyc.training_intent) return setError(bm ? "Sila pilih niat latihan anda." : "Please select your training intent.");
    if (!kyc.decision_authority) return setError(bm ? "Sila pilih kuasa keputusan anda." : "Please select your decision authority.");
    if (isOrg && !kyc.org_name?.trim()) return setError(bm ? "Sila masukkan nama organisasi anda." : "Please enter your organisation name.");
    if (!ids) return setError(bm ? "Sesi tamat. Sila mulakan semula penilaian." : "Session expired. Please restart the assessment.");

    setBusy(true);
    try {
      const { resultId } = await completeAssessment({
        leadId: ids.leadId, assessmentId: ids.assessmentId, route,
        client_subroute: route === "client" ? subRoute : undefined,
        answers, kyc, lang,
      });
      router.push(`/result/${resultId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not generate your result. Please try again.");
      setBusy(false);
    }
  }

  const totalSteps = questions.length;
  const progress = phase === "questions" ? Math.round(((qIndex + 1) / (totalSteps + 1)) * 100) : phase === "kyc" ? 96 : 0;

  return (
    <div className="min-h-screen gradient-hero">
      <div className="container-x py-6 flex items-center justify-between">
        <Brand />
        <div className="flex items-center gap-3">
          <LangToggle lang={lang} />
          <span className="badge badge-free">{tr("free_badge")}</span>
        </div>
      </div>

      <div className="container-x pb-20" style={{ maxWidth: 760 }}>
        {(phase === "questions" || phase === "kyc") && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2 text-sm" style={{ color: "var(--muted)" }}>
              <span>{phase === "kyc" ? tr("unlock_title") : current ? qSection(lang, current) : ""}</span>
              <span>{phase === "kyc" ? tr("final_step") : `${tr("q_of")} ${qIndex + 1} ${tr("q_of_mid")} ${totalSteps}`}</span>
            </div>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
          </div>
        )}

        {error && (
          <div className="panel-2 mb-4" style={{ borderColor: "rgba(255,107,125,0.5)", padding: "0.75rem 1rem", color: "var(--red)" }}>{error}</div>
        )}

        {phase === "route" && (
          <div className="panel p-6 sm:p-8">
            <p className="kicker mb-2">{tr("a_kicker")}</p>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{tr("a_who")}</h1>
            <p style={{ color: "var(--muted)" }} className="mb-6">{tr("a_who_sub")}</p>
            <div className="grid gap-3">
              {ROUTE_CHOICES.map((c) => (
                <button key={c.route} className={`opt ${route === c.route ? "selected" : ""}`} onClick={() => { setRoute(c.route); if (c.route !== "client") setSubRoute(undefined); }}>
                  <span className="dot" />
                  <span>
                    <span className="block font-semibold">{lang === "bm" ? c.bm : c.en}</span>
                    <span className="block text-sm" style={{ color: "var(--muted)" }}>{lang === "bm" ? c.bmD : c.enD}</span>
                  </span>
                </button>
              ))}
            </div>
            {route === "client" && (
              <div className="mt-5">
                <p className="field-label">{tr("who_for")}</p>
                <div className="grid gap-3">
                  {SUBROUTE_CHOICES.map((s) => (
                    <button key={s.sub} className={`opt ${subRoute === s.sub ? "selected" : ""}`} onClick={() => setSubRoute(s.sub)}>
                      <span className="dot" /><span className="font-medium">{lang === "bm" ? s.bm : s.en}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button className="btn btn-primary w-full mt-6" disabled={route === "client" && !subRoute} onClick={() => setPhase("entry")}>{tr("a_continue")}</button>
          </div>
        )}

        {phase === "entry" && (
          <div className="panel p-6 sm:p-8">
            <p className="kicker mb-2">{routeLabel(route)}</p>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{tr("a_start_title")}</h1>
            <p style={{ color: "var(--muted)" }} className="mb-6">{tr("a_start_sub")}</p>
            <div className="grid gap-4">
              <div><label className="field-label">{tr("f_fullname")}</label><input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Aisyah Rahman" /></div>
              <div><label className="field-label">{tr("f_phone")}</label><input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. +60 12-345 6789" /></div>
              <label className="flex items-start gap-3 text-sm" style={{ color: "var(--muted)" }}>
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ marginTop: 3 }} />
                <span>{tr("f_consent")}</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="btn btn-ghost" onClick={() => setPhase("route")}>{tr("a_back")}</button>
              <button className="btn btn-primary flex-1" disabled={busy} onClick={beginAssessment}>{busy ? "…" : tr("a_start_title")}</button>
            </div>
          </div>
        )}

        {phase === "questions" && current && (
          <div className="panel p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-1">{qPrompt(lang, current)}</h2>
            {qHelp(lang, current) ? <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>{qHelp(lang, current)}</p> : <div className="mb-5" />}

            {current.type === "single" && (
              <div className="grid gap-3">
                {current.options!.map((o) => {
                  const selected = Number(answers[current.code]) === o.value;
                  return (
                    <button key={o.code} className={`opt ${selected ? "selected" : ""}`} onClick={() => setAnswer(current.code, o.value!)}>
                      <span className="dot" /><span>{optLabelI18n(lang, current.code, o.code)}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {current.type === "multi" && (
              <div className="grid gap-3">
                {current.options!.map((o) => {
                  const a = Array.isArray(answers[current.code]) ? (answers[current.code] as string[]) : [];
                  const selected = a.includes(o.code);
                  return (
                    <button key={o.code} className={`opt multi ${selected ? "selected" : ""}`} onClick={() => toggleMulti(current.code, o.code, current.maxSelect)}>
                      <span className="dot" /><span>{optLabelI18n(lang, current.code, o.code)}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {current.type === "text" && (
              <textarea className="textarea" rows={3} maxLength={current.maxLen ?? 250} value={(answers[current.code] as string) ?? ""} onChange={(e) => setAnswer(current.code, e.target.value)} placeholder={tr("type_short")} />
            )}

            <div className="flex gap-3 mt-6">
              <button className="btn btn-ghost" onClick={prevQuestion}>{tr("a_back")}</button>
              <button className="btn btn-primary flex-1" onClick={nextQuestion}>{qIndex < questions.length - 1 ? tr("a_next") : tr("a_continue_unlock")}</button>
            </div>
          </div>
        )}

        {phase === "kyc" && (
          <div className="panel p-6 sm:p-8">
            <p className="kicker mb-2">{tr("unlock_kicker")}</p>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{tr("unlock_title")}</h1>
            <p style={{ color: "var(--muted)" }} className="mb-6">{tr("unlock_sub")}</p>

            <div className="grid gap-4">
              <div>
                <label className="field-label">{lang === "bm" ? "Saya melengkapkan ini sebagai *" : "I am completing this as *"}</label>
                <select className="select" value={kyc.user_context ?? ""} onChange={(e) => setKyc({ ...kyc, user_context: e.target.value })}>
                  <option value="">{tr("select")}</option>
                  <option value="individual">{lang === "bm" ? "Individu / untuk pembangunan diri saya" : "An individual / for my own development"}</option>
                  <option value="organisation">{lang === "bm" ? "Mewakili syarikat atau organisasi" : "Representing a company or organisation"}</option>
                </select>
              </div>
              <div><label className="field-label">{lang === "bm" ? "Alamat e-mel *" : "Email address *"}</label><input className="input" value={kyc.email ?? ""} onChange={(e) => setKyc({ ...kyc, email: e.target.value })} placeholder="you@company.com" /></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="field-label">{lang === "bm" ? "Industri *" : "Industry *"}</label>
                  <select className="select" value={kyc.industry ?? ""} onChange={(e) => setKyc({ ...kyc, industry: e.target.value })}>
                    <option value="">{tr("select")}</option>
                    {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">{lang === "bm" ? "Negara / rantau *" : "Country / region *"}</label>
                  <select className="select" value={kyc.country ?? ""} onChange={(e) => setKyc({ ...kyc, country: e.target.value })}>
                    <option value="">{tr("select")}</option>
                    {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="field-label">{lang === "bm" ? "Jawatan *" : "Position / job title *"}</label><input className="input" value={kyc.position ?? ""} onChange={(e) => setKyc({ ...kyc, position: e.target.value })} placeholder="e.g. L&D Manager" /></div>

              {kyc.user_context === "organisation" && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="field-label">{lang === "bm" ? "Nama organisasi *" : "Organisation name *"}</label><input className="input" value={kyc.org_name ?? ""} onChange={(e) => setKyc({ ...kyc, org_name: e.target.value })} /></div>
                  <div>
                    <label className="field-label">{lang === "bm" ? "Jabatan / fungsi" : "Department / function"}</label>
                    <select className="select" value={kyc.department ?? ""} onChange={(e) => setKyc({ ...kyc, department: e.target.value })}>
                      <option value="">{tr("select")}</option>
                      {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {(route === "organisation" || (route === "client" && subRoute === "organisation")) && (
                <div>
                  <label className="field-label">{lang === "bm" ? "Saiz organisasi" : "Organisation size"}</label>
                  <select className="select" value={kyc.org_size ?? ""} onChange={(e) => setKyc({ ...kyc, org_size: e.target.value })}>
                    <option value="">{tr("select")}</option>
                    {ORG_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}

              {route === "client" && (
                <div><label className="field-label">{lang === "bm" ? "Butiran organisasi klien" : "Client organisation details"}</label><input className="input" value={kyc.client_details ?? ""} onChange={(e) => setKyc({ ...kyc, client_details: e.target.value })} /></div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="field-label">{lang === "bm" ? "Latihan untuk siapa? *" : "Who is the training for? *"}</label>
                  <select className="select" value={kyc.training_intent ?? ""} onChange={(e) => setKyc({ ...kyc, training_intent: e.target.value })}>
                    <option value="">{tr("select")}</option>
                    <option value="myself">{lang === "bm" ? "Diri saya" : "Myself"}</option>
                    <option value="team">{lang === "bm" ? "Pasukan / jabatan saya" : "My team or department"}</option>
                    <option value="organisation">{lang === "bm" ? "Organisasi saya" : "My organisation"}</option>
                    <option value="client">{lang === "bm" ? "Klien saya" : "My client"}</option>
                    <option value="assessing">{lang === "bm" ? "Saya hanya menilai buat masa ini" : "I'm only assessing for now"}</option>
                    <option value="unsure">{lang === "bm" ? "Saya belum pasti" : "I'm not sure yet"}</option>
                  </select>
                </div>
                <div>
                  <label className="field-label">{lang === "bm" ? "Kuasa keputusan anda *" : "Your decision authority *"}</label>
                  <select className="select" value={kyc.decision_authority ?? ""} onChange={(e) => setKyc({ ...kyc, decision_authority: e.target.value })}>
                    <option value="">{tr("select")}</option>
                    <option value="final">{lang === "bm" ? "Saya pembuat keputusan akhir" : "I'm the final decision-maker"}</option>
                    <option value="influence">{lang === "bm" ? "Saya mempengaruhi / mencadangkan keputusan" : "I influence / recommend the decision"}</option>
                    <option value="researching">{lang === "bm" ? "Saya membuat kajian untuk pembuat keputusan" : "I'm researching for the decision-maker"}</option>
                    <option value="own">{lang === "bm" ? "Ini untuk pembangunan diri saya" : "This is for my own development"}</option>
                    <option value="unsure">{lang === "bm" ? "Saya tidak pasti" : "I'm not sure"}</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="field-label">{lang === "bm" ? "Bila anda mahu bermula?" : "When would you ideally want to start?"}</label>
                <select className="select" value={kyc.timing ?? ""} onChange={(e) => setKyc({ ...kyc, timing: e.target.value })}>
                  <option value="">{tr("select")}</option>
                  <option value="immediate">{lang === "bm" ? "Segera / dalam 30 hari" : "Immediately / within 30 days"}</option>
                  <option value="1-3m">{lang === "bm" ? "Dalam 1–3 bulan" : "Within 1–3 months"}</option>
                  <option value="3-6m">{lang === "bm" ? "Dalam 3–6 bulan" : "Within 3–6 months"}</option>
                  <option value="6m+">{lang === "bm" ? "Lebih 6 bulan" : "More than 6 months"}</option>
                  <option value="exploring">{lang === "bm" ? "Meneroka sahaja / belum ada garis masa" : "Exploring only / no timeline yet"}</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button className="btn btn-ghost" onClick={() => setPhase("questions")} disabled={busy}>{tr("a_back")}</button>
              <button className="btn btn-gold flex-1" disabled={busy} onClick={submitKyc}>{busy ? tr("unlock_generating") : tr("unlock_cta")}</button>
            </div>
            <p className="text-xs mt-4" style={{ color: "var(--muted-2)" }}>{tr("unlock_privacy")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
