// app/admin/AdminClient.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import StatsCards from "./_components/StatsCards";
import ControlPanel from "./_components/ControlPanel";
import ApplicationsGrid from "./_components/ApplicationsGrid";
import StatusModal from "./_components/StatusModal";
import ImageLightbox from "./_components/ImageLightbox";
import AdminLoading from "./_components/AdminLoading";
import { AdminHeader } from "./_components/AdminHeader";
import { DeleteModal } from "./_components/DeleteModal";
import { AdminLoadingIndicator } from "./_components/AdminLoadingIndicator";
import { AdminEndMessage } from "./_components/AdminEndMessage";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import { useAdminApplications } from "@/hooks/admin/useAdminApplications";
import { useAdminActions } from "@/hooks/admin/useAdminActions";

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

  // Используем хук для действий админа
  const {
    modal,
    setModal,
    deleteModal,
    setDeleteModal,
    updateStatus,
    deleteApplication,
    handleEdit,
    handleQuickApprove,
    handleQuickReject,
    handleDelete,
    toggleTrust,
  } = useAdminActions({
    refreshStats,
    refreshApplications,
    showToast,
  });

  // Intersection Observer для бесконечной прокрутки
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" },
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

  // Восстанавливаем скролл после возврата со страницы заявки
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

  // Показываем загрузку при первой загрузке
  if (loading && items.length === 0) {
    return <AdminLoading />;
  }

  return (
    <div className="min-h-screen relative">
      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12">
          <AdminHeader />

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
              onToggleTrust={toggleTrust}
            />

            {/* Индикатор загрузки следующих заявок */}
            <AdminLoadingIndicator loading={loadingMore} />

            {/* Невидимый элемент для отслеживания скролла */}
            {hasMore && !loadingMore && (
              <div ref={observerTarget} className="h-20" />
            )}

            {/* Сообщение о конце списка */}
            <AdminEndMessage hasMore={hasMore} itemsCount={items.length} />
          </div>
        </div>
      </div>

      {/* Модалка статуса */}
      <StatusModal
        modal={modal}
        onClose={() =>
          setModal({
            id: "",
            status: "PENDING",
            comment: "",
            decreaseTrustOnDecision: false,
            publishInStories: false,
          })
        }
        onStatusChange={(status) =>
          setModal((prev) => ({
            ...prev,
            status,
            decreaseTrustOnDecision:
              status === "APPROVED" || status === "REJECTED"
                ? prev.decreaseTrustOnDecision
                : false, // «Конкурс» не одобряет и не отклоняет
            publishInStories:
              status === "CONTEST" ? prev.publishInStories : false,
          }))
        }
        onCommentChange={(comment) =>
          setModal((prev) => ({ ...prev, comment }))
        }
        onDecreaseTrustChange={(next) =>
          setModal((prev) => ({ ...prev, decreaseTrustOnDecision: next }))
        }
        onPublishChange={(publishInStories) =>
          setModal((prev) => ({ ...prev, publishInStories }))
        }
        onSave={updateStatus}
      />

      {/* Модалка удаления */}
      <DeleteModal
        id={deleteModal.id}
        title={deleteModal.title}
        onClose={() => setDeleteModal({ id: "", title: "" })}
        onConfirm={deleteApplication}
      />

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
