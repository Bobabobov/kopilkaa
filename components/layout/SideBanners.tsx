"use client";

import { usePathname } from "next/navigation";
import AdSection from "@/components/home/AdSection";
import TopDonors from "@/components/home/TopDonors";

export default function SideBanners() {
  const pathname = usePathname();

  // Не показываем боковые блоки в админке и в профиле
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/profile")) {
    return null;
  }

  return (
    <>
      {/* Левый рекламный блок */}
      <div
        className="fixed left-4 z-30 hidden xl:block"
        style={{ top: "360px", maxWidth: 320 }}
      >
        <AdSection />
      </div>

      {/* Правый блок с топ‑донатерами */}
      <div
        className="fixed right-4 z-30 hidden xl:block"
        style={{ top: "360px", maxWidth: 360 }}
      >
        <TopDonors />
      </div>
    </>
  );
}


