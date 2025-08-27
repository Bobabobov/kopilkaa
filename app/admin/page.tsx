// app/admin/page.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminClient from "./AdminClient";

export default function Page() {
  // серверная проверка доступа — у нас один админ (ты)
  const s = getSession(); // если у тебя асинхронный getSession, сделай: `export default async function Page() { const s = await getSession(); ... }`
  if (!s || s.role !== "ADMIN") {
    redirect("/"); // моментально уводим не-админа
  }
  return <AdminClient />;
}
