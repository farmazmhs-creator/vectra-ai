import type { Lang } from "@/lib/i18n";
import type { DimensionCode } from "./types";

export const DIMENSION_LABELS_BM: Record<DimensionCode, string> = {
  D1: "Kefahaman & Kompetensi Praktikal AI",
  D2: "Akses & Pelaburan Alat AI / LLM",
  D3: "Penggunaan & Pemakaian Sebenar",
  D4: "Integrasi Aliran Kerja & Proses",
  D5: "Penggunaan Bertanggungjawab, Data & Tadbir Urus",
  D6: "Kepimpinan / Hala Tuju / Pemboleh",
  D7: "Keupayaan Tenaga Kerja & Kesediaan Perubahan",
  D8: "Pengukuran, Nilai & Skala",
};

export function stageForI18n(lang: Lang, score: number): { stage: string; blurb: string } {
  const table: { max: number; en: [string, string]; bm: [string, string] }[] = [
    { max: 25, en: ["Exploratory", "AI capability is limited, informal or not yet enabled."], bm: ["Penerokaan", "Keupayaan AI terhad, tidak formal atau belum didayakan."] },
    { max: 45, en: ["Emerging", "Early usage exists but capability, access or direction is inconsistent."], bm: ["Baru Muncul", "Penggunaan awal wujud tetapi keupayaan, akses atau hala tuju tidak konsisten."] },
    { max: 65, en: ["Developing", "Useful adoption exists, but repeatability, governance or role-specific capability remains uneven."], bm: ["Membangun", "Penggunaan berguna wujud, tetapi keupayaan berulang, tadbir urus atau khusus peranan masih tidak sekata."] },
    { max: 80, en: ["Operational", "AI is used meaningfully with growing consistency, controls and workflow relevance."], bm: ["Operasi", "AI digunakan secara bermakna dengan konsistensi, kawalan dan kaitan aliran kerja yang semakin meningkat."] },
    { max: 101, en: ["Scaling / Strategic", "AI capability is embedded, measured and positioned for broader scaling and advanced use."], bm: ["Penskalaan / Strategik", "Keupayaan AI diserapkan, diukur dan diposisikan untuk penskalaan lebih luas dan penggunaan lanjutan."] },
  ];
  const row = table.find((r) => score < r.max) ?? table[table.length - 1];
  const pick = lang === "bm" ? row.bm : row.en;
  return { stage: pick[0], blurb: pick[1] };
}

const INTERP_BM: Record<DimensionCode, [string, string, string]> = {
  D1: ["Kompetensi AI praktikal masih terbentuk — gesaan dan pengesahan perlu pembangunan berstruktur.", "Tahap kompetensi praktikal yang berfungsi wujud dan boleh ditajamkan kepada penggunaan yang boleh dipercayai.", "Kompetensi praktikal yang kukuh: pengguna menggesa, memperhalus dan mengesahkan dengan yakin."],
  D2: ["Akses / pelaburan alat terhad atau tidak jelas, mengekang keupayaan yang boleh digunakan.", "Sedikit akses alat yang diluluskan wujud tetapi belum digunakan sepenuhnya.", "Alat yang sesuai tersedia dan sengaja diserapkan ke dalam kerja."],
  D3: ["Penggunaan sebenar rendah atau percubaan — pemakaian belum menjadi kebiasaan.", "Penggunaan sedang muncul merentas beberapa tugas tetapi belum konsisten atau luas.", "AI digunakan secara rutin dan meluas merentas kerja bermakna."],
  D4: ["AI belum diserapkan ke dalam aliran kerja berulang — nilai kekal ad-hoc.", "Beberapa langkah berbantukan AI yang boleh diulang wujud tetapi belum diseragamkan.", "AI diserapkan ke dalam aliran kerja yang diseragamkan dan bersambung."],
  D5: ["Amalan pengesahan dan tadbir urus data tidak konsisten, mewujudkan risiko yang boleh dielakkan.", "Pemeriksaan dan panduan yang munasabah wujud tetapi belum diserapkan sepenuhnya.", "Penggunaan bertanggungjawab, pengesahan dan tadbir urus diserapkan dan diperkukuh."],
  D6: ["Hala tuju dan pemboleh untuk penggunaan AI sebahagian besarnya tiada.", "Sedikit galakan dan perintis wujud tetapi hala tuju belum kukuh.", "Kepimpinan aktif membolehkan penggunaan dan mengaitkannya dengan hasil."],
  D7: ["Keupayaan tenaga kerja nipis dan kesediaan perubahan belum diuji.", "Keupayaan asas wujud tetapi tidak sekata merentas orang berkaitan.", "Keupayaan dibangunkan, dikongsi dan diperkukuh merentas kumpulan."],
  D8: ["Impak penggunaan AI tidak diukur, jadi nilai tidak dapat dibuktikan atau diskalakan.", "Sedikit nilai direkod tetapi pengukuran belum sistematik.", "Penggunaan dan hasil diukur dan bersedia untuk diskalakan."],
};

export function interpI18n(lang: Lang, code: DimensionCode, score: number): string {
  const idx = score >= 65 ? 2 : score >= 45 ? 1 : 0;
  if (lang === "bm") return INTERP_BM[code][idx];
  // EN handled by scoring's own function; this is a BM-only helper fallback
  return INTERP_BM[code][idx];
}

export const NEEDS_BM: Record<string, string> = {
  "Training / capability need": "Keperluan latihan / keupayaan",
  "Tool / access need": "Keperluan alat / akses",
  "Policy / governance need": "Keperluan dasar / tadbir urus",
  "Process redesign need": "Keperluan reka bentuk semula proses",
  "Leadership decision need": "Keperluan keputusan kepimpinan",
};

export const INVESTMENT_BM: Record<string, { state: string; note: string }> = {
  "Not Yet Enabled": { state: "Belum Didayakan", note: "Tiada alat AI yang diluluskan dan penggunaan yang sedikit — pembinaan keupayaan dan kejelasan pemilihan alat mungkin diperlukan sebelum penskalaan." },
  "Unmanaged Adoption / Shadow-AI Exposure": { state: "Penggunaan Tidak Terurus / Pendedahan AI Bayangan", note: "Penggunaan bermakna berlaku pada alat peribadi / awam manakala akses yang diluluskan dan tadbir urus ketinggalan di belakang tingkah laku." },
  "Underutilised AI Investment": { state: "Pelaburan AI Kurang Digunakan", note: "Pelaburan komersial wujud tetapi penggunaan, kemahiran atau pengaktifan kes penggunaan lemah — lesen belum memberi pulangan." },
  "Value with Control Risk": { state: "Nilai dengan Risiko Kawalan", note: "Keupayaan berkembang lebih pantas daripada tadbir urus — amalan penggunaan selamat perlu mengejar." },
  "Tool Fragmentation": { state: "Fragmentasi Alat", note: "Pelbagai alat digunakan secara berpecah — keupayaan bertindih dan standard tidak konsisten mungkin memerlukan rasionalisasi." },
  "Value Realisation / Scale Ready": { state: "Realisasi Nilai / Sedia Skala", note: "Keupayaan, penggunaan aliran kerja dan tadbir urus yang kukuh — tumpuan boleh beralih kepada aliran kerja lanjutan, pengukuran dan penskalaan." },
  "Adoption Opportunity": { state: "Peluang Penggunaan", note: "Pengguna aktif tetapi nilai masih tertumpu pada produktiviti asas — peluangnya ialah integrasi aliran kerja yang lebih mendalam." },
  "Emerging Adoption": { state: "Penggunaan Baru Muncul", note: "Penggunaan AI awal dan tidak formal — keutamaannya ialah membina keupayaan harian yang boleh dipercayai." },
};

export const DEFAULT_CAPS_BM = ["Menggunakan alat AI yang diluluskan dengan yakin", "Mengesahkan output dan menggunakan pertimbangan", "Menggunakan AI untuk tugas peranan berulang"];
export const DEFAULT_EVIDENCE_BM = ["Penilaian keupayaan sebelum-vs-selepas bertambah baik", "Pembelajaran diterapkan di tempat kerja dalam 7–14 hari"];
export const DEFAULT_LEARNER_BM = ["Diri saya / pengguna berkaitan"];

export function nextPathI18n(lang: Lang, lowestLabel: string): { phase: string; focus: string }[] {
  if (lang === "bm") {
    return [
      { phase: "Hari 0–30 — Asas", focus: `Wujudkan keupayaan harian yang boleh dipercayai dan penggunaan selamat (${lowestLabel}).` },
      { phase: "Hari 30–60 — Amalan gunaan", focus: "Gunakan AI untuk tugas berulang sebenar; bina gesaan / templat yang boleh diguna semula untuk pasukan." },
      { phase: "Hari 60–90 — Pengukuhan & pemindahan", focus: "Seragamkan apa yang berkesan, sahkan penerapan di tempat kerja, dan nilai semula keupayaan." },
    ];
  }
  return [
    { phase: "Days 0–30 — Foundations", focus: `Establish reliable everyday capability and safe use (${lowestLabel}).` },
    { phase: "Days 30–60 — Applied practice", focus: "Apply AI to real recurring tasks; build reusable prompts / templates for the team." },
    { phase: "Days 60–90 — Reinforcement & transfer", focus: "Standardise what works, confirm workplace application, and reassess capability." },
  ];
}

export function tnaLabelI18n(lang: Lang, kind: "individual" | "team" | "organisation"): string {
  const map = {
    individual: { en: "Personal AI Training Needs Analysis", bm: "Analisis Keperluan Latihan AI Peribadi" },
    team: { en: "Team AI Training Needs Analysis", bm: "Analisis Keperluan Latihan AI Pasukan" },
    organisation: { en: "Indicative Organisation AI Training Needs Analysis", bm: "Analisis Keperluan Latihan AI Organisasi (Indikatif)" },
  };
  return lang === "bm" ? map[kind].bm : map[kind].en;
}
