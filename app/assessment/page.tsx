import AssessmentClient from "./AssessmentClient";
import { getLang } from "@/lib/i18n/server";

export const metadata = { title: "Free AI Readiness Assessment — Vectra AI" };
export const dynamic = "force-dynamic";

export default async function AssessmentPage() {
  const lang = await getLang();
  return <AssessmentClient lang={lang} />;
}
