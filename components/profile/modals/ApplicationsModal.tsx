"use client";

import { LucideIcons } from "@/components/ui/LucideIcons";
import {
  GlassModal,
  GlassModalCloseButton,
} from "@/components/ui/GlassModal";
import { useApplications } from "@/hooks/applications/useApplications";
import { StatsCards } from "@/components/applications/StatsCards";
import { FiltersAndSearch } from "@/components/applications/FiltersAndSearch";
import { ApplicationCard } from "@/components/applications/ApplicationCard";
import { Pagination } from "@/components/applications/Pagination";
import { EmptyState } from "@/components/applications/EmptyState";
import { useAutoHideScrollbar } from "@/hooks/ui/useAutoHideScrollbar";

interface ApplicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplicationsModal({
  isOpen,
  onClose,
}: ApplicationsModalProps) {
  useAutoHideScrollbar();
  const {
    items,
    stats,
    page,
    pages,
    loading,
    err,
    expanded,
    filter,
    setFilter,
    search,
    setSearch,
    sortBy,
    setSortBy,
    load,
    toggleExpanded,
  } = useApplications();

  const applicationsHeader = (
    <div className="relative shrink-0 border-b border-[#abd1c6]/20 bg-white/[0.05] px-4 py-4 backdrop-blur-xl sm:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f9bc60]">
            <LucideIcons.FileText size="lg" className="text-[#001e1d]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#fffffe]">Мои истории</h2>
            <p className="text-[#abd1c6]">
              {stats.total}{" "}
              {stats.total === 1
                ? "история"
                : stats.total < 5
                  ? "истории"
                  : "историй"}
            </p>
          </div>
        </div>
        <GlassModalCloseButton onClose={onClose} />
      </div>
    </div>
  );

  return (
    <GlassModal
      open={isOpen}
      onClose={onClose}
      size="4xl"
      zIndex={999}
      maxHeight="85vh"
      showCloseButton={false}
      header={applicationsHeader}
      bodyClassName="p-6"
    >
      {loading ? (
        <div className="py-12 text-center">
          <div
            className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"
            style={{ borderColor: "#f9bc60" }}
          />
          <p style={{ color: "#abd1c6" }}>Загрузка заявок...</p>
        </div>
      ) : err ? (
        <div className="py-12 text-center">
          <div className="mb-4 flex justify-center">
            <LucideIcons.AlertTriangle className="h-12 w-12 text-[#f9bc60]" />
          </div>
          <h3 className="mb-2 text-xl font-bold" style={{ color: "#fffffe" }}>
            Ошибка загрузки
          </h3>
          <p style={{ color: "#abd1c6" }}>{err}</p>
        </div>
      ) : (
        <>
          <StatsCards stats={stats} />
          <FiltersAndSearch
            search={search}
            setSearch={setSearch}
            filter={filter}
            setFilter={setFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
          <div className="mt-4 space-y-3 sm:space-y-4">
            {items.length === 0 ? (
              <EmptyState search={search} filter={filter} />
            ) : (
              items.map((item, index) => (
                <ApplicationCard
                  key={item.id}
                  item={item}
                  index={index}
                  isExpanded={!!expanded[item.id]}
                  onToggleExpanded={toggleExpanded}
                />
              ))
            )}
          </div>
          <Pagination page={page} pages={pages} onPageChange={load} />
        </>
      )}
    </GlassModal>
  );
}
