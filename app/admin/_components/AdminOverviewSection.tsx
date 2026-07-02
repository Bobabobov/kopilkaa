import type { ReactNode } from "react";
import type { ApplicationStatus, Stats } from "@/types/admin";
import { LucideIcons } from "@/components/ui/LucideIcons";
import Link from "next/link";
import {
  AdminFilterChips,
  AdminSectionLabel,
  AdminStatGrid,
} from "@/app/admin/_components/admin-ui";

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
    <div className="mb-3 flex items-center gap-2">
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
      <div>
        <SectionLabel icon="BarChart3">Сводка</SectionLabel>
        <AdminStatGrid
          columns={4}
          items={[
            {
              label: "В обработке",
              value: stats.pending,
              tone: "pending",
              highlight: stats.pending > 0,
            },
            {
              label: "Одобрено",
              value: stats.approved,
              tone: "success",
            },
            {
              label: "Отказано",
              value: stats.rejected,
              tone: "danger",
            },
            { label: "Всего", value: stats.total },
          ]}
        />
        <p className="mt-3 text-xs text-[#abd1c6]/80 sm:text-sm">
          Сумма запросов:{" "}
          <span className="font-bold text-[#abd1c6]">
            {formatAmount(stats.totalAmount)}
          </span>
        </p>
      </div>

      <div>
        <AdminSectionLabel accent="gold" className="mb-3">
          Показать в списке
        </AdminSectionLabel>
        <AdminFilterChips
          activeId={status}
          onChange={(id) =>
            onStatusChange(id as "ALL" | ApplicationStatus)
          }
          items={STATUS_FILTERS.map((filter) => ({
            id: filter.value,
            label: filter.label,
            count:
              filter.countKey != null ? stats[filter.countKey] : undefined,
          }))}
        />
        <p className="mt-2 text-xs text-[#abd1c6]/60">
          Сейчас отображается:{" "}
          <span className="font-semibold text-[#fffffe]">
            {activeFilterLabel}
          </span>
          {" · "}
          <span className="tabular-nums">{shownCount}</span> в списке
        </p>
      </div>

      {stats.pending > 0 && newestId ? (
        <Link
          href={`/admin/applications/${newestId}`}
          className="group flex items-center gap-3 rounded-xl border-2 border-[#f9bc60]/35 bg-gradient-to-r from-[#f9bc60]/15 to-[#f9bc60]/5 p-3 transition-all hover:border-[#f9bc60]/55 hover:from-[#f9bc60]/20 sm:p-4"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f9bc60]">
            <LucideIcons.Zap size="sm" className="text-[#001e1d]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 text-xs font-bold uppercase tracking-wide text-[#f9bc60]">
              Следующая на проверку
            </div>
            <div className="truncate text-sm font-bold text-[#fffffe] transition-colors group-hover:text-[#f9bc60] sm:text-base">
              {newestTitle || "Без названия"}
            </div>
            {newestAgeHours != null ? (
              <div className="mt-0.5 text-xs text-[#abd1c6]/80">
                {formatAge(newestAgeHours)}
              </div>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-1 text-sm font-bold text-[#f9bc60]">
            Открыть
            <LucideIcons.ArrowRight
              size="sm"
              className="transition-transform group-hover:translate-x-0.5"
            />
          </div>
        </Link>
      ) : stats.pending === 0 ? (
        <div className="flex items-center gap-3 rounded-xl border-2 border-emerald-400/30 bg-emerald-500/10 p-3 sm:p-4">
          <LucideIcons.CheckCircle
            size="sm"
            className="shrink-0 text-[#10B981]"
          />
          <p className="text-sm text-[#abd1c6]">
            Очередь пуста — новых заявок на проверку нет
          </p>
        </div>
      ) : null}
    </div>
  );
}
