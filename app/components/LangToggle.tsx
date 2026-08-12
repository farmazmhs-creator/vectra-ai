"use client";

import { useRouter } from "next/navigation";
import { LANG_COOKIE, type Lang } from "@/lib/i18n";

export function LangToggle({ lang }: { lang: Lang }) {
  const router = useRouter();
  function set(l: Lang) {
    document.cookie = `${LANG_COOKIE}=${l}; path=/; max-age=${60 * 60 * 24 * 365}`;
    router.refresh();
  }
  return (
    <div className="flex items-center gap-1 text-xs" style={{ border: "1px solid var(--border-2)", borderRadius: 999, padding: 2 }}>
      {(["en", "bm"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => set(l)}
          style={{
            padding: "0.25rem 0.6rem",
            borderRadius: 999,
            fontWeight: 600,
            cursor: "pointer",
            border: "none",
            background: lang === l ? "var(--accent)" : "transparent",
            color: lang === l ? "#0b0b14" : "var(--muted)",
          }}
        >
          {l === "en" ? "EN" : "BM"}
        </button>
      ))}
    </div>
  );
}
