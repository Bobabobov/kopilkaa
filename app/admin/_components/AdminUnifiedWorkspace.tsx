"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ApplicationItem, ApplicationStatus, Stats } from "@/types/admin";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { AdminOverviewSection } from "./AdminOverviewSection";
import { AdminFiltersSection } from "./AdminFiltersSection";

type TabId = "overview" | "filters";

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
  const [tab, setTab] = useState<TabId>("overview");

  const pendingItems = useMemo(
    () => items.filter((item) => item.status === "PENDING"),
    [items],
  );
  const newestPending = pendingItems[0] ?? null;
  const newestPendingAge = newestPending ? hoursSince(newestPending.createdAt) : null;

  const tabButton = (id: TabId, label: string, icon: keyof typeof LucideIcons) => {
    const Icon = LucideIcons[icon];
    const active = tab === id;
    return (
      <button
        type="button"
        onClick={() => setTab(id)}
        className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-black transition-colors min-h-[44px] ${
          active
            ? "bg-[#f9bc60] text-[#001e1d]"
            : "bg-[#001e1d]/60 text-[#abd1c6] hover:text-[#fffffe] border border-[#abd1c6]/20"
        }`}
        aria-pressed={active}
      >
        <Icon size="sm" className={active ? "text-[#001e1d]" : "text-[#abd1c6]"} />
        {label}
      </button>
    );
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.15 }}
      className="mb-6 sm:mb-8 rounded-2xl sm:rounded-3xl border border-[#abd1c6]/20 bg-gradient-to-br from-[#001e1d] via-[#004643]/90 to-[#001e1d] shadow-2xl overflow-hidden"
    >
      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#f9bc60] to-[#e8a545] flex items-center justify-center shadow-lg">
                <LucideIcons.LayoutGrid size="sm" className="text-[#001e1d]" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-2xl font-black text-[#fffffe] truncate">
                  Рабочее место админа
                </h2>
                <p className="text-xs sm:text-sm text-[#abd1c6]">
                  Всё важное в одном месте: обзор и фильтры по заявкам.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {tabButton("overview", "Обзор", "BarChart3")}
            {tabButton("filters", "Фильтры", "Filter")}
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-black min-h-[44px] bg-[#001e1d]/60 text-[#abd1c6] hover:text-[#fffffe] border border-[#abd1c6]/20 transition-colors"
            >
              <LucideIcons.RefreshCw size="sm" className="text-[#abd1c6]" />
              Сброс
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {tab === "overview" ? (
            <AdminOverviewSection
              stats={stats}
              pendingCount={stats?.pending ?? 0}
              newestId={newestPending?.id ?? null}
              newestTitle={newestPending?.title ?? null}
              newestAgeHours={newestPendingAge}
            />
          ) : (
            <AdminFiltersSection
              q={q}
              status={status}
              minAmount={minAmount}
              maxAmount={maxAmount}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSearchChange={onSearchChange}
              onStatusChange={onStatusChange}
              onMinAmountChange={onMinAmountChange}
              onMaxAmountChange={onMaxAmountChange}
              onSortByChange={onSortByChange}
              onSortOrderChange={onSortOrderChange}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
