// app/admin/achievements/page.tsx
import { redirect } from "next/navigation";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import AdminAchievementsClient from "./AdminAchievementsClient";

export const dynamic = "force-dynamic";

export default async function AdminAchievementsPage() {
  // Серверная проверка доступа
  const admin = await getAllowedAdminUser();
  if (!admin) {
    redirect("/"); // Моментально уводим не-админа
  }
  
  return <AdminAchievementsClient />;
}
