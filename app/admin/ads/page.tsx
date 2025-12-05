import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getSession } from "@/lib/auth";
import AdsManagementClient from "./AdsManagementClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  // Серверная проверка: доступ только для админа
  const s = await getSession();
  if (!s || s.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#004643" }}>
        <div className="w-16 h-16 border-4 border-[#f9bc60] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AdsManagementClient />
    </Suspense>
  );
}

