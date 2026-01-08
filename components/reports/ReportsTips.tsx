// Подсказки по написанию баг-репортов
"use client";

import { LucideIcons } from "@/components/ui/LucideIcons";

export default function ReportsTips() {
  return (
    <div className="rounded-2xl border border-[#abd1c6]/30 bg-gradient-to-br from-[#002d2b]/70 to-[#001614]/70 p-5 shadow-lg space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f9bc60] to-[#e16162] flex items-center justify-center shadow-md">
          <LucideIcons.Lightbulb className="text-[#001e1d]" size="sm" />
        </div>
        <div>
          <div className="text-sm font-semibold text-[#f9bc60]">
            Как написать полезный баг-репорт
          </div>
          <div className="text-xs text-[#abd1c6]/80">
            Коротко, по шагам и с фактами — так мы решим быстрее.
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 text-xs text-[#abd1c6]">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-[#f9bc60]">•</span>
            <span><span className="text-[#f9bc60]">Заголовок:</span> что именно не так.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-[#f9bc60]">•</span>
            <span><span className="text-[#f9bc60]">Шаги и ожидание:</span> что сделали, что хотели получить, что получили.</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-[#f9bc60]">•</span>
            <span><span className="text-[#f9bc60]">Доказательства:</span> скриншоты, ссылки, короткое видео.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-[#f9bc60]">•</span>
            <span><span className="text-[#f9bc60]">Безопасность:</span> опишите, как воспроизвести уязвимость (без лишних деталей наружу).</span>
          </div>
        </div>
      </div>
    </div>
  );
}


