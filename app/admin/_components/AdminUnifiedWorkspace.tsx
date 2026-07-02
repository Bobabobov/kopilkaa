"use client";

import { useMemo } from "react";
import type { ApplicationItem, ApplicationStatus, Stats } from "@/types/admin";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { AdminPanel } from "@/app/admin/_components/admin-ui";
import { AdminOverviewSection } from "./AdminOverviewSection";
import { AdminFiltersSection } from "./AdminFiltersSection";

interface AdminUnifiedWorkspaceProps {
  stats: Stats | null;
  items: ApplicationItem[];

  q: string;
  status: "ALL" | ApplicationStatus;
  minAmount: string;
  maxAmount: string;
  sortBy: "date" | "amount" | "status";
  sortOrder: "asc" | "desc";

  onSearchChange: (query: string) => void;
  onStatusChange: (status: "ALL" | ApplicationStatus) => void;
  onMinAmountChange: (amount: string) => void;
  onMaxAmountChange: (amount: string) => void;
  onSortByChange: (sortBy: "date" | "amount" | "status") => void;
  onSortOrderChange: (order: "asc" | "desc") => void;
  onReset: () => void;
}

function hoursSince(dateString: string): number | null {
  const t = new Date(dateString).getTime();
  if (!Number.isFinite(t)) return null;
  return Math.max(0, Math.floor((Date.now() - t) / (1000 * 60 * 60)));
}

function hasActiveFilters(
  q: string,
  status: "ALL" | ApplicationStatus,
  minAmount: string,
  maxAmount: string,
  sortBy: "date" | "amount" | "status",
  sortOrder: "asc" | "desc",
): boolean {
  return (
    q.trim().length > 0 ||
    status !== "ALL" ||
    minAmount !== "" ||
    maxAmount !== "" ||
    sortBy !== "date" ||
    sortOrder !== "desc"
  );
}

export default function AdminUnifiedWorkspace({
  stats,
  items,
  q,
  status,
  minAmount,
  maxAmount,
  sortBy,
  sortOrder,
  onSearchChange,
  onStatusChange,
  onMinAmountChange,
  onMaxAmountChange,
  onSortByChange,
  onSortOrderChange,
  onReset,
}: AdminUnifiedWorkspaceProps) {
  const pendingItems = useMemo(
    () => items.filter((item) => item.status === "PENDING"),
    [items],
  );
  const newestPending = pendingItems[0] ?? null;
  const newestPendingAge = newestPending
    ? hoursSince(newestPending.createdAt)
    : null;

  const filtersActive = hasActiveFilters(
    q,
    status,
    minAmount,
    maxAmount,
    sortBy,
    sortOrder,
  );

  return (
    <AdminPanel
      title="Рабочее место"
      subtitle="Статистика, фильтры и быстрый доступ к очереди"
      className="mb-6"
    >
      {filtersActive ? (
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={onReset}
            className="flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-xl border-2 border-[#abd1c6]/25 px-3 py-2 text-xs font-bold text-[#abd1c6] transition-colors hover:border-[#f9bc60]/40 hover:bg-[#f9bc60]/10 hover:text-[#fffffe] sm:text-sm"
          >
            <LucideIcons.RefreshCw size="sm" />
            <span className="hidden sm:inline">Сбросить фильтры</span>
            <span className="sm:hidden">Сброс</span>
          </button>
        </div>
      ) : null}

      <AdminOverviewSection
        stats={stats}
        status={status}
        shownCount={items.length}
        newestId={newestPending?.id ?? null}
        newestTitle={newestPending?.title ?? null}
        newestAgeHours={newestPendingAge}
        onStatusChange={onStatusChange}
      />

      <AdminFiltersSection
        q={q}
        minAmount={minAmount}
        maxAmount={maxAmount}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSearchChange={onSearchChange}
        onMinAmountChange={onMinAmountChange}
        onMaxAmountChange={onMaxAmountChange}
        onSortByChange={onSortByChange}
        onSortOrderChange={onSortOrderChange}
      />
    </AdminPanel>
  );
}
