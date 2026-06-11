"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import { useAutoHideScrollbar } from "@/hooks/ui/useAutoHideScrollbar";

interface ApplicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplicationsModal({
  isOpen,
  onClose,
}: ApplicationsModalProps) {
  const { showToast, ToastComponent } = useBeautifulToast();

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

  const [localNotification, setLocalNotification] = useState<{
    show: boolean;
    type: "success" | "error" | "info";
    title: string;
    message: string;
  }>({
    show: false,
    type: "info",
    title: "",
    message: "",
  });

  const showLocalNotification = (
    type: "success" | "error" | "info",
    title: string,
    message: string,
  ) => {
    setLocalNotification({ show: true, type, title, message });
    setTimeout(() => {
      setLocalNotification({
        show: false,
        type: "info",
        title: "",
        message: "",
      });
    }, 3000);
  };

  const applicationsHeader = (
    <div className="relative shrink-0 border-b border-[#abd1c6]/20 bg-white/[0.05] px-4 py-4 backdrop-blur-xl sm:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f9bc60]">
            <LucideIcons.FileText size="lg" className="text-[#001e1d]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#fffffe]">Мои заявки</h2>
            <p className="text-[#abd1c6]">
              {stats.total}{" "}
              {stats.total === 1
                ? "заявка"
                : stats.total < 5
                  ? "заявки"
                  : "заявок"}
            </p>
          </div>
        </div>
        <GlassModalCloseButton onClose={onClose} />
      </div>
    </div>
  );

  return (
    <>
      <GlassModal
        open={isOpen}
        onClose={onClose}
        size="4xl"
        zIndex={999}
        maxHeight="85vh"
        showCloseButton={false}
        header={applicationsHeader}
        headerAfter={
          <AnimatePresence>
            {localNotification.show && (
              <motion.div
                key="local-notification"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mx-4 mb-4 rounded-lg p-2.5 text-xs font-medium shadow-lg sm:mx-6 sm:p-3 sm:text-sm"
                style={{
                  background: "linear-gradient(135deg, #f9bc60, #fac570)",
                  color: "#001e1d",
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="flex-shrink-0 text-base sm:text-lg">
                    {localNotification.type === "success" ? (
                      <LucideIcons.CheckCircle className="h-5 w-5" />
                    ) : localNotification.type === "error" ? (
                      <LucideIcons.XCircle className="h-5 w-5" />
                    ) : (
                      <LucideIcons.Info className="h-5 w-5" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="break-words font-bold">
                      {localNotification.title}
                    </div>
                    <div
                      className="break-words text-xs sm:text-sm"
                      style={{ color: "#001e1d", opacity: 0.8 }}
                    >
                      {localNotification.message}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        }
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
            <h3
              className="mb-2 text-xl font-bold"
              style={{ color: "#fffffe" }}
            >
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
      <ToastComponent />
    </>
  );
}
