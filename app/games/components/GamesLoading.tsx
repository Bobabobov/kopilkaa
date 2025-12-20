"use client";

import UniversalBackground from "@/components/ui/UniversalBackground";

export default function GamesLoading() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      <UniversalBackground />
      <div className="relative z-10 text-center">
        <div className="w-12 h-12 border-2 border-[#f9bc60] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[#abd1c6]">Загрузка...</p>
      </div>
    </div>
  );
}


