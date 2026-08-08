import { getProgrammes } from "@/lib/data/programmes";
import { AdminHeader } from "../AdminChrome";
import { ProgrammesManager } from "./ProgrammesManager";

export const dynamic = "force-dynamic";

export default async function ProgrammesAdmin() {
  let programmes: Awaited<ReturnType<typeof getProgrammes>> = [];
  try {
    programmes = await getProgrammes(false);
  } catch {
    programmes = [];
  }
  return (
    <div className="min-h-screen">
      <AdminHeader active="programmes" />
      <div className="container-x py-8">
        <h1 className="text-2xl font-bold mb-1">Training programmes</h1>
        <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>The recommendation engine maps assessment gaps to these. Changes are live immediately.</p>
        <ProgrammesManager programmes={programmes} />
      </div>
    </div>
  );
}
