import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdsManagementClient from "./AdsManagementClient";

export default async function Page() {
  // Серверная проверка: доступ только для админа
  const s = await getSession();
  if (!s || s.role !== "ADMIN") {
    redirect("/");
  }

  return <AdsManagementClient />;
}

