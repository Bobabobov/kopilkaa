"use client";

import UniversalBackground from "@/components/ui/UniversalBackground";
import NotFoundDecorations from "./components/NotFoundDecorations";
import NotFoundHero from "./components/NotFoundHero";
import NotFoundContent from "./components/NotFoundContent";
import NotFoundActions from "./components/NotFoundActions";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <UniversalBackground />
      <NotFoundDecorations />

      <div className="relative z-10 w-full">
        {/* Герой секция с изображением */}
        <div className="w-full pt-16 sm:pt-20 md:pt-24 lg:pt-32 pb-8 sm:pb-12 md:pb-16">
          <NotFoundHero />
        </div>

        {/* Контент с текстом */}
        <div className="w-full pb-8 sm:pb-12 md:pb-16">
          <NotFoundContent />
        </div>

        {/* Кнопки и ссылки */}
        <div className="w-full pb-16 sm:pb-20 md:pb-24 lg:pb-32">
          <NotFoundActions />
        </div>
      </div>
    </div>
  );
}


