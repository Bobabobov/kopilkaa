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
        className="fixed right-4 z-30 hidden 2xl:block"
        // смещаем ниже, чтобы не залезать под верхний рекламный баннер и шапку
        // и уменьшаем ширину, чтобы на экранах вроде MacBook блок не наезжал на текст
        style={{ top: "340px", maxWidth: 280 }}
      >
        <AdSection variant="sidebar" />
      </div>
    </>
  );
}



