// app/api/auth/logout/route.ts
import { clearSession } from "@/lib/auth";

export async function POST() {
  await clearSession();
  return Response.json({ ok: true });
}
