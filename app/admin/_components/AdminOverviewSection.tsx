import type { ReactNode } from "react";
import type { ApplicationStatus, Stats } from "@/types/admin";
import { LucideIcons } from "@/components/ui/LucideIcons";
import Link from "next/link";

interface AdminOverviewSectionProps {
  stats: Stats | null;
  status: "ALL" | ApplicationStatus;
  shownCount: number;
  newestId: string | null;
  newestTitle: string | null;
  newestAgeHours: number | null;
  onStatusChange: (status: "ALL" | ApplicationStatus) => void;
}

const STATUS_FILTERS: {
  value: "ALL" | ApplicationStatus;
  label: string;
  countKey?: keyof Stats;
}[] = [
  { value: "ALL", label: "Все заявки", countKey: "total" },
  { value: "PENDING", label: "В обработке", countKey: "pending" },
  { value: "APPROVED", label: "Одобрено", countKey: "approved" },
  { value: "REJECTED", label: "Отказано", countKey: "rejected" },
];

function formatAmount(value: number): string {
  return `₽${value.toLocaleString("ru-RU")}`;
}

function formatAge(hours: number | null): string {
  if (hours == null) return "";
  if (hours < 1) return "меньше часа назад";
  if (hours < 24) return `${hours} ч назад`;
  const days = Math.floor(hours / 24);
  return `${days} д назад`;
}

function SectionLabel({
  icon,
  children,
}: {
  icon: keyof typeof LucideIcons;
  children: ReactNode;
}) {
  const Icon = LucideIcons[icon];
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon size="sm" className="text-[#f9bc60]" />
      <h3 className="text-sm font-bold text-[#fffffe]">{children}</h3>
    </div>
  );
}

export function AdminOverviewSection({
  stats,
  status,
  shownCount,
  newestId,
  newestTitle,
  newestAgeHours,
  onStatusChange,
}: AdminOverviewSectionProps) {
  if (!stats) {
    return (
      <div className="flex items-center justify-center gap-2 py-6 text-sm text-[#abd1c6]">
        <LucideIcons.Loader2 size="sm" className="animate-spin" />
        Загрузка статистики…
      </div>
    );
  }

  const activeFilterLabel =
    STATUS_FILTERS.find((f) => f.value === status)?.label ?? "Все заявки";

  return (
    <div className="space-y-5">
      {/* Сводка */}
      <div>
        <SectionLabel icon="BarChart3">Сводка</SectionLabel>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {(
            [
              {
                label: "В обработке",
                value: stats.pending,
                accent: "text-[#f9bc60]",
                border: "border-[#f9bc60]/30",
                bg: "bg-[#f9bc60]/8",
                highlight: stats.pending > 0,
              },
              {
                label: "Одобрено",
                value: stats.approved,
                accent: "text-[#10B981]",
                border: "border-[#10B981]/30",
                bg: "bg-[#10B981]/8",
                highlight: false,
              },
              {
                label: "Отказано",
                value: stats.rejected,
                accent: "text-[#e16162]",
                border: "border-[#e16162]/30",
                bg: "bg-[#e16162]/8",
                highlight: false,
              },
              {
                label: "Всего",
                value: stats.total,
                accent: "text-[#fffffe]",
                border: "border-[#abd1c6]/25",
                bg: "bg-[#abd1c6]/8",
                highlight: false,
              },
            ] as const
          ).map((item) => (
            <div
              key={item.label}
              className={`rounded-xl border p-3 sm:p-4 ${item.border} ${item.bg} ${
                item.highlight ? "ring-1 ring-[#f9bc60]/25" : ""
              }`}
            >
              <div
                className={`text-2xl sm:text-3xl font-black tabular-nums ${item.accent}`}
              >
                {item.value}
              </div>
              <div className="mt-1 text-xs sm:text-sm text-[#abd1c6]">
                {item.label}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs sm:text-sm text-[#abd1c6]/80">
          Сумма запросов:{" "}
          <span className="font-bold text-[#abd1c6]">
            {formatAmount(stats.totalAmount)}
          </span>
        </p>
      </div>

      {/* Фильтр */}
      <div>
        <SectionLabel icon="Filter">Показать в списке</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => {
            const active = status === filter.value;
            const count =
              filter.countKey != null ? stats[filter.countKey] : null;
            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => onStatusChange(filter.value)}
                className={`rounded-xl px-3 py-2 text-sm font-bold transition-all min-h-[40px] ${
                  active
                    ? "bg-[#f9bc60] text-[#001e1d] shadow-md shadow-[#f9bc60]/20"
                    : "border border-[#abd1c6]/25 bg-[#001e1d]/50 text-[#abd1c6] hover:border-[#f9bc60]/40 hover:text-[#fffffe]"
                }`}
              >
                {filter.label}
                {count != null ? (
                  <span
                    className={`ml-1.5 tabular-nums ${active ? "opacity-80" : "opacity-60"}`}
                  >
                    ({count})
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-[#abd1c6]/60">
          Сейчас отображается:{" "}
          <span className="text-[#fffffe] font-semibold">
            {activeFilterLabel}
          </span>
          {" · "}
          <span className="tabular-nums">{shownCount}</span> в списке
        </p>
      </div>

      {/* Следующая заявка */}
      {stats.pending > 0 && newestId ? (
        <Link
          href={`/admin/applications/${newestId}`}
          className="flex items-center gap-3 rounded-xl border border-[#f9bc60]/35 bg-gradient-to-r from-[#f9bc60]/15 to-[#f9bc60]/5 p-3 sm:p-4 transition-all hover:border-[#f9bc60]/55 hover:from-[#f9bc60]/20 group"
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#f9bc60] flex items-center justify-center">
            <LucideIcons.Zap size="sm" className="text-[#001e1d]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold uppercase tracking-wide text-[#f9bc60] mb-0.5">
              Следующая на проверку
            </div>
            <div className="text-sm sm:text-base font-bold text-[#fffffe] truncate group-hover:text-[#f9bc60] transition-colors">
              {newestTitle || "Без названия"}
            </div>
            {newestAgeHours != null ? (
              <div className="text-xs text-[#abd1c6]/80 mt-0.5">
                {formatAge(newestAgeHours)}
              </div>
            ) : null}
          </div>
          <div className="flex-shrink-0 flex items-center gap-1 text-sm font-bold text-[#f9bc60]">
            Открыть
            <LucideIcons.ArrowRight
              size="sm"
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </div>
        </Link>
      ) : stats.pending === 0 ? (
        <div className="flex items-center gap-3 rounded-xl border border-[#10B981]/25 bg-[#10B981]/8 p-3 sm:p-4">
          <LucideIcons.CheckCircle size="sm" className="text-[#10B981] flex-shrink-0" />
          <p className="text-sm text-[#abd1c6]">
            Очередь пуста — новых заявок на проверку нет
          </p>
        </div>
      ) : null}
    </div>
  );
}
