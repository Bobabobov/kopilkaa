import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import AdsManagementClient from "./AdsManagementClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  // Серверная проверка: доступ только для админа
  const admin = await getAllowedAdminUser();
  if (!admin) {
    redirect("/");
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center relative">
          <div className="relative z-10">
            <div className="w-16 h-16 border-4 border-[#f9bc60] border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      }
    >
      <AdsManagementClient />
    </Suspense>
  );
}
