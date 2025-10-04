// app/admin/page.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminClient from "./AdminClient";

export default async function Page() {
  // серверная проверка доступа — у нас один админ (ты)
  const s = await getSession();
  if (!s || s.role !== "ADMIN") {
    redirect("/"); // моментально уводим не-админа
  }
  return <AdminClient />;
}
