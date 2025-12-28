// app/admin/page.tsx
import { redirect } from "next/navigation";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  // серверная проверка доступа — у нас один админ (ты)
  const admin = await getAllowedAdminUser();
  if (!admin) {
    redirect("/"); // моментально уводим не-админа
  }
  return <AdminClient />;
}
