import type { Lang } from "@/lib/i18n";
import type { Question } from "./questions";
import { QUESTIONS, optionLabel } from "./questions";
import type { Route } from "./types";

// Bahasa Malaysia translations, keyed by question code and option code.
// Any missing string falls back to the English source.
interface QT {
  prompt: string;
  help?: string;
  options?: Record<string, string>;
}

export const Q_BM: Record<string, QT> = {
  Q1: {
    prompt: "Yang manakah paling menggambarkan alat AI / LLM yang tersedia kepada anda atau orang yang dinilai?",
    options: {
      "0": "Tiada alat AI / LLM yang diluluskan atau disediakan buat masa ini",
      "1": "Orang kebanyakannya menggunakan alat AI awam percuma atau sumber peribadi",
      "2": "Satu atau lebih alat diluluskan, tetapi akses terhad atau tidak konsisten",
      "3": "Alat AI berlesen / perusahaan tersedia kepada pengguna berkaitan",
      "4": "Alat AI perusahaan tersedia meluas dan sengaja diserapkan ke dalam kerja",
    },
  },
  Q1b: {
    prompt: "Alat manakah yang sedang digunakan atau tersedia?",
    help: "Digunakan untuk cadangan khusus alat — tidak diberi markah.",
    options: {
      chatgpt: "ChatGPT", copilot: "Microsoft Copilot", gemini: "Google Gemini", claude: "Claude",
      perplexity: "Perplexity", internal: "LLM / pembantu AI dalaman atau tersuai",
      builtin: "Ciri AI terbina dalam perisian perniagaan", other: "Lain-lain", none: "Tiada",
    },
  },
  Q2: {
    prompt: "Berapa kerap AI digunakan untuk tugas kerja atau pembelajaran yang bermakna?",
    options: { "0": "Tidak pernah", "1": "Jarang / percubaan sahaja", "2": "Beberapa kali sebulan", "3": "Mingguan atau beberapa kali seminggu", "4": "Secara rutin sebagai sebahagian kerja harian / berulang" },
  },
  Q3: {
    prompt: "Sejauh mana luasnya AI digunakan?",
    options: { "0": "Tiada kes penggunaan praktikal", "1": "Kebanyakannya penulisan asas / menulis semula / soalan mudah", "2": "Beberapa tugas produktiviti peribadi", "3": "Pelbagai tugas khusus peranan (analisis, penyelidikan, perancangan, pelaporan, sokongan)", "4": "Pelbagai aliran kerja berulang atau kes penggunaan merentas fungsi" },
  },
  Q4: {
    prompt: "Sejauh mana yakin pengguna memberi AI arahan yang jelas, memperhalus output dan memperoleh hasil yang konsisten?",
    options: { "0": "Tidak tahu menggunakan AI dengan berkesan", "1": "Kebanyakannya cuba jaya", "2": "Boleh menulis gesaan asas tetapi hasil berbeza-beza", "3": "Boleh menyusun, memperhalus dan mengulang gesaan dengan berkesan", "4": "Boleh mencipta kaedah gesaan, templat atau pembantu yang boleh diguna semula" },
  },
  Q5: {
    prompt: "Sejauh mana konsisten output AI diperiksa sebelum dipercayai?",
    options: { "0": "Output mungkin diterima tanpa pemeriksaan", "1": "Pemeriksaan tidak konsisten", "2": "Output penting biasanya disemak", "3": "Pengguna sentiasa mengesahkan fakta, pengiraan, sumber atau andaian", "4": "Pengesahan dibina dalam amalan kerja / kawalan kualiti yang ditakrifkan" },
  },
  Q6: {
    prompt: "Sejauh mana jelas peraturan tentang maklumat yang boleh atau tidak boleh digunakan dengan alat AI?",
    options: { "0": "Tiada kesedaran / tiada panduan", "1": "Orang membuat keputusan secara individu", "2": "Panduan umum wujud tetapi tidak difahami secara konsisten", "3": "Alat yang diluluskan dan jangkaan pengendalian data adalah jelas", "4": "Tadbir urus, kebenaran dan amalan penggunaan selamat diserapkan dan diperkukuh" },
  },
  Q7: {
    prompt: "Sejauh mana AI diserapkan ke dalam proses kerja berulang?",
    options: { "0": "Tidak digunakan dalam aliran kerja", "1": "Penggunaan individu secara ad-hoc sahaja", "2": "Tugas berguna diulang secara manual dengan AI", "3": "Gesaan, templat, ejen atau langkah berbantukan AI yang ditakrifkan digunakan", "4": "Aliran kerja disokong AI diseragamkan, diukur atau disambung merentas langkah" },
  },
  Q8: {
    prompt: "Di mana peluang terbesar untuk penambahbaikan hari ini?",
    help: "Pilih sehingga tiga.",
    options: {
      repetitive: "Kerja manual berulang", drafting: "Terlalu banyak masa menggubal / menulis semula", research: "Penyelidikan dan pengumpulan maklumat", reporting: "Pelaporan dan analisis", data: "Tafsiran data", comms: "Komunikasi pelanggan / pihak berkepentingan", turnaround: "Masa pusingan perlahan / tekanan SLA", quality: "Kualiti tidak konsisten atau kerja semula", prioritisation: "Keutamaan dan pengurusan tugas", knowledge: "Pengetahuan terperangkap dengan segelintir orang", handoffs: "Serahan proses / penyelarasan", confidence: "Kurang keyakinan AI", adoption: "Penggunaan AI yang rendah", governance: "Kurang tadbir urus AI yang jelas", underused: "Lesen / alat AI kurang digunakan", usecases: "Sukar mengenal pasti kes penggunaan praktikal",
    },
  },
  Q9: {
    prompt: "Sejauh mana aktifnya kepimpinan (atau hala tuju/sokongan anda sendiri) membolehkan penggunaan AI praktikal?",
    options: { "0": "AI tidak dibincangkan atau disokong buat masa ini", "1": "Minat wujud tetapi tiada hala tuju yang jelas", "2": "Sedikit galakan / perintis wujud", "3": "Pemimpin aktif menyokong penggunaan AI yang diluluskan dan pembinaan keupayaan", "4": "Penggunaan AI dikaitkan dengan keutamaan, pemilikan dan hasil boleh diukur" },
  },
  Q10: {
    prompt: "Sejauh mana sedia orang berkaitan menggunakan AI dengan berkesan dalam peranan mereka?",
    options: { "0": "Tiada keupayaan berstruktur wujud", "1": "Hanya segelintir pengguna belajar sendiri / juara", "2": "Kesedaran asas wujud tetapi kemahiran praktikal berbeza jauh", "3": "Pengguna berkaitan telah menerima pembangunan praktikal berdasarkan peranan", "4": "Keupayaan sentiasa dibangunkan, dikongsi dan diperkukuh" },
  },
  Q11a: {
    prompt: "Berapa banyak nilai sedang direalisasikan daripada pelaburan alat AI?",
    help: "Dipaparkan apabila alat AI yang diluluskan / berlesen wujud.",
    options: { "0": "Alat tersedia tetapi hampir tidak digunakan", "1": "Sedikit log masuk / percubaan tetapi nilai praktikal yang kecil", "2": "Peningkatan produktiviti individu yang berguna kelihatan", "3": "Pelbagai pasukan / peranan menggunakannya untuk kerja berulang yang bermakna", "4": "Penggunaan dikaitkan dengan aliran kerja standard, pelan keupayaan dan hasil yang diukur" },
  },
  Q11b: {
    prompt: "Apakah yang paling menjelaskan mengapa tiada pelaburan AI / LLM formal dibuat lagi?",
    help: "Diagnostik sahaja — ini tidak mengurangkan skor anda.",
    options: { exploring: "Masih meneroka pilihan", case: "Kes perniagaan tidak jelas", budget: "Kekangan bajet / komersial", security: "Kebimbangan keselamatan / privasi", policy: "Sekatan IT / dasar", capability: "Kekurangan keupayaan dalaman", priority: "Kepimpinan belum mengutamakannya", sufficient: "Alat semasa dianggap mencukupi" },
  },
  Q12: {
    prompt: "Bagaimanakah impak penggunaan AI diukur pada masa ini?",
    options: { "0": "Tidak diukur", "1": "Maklum balas anekdot sahaja", "2": "Contoh individu / masa dijimatkan kadangkala direkod", "3": "Kes penggunaan terpilih mempunyai ukuran kejayaan yang ditakrifkan", "4": "Keupayaan, penggunaan dan hasil operasi disemak secara sistematik" },
  },
  Q13: {
    prompt: "Apakah yang menjadikan latihan AI berbaloi untuk anda?",
    help: "Pilih sehingga tiga.",
    options: {
      ind_prod: "Tingkatkan produktiviti individu", team_prod: "Tingkatkan produktiviti pasukan", reduce_manual: "Kurangkan usaha manual berulang", turnaround: "Tingkatkan prestasi masa pusingan / SLA", quality: "Tingkatkan kualiti / kurangkan kerja semula", reporting: "Tingkatkan pelaporan dan analisis", decisions: "Tingkatkan sokongan keputusan", cx: "Tingkatkan pengalaman pelanggan / pihak berkepentingan", confidence: "Bina keyakinan AI praktikal", adoption: "Tingkatkan penggunaan alat AI sedia ada", value: "Dapatkan lebih nilai daripada platform AI berlesen", responsible: "Tingkatkan penggunaan AI yang bertanggungjawab / selamat", automation: "Kenal pasti peluang automasi aliran kerja", champions: "Bina juara AI dalaman", leaders: "Sediakan pengurus / pemimpin membimbing penggunaan AI", future: "Bangunkan keupayaan tenaga kerja bersedia masa depan",
    },
  },
  FT1: {
    prompt: "Dalam satu ayat, apakah yang menjadikan latihan AI berbaloi untuk anda?",
    help: "Digunakan untuk memperibadikan laporan anda — tidak diberi markah. Maksimum 200 aksara.",
  },
  Q14: {
    prompt: "Siapa yang paling memerlukan pembangunan keupayaan dahulu?",
    help: "Pilih semua yang berkaitan.",
    options: {
      myself: "Diri saya", frontline: "Pekerja barisan hadapan / operasi", specialists: "Pakar / penganalisis", teamleads: "Ketua pasukan / penyelia", managers: "Pengurus", leadership: "Pengurusan kanan / kepimpinan", ld: "L&D", talent: "Pembangunan Bakat / Pengurusan Bakat", hr: "HR / Manusia & Budaya", orgwide: "Pelbagai peringkat / seluruh organisasi", notsure: "Belum pasti",
    },
  },
  Q15cap: {
    prompt: "Keupayaan manakah yang perlu ditunjukkan oleh pelajar selepas latihan?",
    help: "Pilih sehingga empat.",
    options: {
      confident_use: "Menggunakan alat AI yang diluluskan dengan yakin untuk kerja berkaitan", instruct: "Memberi AI arahan yang jelas dan berstruktur serta memperhalus output", verify: "Mengesahkan output AI dan menggunakan pertimbangan manusia", safe: "Menggunakan AI dengan selamat dalam keperluan data, privasi dan tadbir urus", role_tasks: "Menggunakan AI untuk tugas berulang khusus peranan", reusable: "Mencipta gesaan, templat atau pembantu yang boleh diguna semula", workflow: "Mengenal pasti peluang aliran kerja berbantukan AI yang sesuai", analysis: "Menambah baik analisis, pelaporan atau sokongan keputusan dengan AI", comms: "Menambah baik komunikasi pelanggan / pihak berkepentingan dengan AI", lead: "Pengurus / pemimpin boleh membimbing penggunaan AI yang bertanggungjawab", consistent: "Pasukan boleh menggunakan AI dengan lebih konsisten", measure: "Mengukur sama ada penggunaan AI menghasilkan hasil yang berguna",
    },
  },
  Q15ev: {
    prompt: "Apakah bukti yang menunjukkan jurang latihan telah berjaya ditutup?",
    help: "Pilih semua yang penting.",
    options: {
      demo: "Peserta menunjukkan kemahiran yang diperlukan semasa latihan", artifact: "Peserta menghasilkan gesaan / templat / pembantu yang disahkan", applied: "Peserta menggunakan pembelajaran di tempat kerja dalam 7–14 hari", manager: "Pengurus / penyelia mengesahkan penerapan di tempat kerja", prepost: "Penilaian keupayaan sebelum-vs-selepas bertambah baik", usage: "Penggunaan AI yang diluluskan meningkat dengan sewajarnya", task: "Tugas berulang dilakukan dengan lebih berkesan menggunakan AI", workflow: "Peluang aliran kerja yang sesuai dikenal pasti dan disahkan", quality: "Kualiti / kerja semula / masa pusingan bertambah baik di mana boleh diukur", usecase: "Kes penggunaan AI khusus peranan dilaksanakan", discovery: "Belum pasti — persetujui ukuran kejayaan semasa penemuan",
    },
  },
};

const SECTION_BM: Record<string, string> = {
  "Access & Investment": "Akses & Pelaburan",
  "Adoption": "Penggunaan",
  "Competency": "Kompetensi",
  "Responsible Use": "Penggunaan Bertanggungjawab",
  "Workflow": "Aliran Kerja",
  "Pain / Opportunity": "Kesakitan / Peluang",
  "Leadership": "Kepimpinan",
  "Capability": "Keupayaan",
  "Investment Value": "Nilai Pelaburan",
  "Measurement": "Pengukuran",
  "Desired Outcomes": "Hasil Diingini",
  "Learner Group": "Kumpulan Pelajar",
  "Future Capability": "Keupayaan Masa Depan",
};

export function qPrompt(lang: Lang, q: Question): string {
  return lang === "bm" ? Q_BM[q.code]?.prompt ?? q.prompt : q.prompt;
}
export function qHelp(lang: Lang, q: Question): string | undefined {
  if (lang === "bm") return Q_BM[q.code]?.help ?? q.help;
  return q.help;
}
export function qSection(lang: Lang, q: Question): string {
  return lang === "bm" ? SECTION_BM[q.section] ?? q.section : q.section;
}
export function optLabelI18n(lang: Lang, qCode: string, optCode: string): string {
  if (lang === "bm") {
    const bm = Q_BM[qCode]?.options?.[optCode];
    if (bm) return bm;
  }
  return optionLabel(qCode, optCode);
}

// route labels in BM
export const ROUTE_LABELS_BM: Record<Route, string> = {
  individual: "Profil Keupayaan AI Individu",
  team: "Penilaian Keupayaan AI Pasukan",
  organisation: "Gambaran Kesediaan AI Organisasi",
  client: "Penilaian Klien",
};
