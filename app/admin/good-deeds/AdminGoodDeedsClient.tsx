"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPage } from "../_components/AdminPage";
import Pagination from "../_components/Pagination";
import { AdminPanel } from "../_components/admin-ui";
import { ModerationFilters } from "./_components/ModerationFilters";
import { ModerationNotice } from "./_components/ModerationNotice";
import { ModerationStats } from "./_components/ModerationStats";
import { TasksManagementSection } from "./_components/TasksManagementSection";
import { GoodDeedsSubmissionsTable } from "./_components/GoodDeedsSubmissionsTable";
import { useAdminGoodDeedsSubmissions } from "@/hooks/admin/useAdminGoodDeedsSubmissions";
import type { StatusFilter } from "./_lib/types";

export default function AdminGoodDeedsClient() {
  const searchParams = useSearchParams();
  const initialStatusParam = searchParams.get("status");
  const initialStatus: StatusFilter =
    initialStatusParam === "PENDING" ||
    initialStatusParam === "APPROVED" ||
    initialStatusParam === "REJECTED"
      ? initialStatusParam
      : "PENDING";

  const {
    items,
    stats,
    loading,
    error,
    isSearchPending,
    page,
    total,
    totalPages,
    q,
    setQ,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    bulkBusy,
    notice,
    selectedIds,
    selectedPendingCount,
    toggleSelect,
    clearSelection,
    selectAllVisiblePending,
    bulkApproveSelected,
    setPage,
    reload,
    resetFilters,
  } = useAdminGoodDeedsSubmissions(initialStatus);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (loading) return;
    const saved = sessionStorage.getItem("admin-scroll");
    if (saved) {
      const y = parseInt(saved, 10);
      if (Number.isFinite(y)) {
        window.scrollTo({ top: y, behavior: "auto" });
      }
      sessionStorage.removeItem("admin-scroll");
    }
  }, [loading]);

  const displayStats = stats ?? {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  };

  return (
    <AdminPage
      title="Добрые дела"
      description="Модерация отчётов по заданиям: проверяйте рассказ, материалы и контекст участника."
    >
      <details className="mb-5 overflow-hidden rounded-2xl border-2 border-[#f9bc60]/20 bg-[#001e1d]/30">
        <summary className="cursor-pointer list-none border-b border-[#f9bc60]/15 bg-[#f9bc60]/8 px-4 py-3 text-sm font-bold text-[#f9bc60] hover:bg-[#f9bc60]/12 [&::-webkit-details-marker]:hidden">
          Управление заданиями недели
        </summary>
        <div className="border-t border-[#abd1c6]/10 px-4 py-4">
          <TasksManagementSection />
        </div>
      </details>

      <ModerationStats stats={displayStats} />

      <ModerationFilters
        query={q}
        sortBy={sortBy}
        statusFilter={statusFilter}
        pendingCount={displayStats.pending}
        onQueryChange={setQ}
        onSortByChange={setSortBy}
        onStatusFilterChange={setStatusFilter}
        onReload={() => reload().catch(console.error)}
      />

      {error ? (
        <p className="mb-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      <ModerationNotice notice={notice} />

      {statusFilter === "PENDING" || statusFilter === "ALL" ? (
        <AdminPanel
          title="Массовое одобрение"
          subtitle={`Выбрано на проверке: ${selectedPendingCount}`}
          className="mb-5"
          accent="neutral"
        >
          <div className="flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={selectAllVisiblePending}
                className="rounded-lg border-[#abd1c6]/35 text-xs text-[#abd1c6]"
              >
                Выбрать на странице
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={clearSelection}
                className="rounded-lg border-[#abd1c6]/35 text-xs text-[#abd1c6]"
              >
                Снять выбор
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={bulkBusy || selectedPendingCount === 0}
                onClick={() => bulkApproveSelected().catch(console.error)}
                className="rounded-lg bg-emerald-600 text-xs text-white hover:bg-emerald-500"
              >
                <CheckCircle2 className="mr-1.5 h-4 w-4" />
                Подтвердить выбранные
              </Button>
            </div>
        </AdminPanel>
      ) : null}

      {total > 0 ? (
        <p className="mb-3 text-sm text-[#abd1c6]/80">
          Показано {items.length} из {total}
          {totalPages > 1 ? ` · стр. ${page} / ${totalPages}` : ""}
          {isSearchPending ? " · поиск…" : ""}
        </p>
      ) : null}

      <GoodDeedsSubmissionsTable
        items={items}
        loading={loading || isSearchPending}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
      />

      {!loading && items.length === 0 && q.trim() ? (
        <div className="mt-4 text-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-[#abd1c6] hover:text-[#f9bc60]"
            onClick={resetFilters}
          >
            Сбросить фильтры
          </Button>
        </div>
      ) : null}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </AdminPage>
  );
}
