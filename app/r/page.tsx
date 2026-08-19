"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Minimal fragment-exchange page. Reads #t=<token> in the browser, immediately clears the
// fragment from history, POSTs it same-origin, then redirects to the clean /result/[id].
// No third-party scripts or assets; the raw token never enters a request path or the server logs.
export default function ResultExchangePage() {
  const router = useRouter();
  const [message, setMessage] = useState("Verifying your secure link…");

  useEffect(() => {
    const m = window.location.hash.match(/[#&]t=([^&]+)/);
    const token = m ? decodeURIComponent(m[1]) : "";
    history.replaceState(null, "", window.location.pathname);
    if (!token) {
      setMessage("This link is invalid or has expired.");
      return;
    }
    (async () => {
      try {
        const res = await fetch("/api/result-exchange", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ t: token }),
        });
        const data = (await res.json().catch(() => ({}))) as { ok?: boolean; id?: string };
        if (data?.ok && data.id) {
          router.replace(`/result/${data.id}`);
        } else {
          setMessage("This link is invalid or has expired. Please request a new one.");
        }
      } catch {
        setMessage("Could not verify the link. Please try again in a moment.");
      }
    })();
  }, [router]);

  return (
    <div className="min-h-screen grid place-items-center p-6" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <p style={{ color: "var(--muted)" }}>{message}</p>
    </div>
  );
}
