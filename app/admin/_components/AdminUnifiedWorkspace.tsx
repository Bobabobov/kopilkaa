"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { ApplicationItem, ApplicationStatus, Stats } from "@/types/admin";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { Card } from "@/components/ui/Card";
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="mb-6"
    >
      <Card variant="darkGlass" padding="md" className="space-y-0">
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#abd1c6]/10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#f9bc60] to-[#e8a545] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#f9bc60]/15">
              <LucideIcons.LayoutGrid size="sm" className="text-[#001e1d]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-black text-[#fffffe]">
                Рабочее место
              </h2>
              <p className="text-xs sm:text-sm text-[#abd1c6]/80">
                Статистика, фильтры и быстрый доступ к очереди
              </p>
            </div>
          </div>

          {filtersActive ? (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-[#abd1c6] hover:text-[#fffffe] border border-[#abd1c6]/25 hover:border-[#f9bc60]/40 hover:bg-[#f9bc60]/10 transition-colors flex-shrink-0 min-h-[40px]"
            >
              <LucideIcons.RefreshCw size="sm" />
              <span className="hidden sm:inline">Сбросить фильтры</span>
              <span className="sm:hidden">Сброс</span>
            </button>
          ) : null}
        </div>

        <div className="pt-4">
          <AdminOverviewSection
            stats={stats}
            status={status}
            shownCount={items.length}
            newestId={newestPending?.id ?? null}
            newestTitle={newestPending?.title ?? null}
            newestAgeHours={newestPendingAge}
            onStatusChange={onStatusChange}
          />
        </div>

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
      </Card>
    </motion.div>
  );
}
