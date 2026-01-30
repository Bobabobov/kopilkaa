"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
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
  const [mounted, setMounted] = useState(false);
  const { showToast, ToastComponent } = useBeautifulToast();

  // Автоскрытие скроллбаров
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

  // Локальные уведомления
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

  // Монтирование для Portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Горячие клавиши и блокировка прокрутки
  useEffect(() => {
    if (!isOpen) return;

    // Блокируем прокрутку фона более надежно
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;

    // Сохраняем текущую позицию прокрутки
    const scrollY = window.scrollY;

    // Блокируем прокрутку
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      // Восстанавливаем прокрутку
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;

      // Плавно восстанавливаем позицию прокрутки
      requestAnimationFrame(() => {
        window.scrollTo({
          top: scrollY,
          behavior: "instant",
        });
      });
    };
  }, [isOpen, onClose]);

  // Функция для показа локального уведомления
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

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <AnimatePresence>
      <motion.div
        key="applications-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[999] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          key="applications-modal-content"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] mx-4 flex flex-col custom-scrollbar"
          style={{
            border: "1px solid transparent",
            background:
              "linear-gradient(to right, #004643, #001e1d) border-box, linear-gradient(135deg, #004643, #001e1d) padding-box",
            backgroundClip: "border-box, padding-box",
            boxShadow:
              "0 0 0 1px rgba(171, 209, 198, 0.2), 0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Заголовок */}
          <div className="p-6 border-b border-[#abd1c6]/20 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#f9bc60] rounded-2xl flex items-center justify-center">
                  <LucideIcons.FileText size="lg" className="text-[#001e1d]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#fffffe]">
                    Мои заявки
                  </h2>
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
              <button
                onClick={onClose}
                className="w-10 h-10 bg-[#abd1c6]/20 hover:bg-[#abd1c6]/30 rounded-xl flex items-center justify-center transition-colors"
              >
                <LucideIcons.X size="sm" className="text-[#fffffe]" />
              </button>
            </div>
          </div>

          {/* Локальное уведомление */}
          <AnimatePresence>
            {localNotification.show && (
              <motion.div
                key="local-notification"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mx-4 sm:mx-6 mb-4 p-2.5 sm:p-3 rounded-lg text-xs sm:text-sm font-medium shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #f9bc60, #fac570)",
                  color: "#001e1d",
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg flex-shrink-0">
                    {localNotification.type === "success"
                      ? "✅"
                      : localNotification.type === "error"
                        ? "❌"
                        : "ℹ️"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold break-words">
                      {localNotification.title}
                    </div>
                    <div
                      className="text-xs sm:text-sm break-words"
                      style={{ color: "#001e1d", opacity: 0.8 }}
                    >
                      {localNotification.message}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Контент */}
          <div className="flex-1 p-6 overflow-y-auto">
            {loading ? (
              <div className="text-center py-12">
                <div
                  className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
                  style={{ borderColor: "#f9bc60" }}
                ></div>
                <p style={{ color: "#abd1c6" }}>Загрузка заявок...</p>
              </div>
            ) : err ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4" style={{ color: "#f9bc60" }}>
                  ⚠️
                </div>
                <h3
                  className="text-xl font-bold mb-2"
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
                <div className="space-y-3 sm:space-y-4 mt-4">
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
          </div>
        </motion.div>
      </motion.div>
      <ToastComponent key="toast-component" />
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
