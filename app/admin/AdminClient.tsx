// app/admin/AdminClient.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ApplicationStatus } from "./types";
import StatsCards from "./components/StatsCards";
import ControlPanel from "./components/ControlPanel";
import ApplicationsGrid from "./components/ApplicationsGrid";
import StatusModal from "./components/StatusModal";
import ImageLightbox from "./components/ImageLightbox";
import AdminLoading from "./components/AdminLoading";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import UniversalBackground from "@/components/ui/UniversalBackground";
import { useAdminApplications } from "./hooks/useAdminApplications";

export default function AdminClient() {
  const {
    // Состояние
    items,
    loading,
    loadingMore,
    error,
    hasMore,
    stats,

    // Фильтры
    q,
    setQ,
    status,
    setStatus,
    minAmount,
    setMinAmount,
    maxAmount,
    setMaxAmount,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,

    // Действия
    loadMore,
    refreshStats,
    refreshApplications,
    toggleEmail,
    visibleEmails,
  } = useAdminApplications();

  // Intersection Observer для бесконечной прокрутки
  const observerTarget = useRef<HTMLDivElement>(null);

  // Модалка статуса
  const [modal, setModal] = useState<{
    id: string;
    status: ApplicationStatus;
    comment: string;
  }>({
    id: "",
    status: "PENDING",
    comment: "",
  });

  // Модалка удаления
  const [deleteModal, setDeleteModal] = useState<{
    id: string;
    title: string;
  }>({ id: "", title: "" });

  // Лайтбокс для изображений
  const [lightbox, setLightbox] = useState<{
    isOpen: boolean;
    images: string[];
    currentIndex: number;
  }>({
    isOpen: false,
    images: [],
    currentIndex: 0,
  });

  const { showToast } = useBeautifulToast();

  // Intersection Observer для бесконечной прокрутки
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadingMore, hasMore, loading, loadMore]);

  // Быстрое обновление статуса
  const quickUpdate = async (
    id: string,
    newStatus: ApplicationStatus,
    comment: string,
  ) => {
    try {
      const response = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, adminComment: comment }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      showToast(
        "success",
        `Заявка ${newStatus === "APPROVED" ? "одобрена" : "отклонена"}!`
      );

      // Обновляем данные
      await Promise.all([
        refreshStats(),
        refreshApplications()
      ]);
    } catch (err) {
      console.error("Failed to update application:", err);
      showToast("error", "Ошибка обновления заявки");
    }
  };

  // Обновление статуса через модалку
  const updateStatus = async () => {
    try {
      const response = await fetch(`/api/admin/applications/${modal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: modal.status,
          adminComment: modal.comment,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      showToast("success", "Статус заявки обновлен!");

      // Закрываем модалку
      setModal({ id: "", status: "PENDING", comment: "" });

      // Обновляем данные
      await Promise.all([
        refreshStats(),
        refreshApplications()
      ]);
    } catch (err) {
      console.error("Failed to update application:", err);
      showToast("error", "Ошибка обновления заявки");
    }
  };

  // Удаление заявки
  const deleteApplication = async () => {
    try {
      const response = await fetch(
        `/api/admin/applications/${deleteModal.id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      showToast("success", "Заявка удалена!");

      // Закрываем модалку
      setDeleteModal({ id: "", title: "" });

      // Обновляем данные
      await Promise.all([
        refreshStats(),
        refreshApplications()
      ]);
    } catch (err) {
      console.error("Failed to delete application:", err);
      showToast("error", "Ошибка удаления заявки");
    }
  };

  // Обработчики для ApplicationCard
  const handleEdit = (
    id: string,
    status: ApplicationStatus,
    comment: string,
  ) => {
    setModal({ id, status, comment });
  };

  const handleQuickApprove = (
    id: string,
    status: ApplicationStatus,
    comment: string,
  ) => {
    quickUpdate(id, status, comment);
  };

  const handleQuickReject = (
    id: string,
    status: ApplicationStatus,
    comment: string,
  ) => {
    quickUpdate(id, status, comment);
  };

  const handleDelete = (id: string, title: string) => {
    setDeleteModal({ id, title });
  };

  // Показываем загрузку при первой загрузке
  if (loading && items.length === 0) {
    return <AdminLoading />;
  }

  return (
    <div className="min-h-screen">
      <UniversalBackground />

      <div className="relative z-10">
        {/* Заголовок */}
        <div className="container mx-auto px-4 pt-24 pb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
            <div>
              <h1
                className="text-3xl lg:text-4xl font-bold mb-2"
                style={{ color: "#fffffe" }}
              >
                🔧 Админ Панель
              </h1>
              <p className="text-base lg:text-lg" style={{ color: "#abd1c6" }}>
                Управление заявками и статистика платформы
              </p>
            </div>
            
              {/* Навигация */}
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/admin"
                  className="px-3 py-2 text-sm lg:px-4 lg:py-2 lg:text-base bg-[#f9bc60] text-[#001e1d] font-semibold rounded-lg hover:bg-[#f9bc60]/90 transition-colors"
                >
                  Заявки
                </Link>
                <Link
                  href="/admin/achievements"
                  className="px-3 py-2 text-sm lg:px-4 lg:py-2 lg:text-base bg-[#abd1c6] text-[#001e1d] font-semibold rounded-lg hover:bg-[#abd1c6]/90 transition-colors"
                >
                  Достижения
                </Link>
                <Link
                  href="/admin/ads"
                  className="px-3 py-2 text-sm lg:px-4 lg:py-2 lg:text-base bg-[#abd1c6] text-[#001e1d] font-semibold rounded-lg hover:bg-[#abd1c6]/90 transition-colors"
                >
                  Реклама
                </Link>
                <Link
                  href="/admin/ad-requests"
                  className="px-3 py-2 text-sm lg:px-4 lg:py-2 lg:text-base bg-[#abd1c6] text-[#001e1d] font-semibold rounded-lg hover:bg-[#abd1c6]/90 transition-colors"
                >
                  Заявки на рекламу
                </Link>
                <Link
                  href="/admin/reports"
                  className="px-3 py-2 text-sm lg:px-4 lg:py-2 lg:text-base bg-[#abd1c6] text-[#001e1d] font-semibold rounded-lg hover:bg-[#abd1c6]/90 transition-colors"
                >
                  Жалобы
                </Link>
              </div>
          </div>

          {/* Статистика */}
          {stats && <StatsCards stats={stats} />}

          {/* Панель управления */}
          <ControlPanel
            searchQuery={q}
            status={status}
            minAmount={minAmount}
            maxAmount={maxAmount}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSearchChange={setQ}
            onStatusChange={setStatus}
            onMinAmountChange={setMinAmount}
            onMaxAmountChange={setMaxAmount}
            onSortByChange={setSortBy}
            onSortOrderChange={setSortOrder}
            onReset={() => {
              setQ("");
              setStatus("ALL");
              setMinAmount("");
              setMaxAmount("");
              setSortBy("date");
              setSortOrder("desc");
            }}
          />

          {/* Список заявок */}
          <div className="mt-8">
            <ApplicationsGrid
              applications={items}
              loading={loading}
              error={error}
              visibleEmails={visibleEmails}
              onToggleEmail={toggleEmail}
              onEdit={handleEdit}
              onQuickApprove={handleQuickApprove}
              onQuickReject={handleQuickReject}
              onDelete={handleDelete}
            />

            {/* Индикатор загрузки следующих заявок */}
            {loadingMore && (
              <div className="flex justify-center items-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 border-4 border-[#abd1c6] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-[#abd1c6] font-medium">
                    Загружаем ещё заявки...
                  </p>
                </div>
              </div>
            )}

            {/* Невидимый элемент для отслеживания скролла */}
            {hasMore && !loadingMore && (
              <div ref={observerTarget} className="h-20" />
            )}

            {/* Сообщение о конце списка */}
            {!hasMore && items.length > 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 transition-all duration-300 hover:scale-110 hover:bg-white/10 hover:border-[#abd1c6]/50 hover:shadow-lg hover:shadow-[#abd1c6]/20 cursor-default">
                  <p className="text-[#abd1c6] font-medium transition-all duration-300 hover:text-[#f9bc60]">
                    А всё, ноу заявок!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Модалка статуса */}
      <StatusModal
        modal={modal}
        onClose={() => setModal({ id: "", status: "PENDING", comment: "" })}
        onStatusChange={(status) => setModal((prev) => ({ ...prev, status }))}
        onCommentChange={(comment) =>
          setModal((prev) => ({ ...prev, comment }))
        }
        onSave={updateStatus}
      />

      {/* Модалка удаления */}
      {deleteModal.id && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100 dark:border-gray-700">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">🗑️</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Удалить заявку?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Вы уверены, что хотите удалить заявку
              </p>
              <p className="text-sm text-red-500 font-medium mb-8">
                "{deleteModal.title}"?
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setDeleteModal({ id: "", title: "" })}
                  className="px-6 py-3 bg-white/90 backdrop-blur-xl hover:bg-gray-50 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                  style={{
                    borderColor: "#abd1c6/30",
                    color: "#2d5a4e",
                  }}
                >
                  Отмена
                </button>
                <button
                  onClick={deleteApplication}
                  className="px-6 py-3 text-white rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, #e16162 0%, #d63384 100%)",
                  }}
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Лайтбокс изображений */}
      <ImageLightbox
        isOpen={lightbox.isOpen}
        onClose={() =>
          setLightbox({ isOpen: false, images: [], currentIndex: 0 })
        }
        images={lightbox.images}
        currentIndex={lightbox.currentIndex}
        onIndexChange={(index) =>
          setLightbox((prev) => ({ ...prev, currentIndex: index }))
        }
      />
    </div>
  );
}
