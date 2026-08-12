import { cookies } from "next/headers";
import { LANG_COOKIE, type Lang } from "./index";

export async function getLang(): Promise<Lang> {
  const store = await cookies();
  return store.get(LANG_COOKIE)?.value === "bm" ? "bm" : "en";
}
