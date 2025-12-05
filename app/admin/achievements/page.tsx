// app/admin/achievements/page.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminAchievementsClient from "./AdminAchievementsClient";

export const dynamic = "force-dynamic";

export default async function AdminAchievementsPage() {
  // Серверная проверка доступа
  const s = await getSession();
  if (!s || s.role !== "ADMIN") {
    redirect("/"); // Моментально уводим не-админа
  }
  
  return <AdminAchievementsClient />;
}
