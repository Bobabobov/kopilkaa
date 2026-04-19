"use client";

import type { ApplicationCategoryConfig } from "@/lib/applications/categories";
import { REPORT_PHOTOS_MIN } from "@/lib/applications/categories";
import { Badge } from "@/components/ui/badge";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { cn } from "@/lib/utils";

/** Вводный блок всего шага «Фото» */
export function ApplicationPhotoStepIntro({
  config,
}: {
  config: ApplicationCategoryConfig | null;
}) {
  return (
    <div className="rounded-2xl border border-[#abd1c6]/20 bg-[#004643]/35 px-4 py-4 sm:px-5 sm:py-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f9bc60]/18 text-[#f9bc60] ring-1 ring-[#f9bc60]/35">
          <LucideIcons.Camera size="md" className="shrink-0" />
        </div>
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold tracking-tight text-[#fffffe] sm:text-xl">
              Фото для проверки заявки
            </h2>
            {config ? (
              <Badge variant="secondary" className="font-medium">
                {config.title}
              </Badge>
            ) : null}
          </div>
          <p className="text-sm leading-relaxed text-[#abd1c6]/95">
            Загрузите такие снимки или скрины, чтобы по ним было видно:{" "}
            <span className="font-semibold text-[#e8f4f0]">
              запрос правдоподобен и подходит под выбранную категорию
            </span>
            . Ниже перечислено, что именно должно попасть в кадр или на скриншот.
          </p>
          {!config ? (
            <p className="text-sm font-medium text-[#f9bc60]">
              Категория не выбрана — вернитесь на шаг «Категория» и выберите вариант.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** Требования к фото именно к текущей заявке */
export function ApplicationPhotoCurrentRequestHints({
  config,
}: {
  config: ApplicationCategoryConfig | null;
}) {
  if (!config) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#f9bc60]/30 bg-gradient-to-br from-[#f9bc60]/[0.14] via-[#001e1d]/40 to-[#001e1d]/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] bg-black/10 px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default" className="font-semibold">
            К этой заявке
          </Badge>
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#94a1b2]">
            до рассмотрения
          </span>
        </div>
        <span className="text-xs font-medium text-[#abd1c6]">
          Нужно минимум{" "}
          <span className="tabular-nums text-[#fffffe]">1</span> файл · можно
          несколько
        </span>
      </div>
      <div className="space-y-3 px-4 py-4 sm:px-5 sm:py-5">
        <p className="text-sm font-semibold text-[#fffffe]">
          {config.proofBeforeTitle}
        </p>
        <p className="text-xs leading-relaxed text-[#abd1c6]/95">
          На ваших файлах должно быть видно следующее (можно разбить на
          несколько фото):
        </p>
        <ol className="space-y-2.5">
          {config.proofBeforeLines.map((line, i) => (
            <li
              key={line}
              className="flex gap-3 rounded-xl border border-white/[0.07] bg-[#001e1d]/35 px-3 py-2.5 sm:gap-3.5 sm:px-4 sm:py-3"
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold tabular-nums",
                  "bg-[#f9bc60]/20 text-[#f9bc60] ring-1 ring-[#f9bc60]/35",
                )}
                aria-hidden
              >
                {i + 1}
              </span>
              <span className="min-w-0 pt-0.5 text-sm leading-snug text-[#e8f4f0]">
                {line}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/** Пояснение к отчёту по прошлой одобренной заявке */
export function ApplicationPhotoReportHints({
  config,
}: {
  config: ApplicationCategoryConfig | null;
}) {
  if (!config) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#38bdf8]/25 bg-gradient-to-br from-[#38bdf8]/[0.08] via-[#001e1d]/35 to-[#001e1d]/25">
      <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.08] bg-black/10 px-4 py-3 sm:px-5">
        <Badge variant="outline" className="border-[#38bdf8]/45 font-semibold">
          Отчёт по прошлой заявке
        </Badge>
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#94a1b2]">
          отдельно от текущей заявки
        </span>
      </div>
      <div className="space-y-3 px-4 py-4 sm:px-5 sm:py-5">
        <p className="text-sm leading-relaxed text-[#abd1c6]/95">
          Если у вас уже была{" "}
          <span className="font-semibold text-[#e8f4f0]">
            одобренная заявка раньше
          </span>
          , нужно подтвердить, как вы потратили ту помощь. В блоке ниже —
          минимум{" "}
          <span className="font-semibold text-[#38bdf8]">
            {REPORT_PHOTOS_MIN} разных снимка
          </span>
          , по смыслу совпадающих с двумя пунктами:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-white/[0.08] bg-[#001e1d]/45 p-3.5 sm:p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#38bdf8]/20 text-xs font-bold text-[#7dd3fc] ring-1 ring-[#38bdf8]/30">
                1
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-[#94a1b2]">
                Первое фото отчёта
              </span>
            </div>
            <p className="text-sm leading-snug text-[#e8f4f0]">
              {config.reportSlot1}
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-[#001e1d]/45 p-3.5 sm:p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#38bdf8]/20 text-xs font-bold text-[#7dd3fc] ring-1 ring-[#38bdf8]/30">
                2
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-[#94a1b2]">
                Второе фото отчёта
              </span>
            </div>
            <p className="text-sm leading-snug text-[#e8f4f0]">
              {config.reportSlot2}
            </p>
          </div>
        </div>
        <p className="text-xs leading-relaxed text-[#94a1b2]">
          Загрузите файлы в одном поле ниже: главное — чтобы среди них были
          снимки по обоим пунктам. Видит только администратор.
        </p>
      </div>
    </div>
  );
}
