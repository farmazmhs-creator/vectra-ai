// Pure, client-safe i18n strings. Server-only getLang() lives in ./server.
export type Lang = "en" | "bm";
export const LANG_COOKIE = "vectra_lang";

type Dict = Record<string, { en: string; bm: string }>;

// UI strings. bm = Bahasa Malaysia. Falls back to en if a key is missing.
export const STRINGS: Dict = {
  // header / chrome
  nav_what: { en: "What You Get", bm: "Yang Anda Dapat" },
  nav_how: { en: "How It Works", bm: "Cara Ia Berfungsi" },
  nav_programmes: { en: "Programmes", bm: "Program" },
  nav_admin: { en: "Admin", bm: "Admin" },
  cta_start: { en: "Start FREE Assessment", bm: "Mula Penilaian PERCUMA" },
  cta_start_long: { en: "Start My FREE Assessment", bm: "Mulakan Penilaian PERCUMA Saya" },
  free_badge: { en: "100% FREE · No obligation", bm: "100% PERCUMA · Tanpa obligasi" },
  free_badge_hero: { en: "100% FREE · 5–7 minutes · Instant results", bm: "100% PERCUMA · 5–7 minit · Keputusan segera" },

  // hero
  hero_title_a: { en: "Where does your", bm: "Di mana tahap" },
  hero_title_b: { en: "AI capability", bm: "keupayaan AI" },
  hero_title_c: { en: "really stand?", bm: "anda sebenarnya?" },
  hero_sub: {
    en: "Get a credible AI readiness diagnostic for yourself, your team or your organisation — with an instant HRD Corp-structured TNA snapshot and a clear training pathway. Built for L&D, Talent, HR and decision-makers.",
    bm: "Dapatkan diagnostik kesediaan AI yang kredibel untuk diri anda, pasukan atau organisasi anda — dengan gambaran TNA berstruktur HRD Corp segera dan laluan latihan yang jelas. Dibina untuk L&D, Bakat, HR dan pembuat keputusan.",
  },
  hero_free_note: { en: "It's completely FREE — no payment, no obligation.", bm: "Ia PERCUMA sepenuhnya — tanpa bayaran, tanpa obligasi." },
  sample_result: { en: "Sample result", bm: "Contoh keputusan" },
  instant: { en: "Instant", bm: "Segera" },
  sample_note: { en: "Representative layout · not real customer data", bm: "Susun atur contoh · bukan data pelanggan sebenar" },

  // sections
  what_kicker: { en: "Your free gift includes", bm: "Hadiah percuma anda termasuk" },
  what_title: { en: "What you get — free", bm: "Apa yang anda dapat — percuma" },
  cta_unlock: { en: "Unlock My FREE Results", bm: "Buka Keputusan PERCUMA Saya" },
  cta_unlock_sub: { en: "No payment. No obligation. Instant.", bm: "Tanpa bayaran. Tanpa obligasi. Segera." },
  how_kicker: { en: "How it works", bm: "Cara ia berfungsi" },
  how_title: { en: "Answer → Unlock → Get results → Take action", bm: "Jawab → Buka → Dapat keputusan → Ambil tindakan" },
  cta_take: { en: "Take the FREE Assessment Now", bm: "Ambil Penilaian PERCUMA Sekarang" },
  cta_take_sub: { en: "5–7 minutes · your results on screen instantly", bm: "5–7 minit · keputusan anda di skrin serta-merta" },
  why_kicker: { en: "Why take this assessment?", bm: "Mengapa ambil penilaian ini?" },
  why_title: { en: "Make a confident, evidence-based training decision", bm: "Buat keputusan latihan yang yakin dan berasaskan bukti" },
  cta_see: { en: "See My AI Capability for FREE", bm: "Lihat Keupayaan AI Saya PERCUMA" },
  prog_kicker: { en: "Training programmes", bm: "Program latihan" },
  prog_title: { en: "Practical, role-based AI capability programmes", bm: "Program keupayaan AI praktikal mengikut peranan" },
  prog_sub: { en: "Your assessment maps your gaps to the right programme. Here's the current catalog.", bm: "Penilaian anda memetakan jurang anda kepada program yang sesuai. Berikut ialah katalog semasa." },
  privacy_title: { en: "Private and confidential", bm: "Peribadi dan sulit" },
  privacy_body: { en: "Your responses are used to generate your diagnostic and, only if you ask, to follow up. We don't publish pricing or share your data. No accounts, no spam.", bm: "Jawapan anda digunakan untuk menjana diagnostik anda dan, hanya jika anda meminta, untuk susulan. Kami tidak menyiarkan harga atau berkongsi data anda. Tiada akaun, tiada spam." },
  final_title: { en: "Get My FREE AI Diagnostic", bm: "Dapatkan Diagnostik AI PERCUMA Saya" },
  final_sub: { en: "See where you stand, what to fix first, and the training pathway to get there — in the next 7 minutes.", bm: "Lihat kedudukan anda, apa yang perlu dibaiki dahulu, dan laluan latihan untuk sampai ke sana — dalam 7 minit berikutnya." },

  // assessment chrome
  a_kicker: { en: "Free AI Readiness Assessment", bm: "Penilaian Kesediaan AI Percuma" },
  a_who: { en: "Who are you completing this assessment for?", bm: "Untuk siapa anda melengkapkan penilaian ini?" },
  a_who_sub: { en: "This takes 5–7 minutes. No payment required. You'll get your AI capability result, key gaps, an Instant TNA Snapshot and recommended next steps — instantly.", bm: "Ini mengambil masa 5–7 minit. Tiada bayaran diperlukan. Anda akan mendapat keputusan keupayaan AI, jurang utama, Gambaran TNA Segera dan langkah seterusnya yang disyorkan — serta-merta." },
  a_continue: { en: "Continue", bm: "Teruskan" },
  a_back: { en: "Back", bm: "Kembali" },
  a_next: { en: "Next", bm: "Seterusnya" },
  a_continue_unlock: { en: "Continue to unlock", bm: "Teruskan untuk membuka" },
  a_start_title: { en: "Start My Free Assessment", bm: "Mulakan Penilaian Percuma Saya" },
  a_start_sub: { en: "Just two details to begin — no payment, no obligation. You'll answer a few structured questions, then unlock your personalised results.", bm: "Hanya dua butiran untuk bermula — tanpa bayaran, tanpa obligasi. Anda akan menjawab beberapa soalan berstruktur, kemudian membuka keputusan peribadi anda." },
  f_fullname: { en: "Full name", bm: "Nama penuh" },
  f_phone: { en: "Contact number", bm: "Nombor telefon" },
  f_consent: { en: "I consent to continue and to the processing of the data I submit, so my results can be generated and a follow-up made if I request one.", bm: "Saya bersetuju untuk meneruskan dan pemprosesan data yang saya serahkan, supaya keputusan saya boleh dijana dan susulan dibuat jika saya memintanya." },
  who_for: { en: "Who is being assessed?", bm: "Siapa yang dinilai?" },
  q_of: { en: "Question", bm: "Soalan" },
  q_of_mid: { en: "of", bm: "daripada" },
  final_step: { en: "Final step", bm: "Langkah akhir" },
  unlock_kicker: { en: "Your free assessment is complete", bm: "Penilaian percuma anda telah selesai" },
  unlock_title: { en: "Unlock your personalised results", bm: "Buka keputusan peribadi anda" },
  unlock_sub: { en: "Tell us a little more about your context to unlock your free results, Instant TNA Snapshot and training recommendations.", bm: "Beritahu kami sedikit lagi tentang konteks anda untuk membuka keputusan percuma, Gambaran TNA Segera dan cadangan latihan." },
  unlock_cta: { en: "Unlock My FREE Results →", bm: "Buka Keputusan PERCUMA Saya →" },
  unlock_generating: { en: "Generating your report…", bm: "Menjana laporan anda…" },
  unlock_privacy: { en: "Your data is kept private and used only to generate your report and, if you ask, to follow up. No payment. No obligation.", bm: "Data anda dirahsiakan dan digunakan hanya untuk menjana laporan anda dan, jika anda meminta, untuk susulan. Tanpa bayaran. Tanpa obligasi." },
  select: { en: "Select…", bm: "Pilih…" },
  type_short: { en: "Type a short answer…", bm: "Taip jawapan ringkas…" },
  choose_to_continue: { en: "Please choose an option to continue.", bm: "Sila pilih satu pilihan untuk meneruskan." },

  // result
  instant_report: { en: "Instant Diagnostic Report", bm: "Laporan Diagnostik Segera" },
  generated_instantly: { en: "Generated instantly from your responses", bm: "Dijana serta-merta daripada jawapan anda" },
  out_of_100: { en: "out of 100", bm: "daripada 100" },
  download_pdf: { en: "Download PDF", bm: "Muat turun PDF" },
  back_home: { en: "← Back to home", bm: "← Kembali ke laman utama" },
  sec1: { en: "Executive Diagnostic Summary", bm: "Ringkasan Diagnostik Eksekutif" },
  sec2: { en: "Your AI Capability / Readiness Profile", bm: "Profil Keupayaan / Kesediaan AI Anda" },
  sec3: { en: "AI / LLM Investment & Utilisation Review", bm: "Semakan Pelaburan & Penggunaan AI / LLM" },
  sec4: { en: "Key Strengths", bm: "Kekuatan Utama" },
  sec5: { en: "Priority Gaps, Risks & Constraints", bm: "Jurang, Risiko & Kekangan Keutamaan" },
  sec6: { en: "Pain Points & Desired Outcomes", bm: "Titik Kesakitan & Hasil Yang Diingini" },
  sec7: { en: "Opportunity Horizon", bm: "Horizon Peluang" },
  sec8: { en: "Instant Training Needs Analysis Snapshot", bm: "Gambaran Analisis Keperluan Latihan Segera" },
  sec9: { en: "Training Prescription — Gap → Programme → Intended Capability", bm: "Preskripsi Latihan — Jurang → Program → Keupayaan Disasarkan" },
  sec10: { en: "Suggested Next 30–90 Day Capability Path", bm: "Cadangan Laluan Keupayaan 30–90 Hari Seterusnya" },
  r_assessment: { en: "Assessment", bm: "Penilaian" },
  r_overall: { en: "Overall score", bm: "Skor keseluruhan" },
  r_stage: { en: "Stage", bm: "Peringkat" },
  r_biggest: { en: "Biggest opportunities you selected", bm: "Peluang terbesar yang anda pilih" },
  r_outcomes: { en: "Outcomes you want", bm: "Hasil yang anda mahukan" },
  r_trainable: { en: "Training-solvable vs not:", bm: "Boleh diselesaikan melalui latihan atau tidak:" },
  r_identified_gap: { en: "Identified gap", bm: "Jurang dikenal pasti" },
  r_intended_cap: { en: "Intended capability", bm: "Keupayaan disasarkan" },
  next_step_kicker: { en: "Your next step", bm: "Langkah seterusnya anda" },
  next_step_title: { en: "Discuss my results & explore my training recommendation", bm: "Bincang keputusan saya & terokai cadangan latihan saya" },
  next_step_sub: { en: "Turn this diagnostic into a concrete plan. Book a discovery call or request a tailored proposal mapped to your gaps — no obligation.", bm: "Jadikan diagnostik ini pelan konkrit. Tempah panggilan penemuan atau minta cadangan tersuai yang dipetakan kepada jurang anda — tanpa obligasi." },
  cta_book: { en: "Book a Consultation", bm: "Tempah Perundingan" },
  cta_proposal: { en: "Request a Tailored Proposal", bm: "Minta Cadangan Tersuai" },
  tna_objective: { en: "Objective", bm: "Objektif" },
  tna_current: { en: "Current state", bm: "Keadaan semasa" },
  tna_required: { en: "Required future capability", bm: "Keupayaan masa depan diperlukan" },
  tna_root: { en: "Root cause", bm: "Punca utama" },
  tna_class: { en: "Training need classification", bm: "Klasifikasi keperluan latihan" },
  tna_learner: { en: "Priority learner group", bm: "Kumpulan pelajar keutamaan" },
  tna_intervention: { en: "Recommended intervention", bm: "Intervensi disyorkan" },
  tna_evidence: { en: "Success evidence", bm: "Bukti kejayaan" },
};

export function t(lang: Lang, key: keyof typeof STRINGS): string {
  const entry = STRINGS[key as string];
  if (!entry) return key as string;
  return lang === "bm" ? entry.bm || entry.en : entry.en;
}
