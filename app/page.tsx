import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/app/components/Chrome";
import { getProgrammes } from "@/lib/data/programmes";
import { getLang } from "@/lib/i18n/server";
import { t, type Lang } from "@/lib/i18n";

export const dynamic = "force-dynamic";

function CTA({ href, label, sub }: { href: string; label: string; sub?: string }) {
  return (
    <div className="text-center my-10">
      <Link href={href} className="btn btn-gold" style={{ fontSize: 16, padding: "0.95rem 1.75rem" }}>{label}</Link>
      {sub && <div className="text-xs mt-3" style={{ color: "var(--muted-2)" }}>{sub}</div>}
    </div>
  );
}

const VALUE_TILES: [string, string, string, string][] = [
  ["Your AI capability score", "A clear 0–100 readiness score with your maturity stage.", "Skor keupayaan AI anda", "Skor kesediaan 0–100 yang jelas dengan peringkat kematangan anda."],
  ["Dimension-by-dimension analysis", "See exactly where you're strong and where the gaps are, across 8 dimensions.", "Analisis dimensi demi dimensi", "Lihat dengan tepat kekuatan dan jurang anda, merentas 8 dimensi."],
  ["Strengths & priority gaps", "Evidence-backed, not guesswork — and what's actually trainable.", "Kekuatan & jurang keutamaan", "Berasaskan bukti, bukan tekaan — dan apa yang boleh dilatih."],
  ["AI investment & utilisation review", "Are your licensed tools underused? Shadow-AI risk? We flag it.", "Semakan pelaburan & penggunaan AI", "Alat berlesen anda kurang digunakan? Risiko AI bayangan? Kami tandakan."],
  ["Instant TNA Snapshot", "An HRD Corp-structured Training Needs Analysis you can act on.", "Gambaran TNA Segera", "Analisis Keperluan Latihan berstruktur HRD Corp yang boleh ditindak."],
  ["Opportunity Horizon", "What stronger capability could unlock — mapped to your outcomes.", "Horizon Peluang", "Apa yang keupayaan lebih kukuh boleh buka — dipetakan kepada hasil anda."],
  ["Training recommendations", "Gap → programme → intended capability. No arbitrary course promotion.", "Cadangan latihan", "Jurang → program → keupayaan disasarkan. Tanpa promosi kursus sewenang-wenangnya."],
  ["A 30–90 day capability path", "A practical roadmap, ready for an internal discussion.", "Laluan keupayaan 30–90 hari", "Peta jalan praktikal, sedia untuk perbincangan dalaman."],
];
const HOW: [string, string, string, string, string][] = [
  ["1", "Answer", "5–7 minutes of structured questions. No essays — mostly tap and select.", "Jawab", "Soalan berstruktur 5–7 minit. Tiada esei — kebanyakannya ketik dan pilih."],
  ["2", "Unlock", "Tell us a little about your context to unlock your personalised results.", "Buka", "Beritahu kami sedikit tentang konteks anda untuk membuka keputusan peribadi anda."],
  ["3", "Get results", "Your instant diagnostic, TNA snapshot and recommendations — on screen, immediately.", "Dapat keputusan", "Diagnostik segera, gambaran TNA dan cadangan anda — di skrin, serta-merta."],
  ["4", "Take action", "Discuss your results or request a tailored proposal. No obligation.", "Ambil tindakan", "Bincang keputusan anda atau minta cadangan tersuai. Tanpa obligasi."],
];
const WHY: [string, string, string, string][] = [
  ["Decision clarity", "Know where you stand before you invest in training.", "Kejelasan keputusan", "Ketahui kedudukan anda sebelum melabur dalam latihan."],
  ["Training-fit confidence", "Recommendations traceable to real, identified needs.", "Keyakinan kesesuaian latihan", "Cadangan boleh dijejaki kepada keperluan sebenar yang dikenal pasti."],
  ["Time & resource efficiency", "A defensible TNA in minutes, not weeks of internal analysis.", "Kecekapan masa & sumber", "TNA yang boleh dipertahankan dalam beberapa minit, bukan berminggu analisis dalaman."],
  ["Next-step planning", "Evidence for internal training discussions and budget decisions.", "Perancangan langkah seterusnya", "Bukti untuk perbincangan latihan dalaman dan keputusan bajet."],
];

export default async function Home() {
  const lang: Lang = await getLang();
  const bm = lang === "bm";
  let programmes: Awaited<ReturnType<typeof getProgrammes>> = [];
  try { programmes = await getProgrammes(true); } catch { programmes = []; }
  const tr = (k: Parameters<typeof t>[1]) => t(lang, k);

  return (
    <div>
      <SiteHeader lang={lang} />

      <section className="gradient-hero">
        <div className="container-x py-16 sm:py-24 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <span className="badge badge-free mb-5">{tr("free_badge_hero")}</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.05] tracking-tight mb-5">
              {tr("hero_title_a")} <span style={{ color: "var(--accent-2)" }}>{tr("hero_title_b")}</span> {tr("hero_title_c")}
            </h1>
            <p className="text-lg mb-8" style={{ color: "var(--muted)", maxWidth: 560 }}>{tr("hero_sub")}</p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/assessment" className="btn btn-primary" style={{ fontSize: 16, padding: "0.95rem 1.75rem" }}>{tr("cta_start_long")}</Link>
              <span className="text-sm" style={{ color: "var(--gold)" }}>↖ {tr("hero_free_note")}</span>
            </div>
          </div>

          <div className="panel p-6" style={{ boxShadow: "0 30px 80px -40px rgba(124,108,255,0.6)" }}>
            <div className="flex items-center justify-between mb-4">
              <span className="kicker">{tr("sample_result")}</span>
              <span className="badge">{tr("instant")}</span>
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-4 items-center mb-4">
              <div className="panel-2 p-4 text-center" style={{ minWidth: 96 }}>
                <div className="text-4xl font-extrabold" style={{ color: "var(--gold)" }}>58</div>
                <div className="text-[11px]" style={{ color: "var(--muted-2)" }}>/ 100</div>
              </div>
              <div>
                <div className="badge mb-2" style={{ color: "var(--gold)", borderColor: "rgba(231,182,75,0.4)" }}>{bm ? "Membangun" : "Developing"}</div>
                <p className="text-sm" style={{ color: "var(--muted)" }}>{bm ? "Penggunaan berguna wujud, tetapi keupayaan berulang dan tadbir urus masih tidak sekata." : "Useful adoption exists, but repeatability and governance remain uneven."}</p>
              </div>
            </div>
            <div className="grid gap-2">
              {[[bm ? "Kompetensi praktikal" : "Practical competency", 68], [bm ? "Penggunaan & pemakaian" : "Adoption & usage", 55], [bm ? "Integrasi aliran kerja" : "Workflow integration", 40], [bm ? "Tadbir urus" : "Governance", 45]].map(([l, v]) => (
                <div key={l as string} className="flex items-center gap-3">
                  <span className="text-xs w-32" style={{ color: "var(--muted-2)" }}>{l}</span>
                  <div className="bar-track flex-1"><div className="bar-fill" style={{ width: `${v}%`, background: (v as number) >= 60 ? "var(--green)" : "var(--gold)" }} /></div>
                </div>
              ))}
            </div>
            <p className="text-[11px] mt-4" style={{ color: "var(--muted-2)" }}>{tr("sample_note")}</p>
          </div>
        </div>
      </section>

      <section id="what-you-get" className="container-x py-16">
        <span className="kicker">{tr("what_kicker")}</span>
        <h2 className="text-3xl font-bold mt-2 mb-8">{tr("what_title")}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VALUE_TILES.map((row) => (
            <div key={row[0]} className="panel p-5">
              <div className="font-semibold mb-1.5">{bm ? row[2] : row[0]}</div>
              <div className="text-sm" style={{ color: "var(--muted)" }}>{bm ? row[3] : row[1]}</div>
            </div>
          ))}
        </div>
        <CTA href="/assessment" label={tr("cta_unlock")} sub={tr("cta_unlock_sub")} />
      </section>

      <section id="how-it-works" className="gradient-hero">
        <div className="container-x py-16">
          <span className="kicker">{tr("how_kicker")}</span>
          <h2 className="text-3xl font-bold mt-2 mb-8">{tr("how_title")}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOW.map((row) => (
              <div key={row[0]} className="panel p-6">
                <div className="grid place-items-center rounded-full mb-3 font-bold" style={{ width: 36, height: 36, background: "var(--panel-2)", border: "1px solid var(--border-2)", color: "var(--accent-2)" }}>{row[0]}</div>
                <div className="font-semibold mb-1">{bm ? row[3] : row[1]}</div>
                <div className="text-sm" style={{ color: "var(--muted)" }}>{bm ? row[4] : row[2]}</div>
              </div>
            ))}
          </div>
          <CTA href="/assessment" label={tr("cta_take")} sub={tr("cta_take_sub")} />
        </div>
      </section>

      <section className="container-x py-16">
        <span className="kicker">{tr("why_kicker")}</span>
        <h2 className="text-3xl font-bold mt-2 mb-8">{tr("why_title")}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {WHY.map((row) => (
            <div key={row[0]} className="panel p-5">
              <div className="font-semibold mb-1.5">{bm ? row[2] : row[0]}</div>
              <div className="text-sm" style={{ color: "var(--muted)" }}>{bm ? row[3] : row[1]}</div>
            </div>
          ))}
        </div>
        <CTA href="/assessment" label={tr("cta_see")} />
      </section>

      <section id="programmes" className="gradient-hero">
        <div className="container-x py-16">
          <span className="kicker">{tr("prog_kicker")}</span>
          <h2 className="text-3xl font-bold mt-2 mb-2">{tr("prog_title")}</h2>
          <p style={{ color: "var(--muted)" }} className="mb-8 max-w-2xl">{tr("prog_sub")}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {programmes.map((p) => (
              <div key={p.id} className="panel p-5">
                <div className="badge mb-2" style={{ color: "var(--accent-2)" }}>{p.code}</div>
                <div className="font-semibold mb-1.5">{p.title}</div>
                <div className="text-sm mb-3" style={{ color: "var(--muted)" }}>{p.summary}</div>
                <ul className="text-xs grid gap-1" style={{ color: "var(--muted-2)" }}>
                  {(p.modules ?? []).slice(0, 4).map((m) => <li key={m}>· {m}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-14">
        <div className="panel p-6 sm:p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">{tr("privacy_title")}</h3>
          <p style={{ color: "var(--muted)" }} className="max-w-2xl mx-auto">{tr("privacy_body")}</p>
        </div>
      </section>

      <section className="container-x pb-4">
        <div className="panel p-8 sm:p-12 text-center" style={{ background: "linear-gradient(180deg, rgba(231,182,75,0.10), var(--panel))" }}>
          <h2 className="text-3xl font-bold mb-3">{tr("final_title")}</h2>
          <p style={{ color: "var(--muted)" }} className="mb-6 max-w-xl mx-auto">{tr("final_sub")}</p>
          <Link href="/assessment" className="btn btn-gold" style={{ fontSize: 16, padding: "0.95rem 1.75rem" }}>{tr("cta_start_long")}</Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
