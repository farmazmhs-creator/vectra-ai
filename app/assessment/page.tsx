import AssessmentClient from "./AssessmentClient";
import { getLang } from "@/lib/i18n/server";

export const metadata = { title: "Free AI Readiness Assessment — Vectra AI" };
export const dynamic = "force-dynamic";

export default async function AssessmentPage() {
  const lang = await getLang();
  // Enforcement flag is server-only; the site key is public. We pass both as props so the
  // client can render the widget when active and show a clear config error (never a silent
  // failed-submission loop) when enforcement is on but the site key is missing.
  const turnstile = {
    enabled: process.env.TURNSTILE_ENABLED === "true",
    siteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? null,
  };
  return <AssessmentClient lang={lang} turnstile={turnstile} />;
}
