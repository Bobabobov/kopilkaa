"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function AdRequestsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/ads?tab=requests");
  }, [router]);

  return (
    <div
      className="flex items-center justify-center min-h-screen pt-24"
      style={{ backgroundColor: "#004643" }}
    >
      <div className="text-center text-[#abd1c6]">
        <div className="text-xl mb-2">Раздел заявок перенесён</div>
        <p className="mb-2">
          Сейчас все заявки на рекламу находятся в разделе{" "}
          <span className="text-[#f9bc60] font-semibold">«Реклама»</span> в
          админке.
        </p>
        <p>Вы будете автоматически перенаправлены туда.</p>
      </div>
    </div>
  );
}


