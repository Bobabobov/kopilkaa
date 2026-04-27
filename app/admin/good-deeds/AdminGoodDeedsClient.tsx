"use client";

import Link from "next/link";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { AdminHeader } from "../_components/AdminHeader";
import { ModerationCard } from "./_components/ModerationCard";
import { ModerationFilters } from "./_components/ModerationFilters";
import { ModerationNotice } from "./_components/ModerationNotice";
import { ModerationStats } from "./_components/ModerationStats";
import { useGoodDeedsModeration } from "./_lib/useGoodDeedsModeration";

export default function AdminGoodDeedsClient() {
  const {
    loading,
    busyId,
    bulkBusy,
    notice,
    selectedIds,
    selectedPendingCount,
    rejectCommentById,
    statusFilter,
    query,
    sortBy,
    stats,
    visibleItems,
    setRejectCommentById,
    setStatusFilter,
    setQuery,
    setSortBy,
    toggleSelect,
    clearSelection,
    selectAllVisiblePending,
    load,
    updateStatus,
    bulkApproveSelected,
    deleteItem,
    copyId,
    applyRejectTemplate,
  } = useGoodDeedsModeration();

  return (
    <div className="min-h-screen relative">
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-24 pb-10">
        <AdminHeader />

        <Card variant="darkGlass" className="mb-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="mb-2 text-2xl font-bold text-[#fffffe]">
                Модерация добрых дел
              </h2>
              <p className="text-[#abd1c6]/90">
                Проверяйте рассказ и материалы (фото/видео), затем подтверждайте
                или отклоняйте выполнение заданий.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="rounded-xl border-[#abd1c6]/35 text-[#abd1c6] hover:border-[#f9bc60]/50 hover:bg-[#f9bc60]/10 hover:text-[#fffffe]"
            >
              <Link href="/admin/good-deeds/withdrawals">
                Заявки на вывод
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>

        <ModerationStats stats={stats} />
        <ModerationFilters
          query={query}
          sortBy={sortBy}
          statusFilter={statusFilter}
          pendingCount={stats.pending}
          onQueryChange={setQuery}
          onSortByChange={setSortBy}
          onStatusFilterChange={setStatusFilter}
          onReload={load}
        />
        <ModerationNotice notice={notice} />
        <Card variant="darkGlass" className="mb-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#abd1c6]">
              Выбрано заявок на проверке:{" "}
              <span className="font-bold text-[#f9bc60]">
                {selectedPendingCount}
              </span>
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={selectAllVisiblePending}
                className="rounded-lg border-[#abd1c6]/35 text-[#abd1c6] hover:border-[#f9bc60]/50 hover:bg-[#f9bc60]/10 hover:text-[#fffffe]"
              >
                Выбрать все видимые
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={clearSelection}
                className="rounded-lg border-[#abd1c6]/35 text-[#abd1c6] hover:border-[#f9bc60]/50 hover:bg-[#f9bc60]/10 hover:text-[#fffffe]"
              >
                Снять выбор
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={bulkBusy || selectedPendingCount === 0}
                onClick={bulkApproveSelected}
                className="rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-60"
              >
                <CheckCircle2 className="mr-1.5 h-4 w-4" />
                Подтвердить выбранные
              </Button>
            </div>
          </div>
        </Card>

        {loading ? (
          <Card variant="default">
            <p className="text-[#abd1c6]">Загрузка...</p>
          </Card>
        ) : visibleItems.length === 0 ? (
          <Card variant="default">
            <p className="text-[#abd1c6]">Нет заявок по выбранным фильтрам.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {visibleItems.map((item) => (
              <ModerationCard
                key={item.id}
                item={item}
                busyId={busyId}
                selected={selectedIds.includes(item.id)}
                rejectComment={rejectCommentById[item.id] || ""}
                onToggleSelect={toggleSelect}
                onRejectCommentChange={(value) =>
                  setRejectCommentById((prev) => ({
                    ...prev,
                    [item.id]: value,
                  }))
                }
                onCopyId={copyId}
                onApplyRejectTemplate={applyRejectTemplate}
                onUpdateStatus={updateStatus}
                onDelete={deleteItem}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
