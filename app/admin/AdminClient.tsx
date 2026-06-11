// app/admin/AdminClient.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import ApplicationsGrid from "./_components/ApplicationsGrid";
import ImageLightbox from "./_components/ImageLightbox";
import AdminLoading from "./_components/AdminLoading";
import { AdminHeader } from "./_components/AdminHeader";
import { AdminLoadingIndicator } from "./_components/AdminLoadingIndicator";
import { AdminEndMessage } from "./_components/AdminEndMessage";
import AdminUnifiedWorkspace from "./_components/AdminUnifiedWorkspace";
import { useAdminApplications } from "@/hooks/admin/useAdminApplications";

export default function AdminClient() {
  const {
    // Состояние
    items,
    displayItems,
    isSearchPending,
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

  const handleResetFilters = () => {
    setQ("");
    setStatus("ALL");
    setMinAmount("");
    setMaxAmount("");
    setSortBy("date");
    setSortOrder("desc");
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <div className="relative z-10 min-w-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 min-w-0">
          <AdminHeader />

          <AdminUnifiedWorkspace
            stats={stats}
            items={displayItems}
            q={q}
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
            onReset={handleResetFilters}
          />

          {/* Список заявок */}
          <div className="mt-8">
            <ApplicationsGrid
              applications={displayItems}
              loading={loading && displayItems.length === 0}
              isSearchPending={isSearchPending || (loading && q.trim().length > 0)}
              error={error}
              visibleEmails={visibleEmails}
              onToggleEmail={toggleEmail}
            />

            {/* Индикатор загрузки следующих заявок */}
            <AdminLoadingIndicator loading={loadingMore} />

            {/* Невидимый элемент для отслеживания скролла */}
            {hasMore && !loadingMore && (
              <div ref={observerTarget} className="h-20" />
            )}

            {/* Сообщение о конце списка */}
            <AdminEndMessage hasMore={hasMore} itemsCount={displayItems.length} />
          </div>
        </div>
      </div>

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


