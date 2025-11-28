"use client";

import { usePathname } from "next/navigation";
import AdSection from "@/components/home/AdSection";

export default function SideBanners() {
  const pathname = usePathname();

  // Не показываем боковые блоки в админке и в профиле
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/profile")) {
    return null;
  }

  return (
    <>
      {/* Правая компактная колонка для очень больших экранов:
          только реклама, без топ‑донатеров */}
      <div
        className="fixed right-6 z-30 hidden 2xl:block"
        // смещаем ниже, чтобы не залезать под верхний рекламный баннер и шапку
        style={{ top: "360px", maxWidth: 340 }}
      >
        <AdSection variant="sidebar" />
      </div>
    </>
  );
}



