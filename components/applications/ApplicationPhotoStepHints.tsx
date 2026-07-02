"use client";

import { LucideIcons } from "@/components/ui/LucideIcons";

/** Вводный блок всего шага «Фото» */
export function ApplicationPhotoStepIntro() {
  return (
    <div className="rounded-2xl border border-[#abd1c6]/20 bg-[#004643]/35 px-4 py-4 sm:px-5 sm:py-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f9bc60]/18 text-[#f9bc60] ring-1 ring-[#f9bc60]/35">
          <LucideIcons.Camera size="md" className="shrink-0" />
        </div>
        <div className="min-w-0 space-y-2">
          <h2 className="text-lg font-bold tracking-tight text-[#fffffe] sm:text-xl">
            Фото для проверки материала
          </h2>
          <p className="text-sm leading-relaxed text-[#abd1c6]/95">
            Загрузите фото того, что вам нужно. Минимум одно, можно несколько.
          </p>
          <p className="text-sm leading-relaxed text-[#94a1b2]">
            Не загружайте контент 18+ и свои личные данные — паспорт, карты,
            полные данные СБП, адрес и другое, что не должно быть публичным.
          </p>
        </div>
      </div>
    </div>
  );
}
