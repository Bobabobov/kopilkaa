// app/admin/AdminClient.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ApplicationStatus } from "./types";
import StatsCards from "./components/StatsCards";
import ControlPanel from "./components/ControlPanel";
import ApplicationsGrid from "./components/ApplicationsGrid";
import StatusModal from "./components/StatusModal";
import ImageLightbox from "./components/ImageLightbox";
import Pagination from "./components/Pagination";
import PageTimeStats from "./components/PageTimeStats";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import UniversalBackground from "@/components/ui/UniversalBackground";
import { useAdminApplications } from "./hooks/useAdminApplications";

export default function AdminClient() {
  const {
    // Состояние
    items,
    loading,
    error,
    page,
    pages,
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
    load,
    setPage,
    refreshStats,
    toggleEmail,
    visibleEmails,
  } = useAdminApplications();

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

  // Быстрое обновление статуса
  const quickUpdate = async (id: string, newStatus: ApplicationStatus, comment: string) => {
    try {
      const response = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, adminComment: comment }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // showToast(
      //   `Заявка ${newStatus === "APPROVED" ? "одобрена" : "отклонена"}!`,
      //   "success" as any
      // );

      // Обновляем данные
      await load(page);
      await refreshStats();
    } catch (err) {
      console.error("Failed to update application:", err);
      // showToast("Ошибка обновления заявки", "error" as any);
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

      // showToast("Статус заявки обновлен!", "success" as any);

      // Закрываем модалку
      setModal({ id: "", status: "PENDING", comment: "" });

      // Обновляем данные
      await load(page);
      await refreshStats();
    } catch (err) {
      console.error("Failed to update application:", err);
      // showToast("Ошибка обновления заявки", "error" as any);
    }
  };

  // Удаление заявки
  const deleteApplication = async () => {
    try {
      const response = await fetch(`/api/admin/applications/${deleteModal.id}`, {
      method: "DELETE",
    });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // showToast("Заявка удалена!", "success" as any);

      // Закрываем модалку
    setDeleteModal({ id: "", title: "" });

      // Обновляем данные
      await load(page);
      await refreshStats();
    } catch (err) {
      console.error("Failed to delete application:", err);
      // showToast("Ошибка удаления заявки", "error" as any);
    }
  };

  // Обработчики для ApplicationCard
  const handleEdit = (id: string, status: ApplicationStatus, comment: string) => {
    setModal({ id, status, comment });
  };

  const handleQuickApprove = (id: string, status: ApplicationStatus, comment: string) => {
    quickUpdate(id, status, comment);
  };

  const handleQuickReject = (id: string, status: ApplicationStatus, comment: string) => {
    quickUpdate(id, status, comment);
  };

  const handleDelete = (id: string, title: string) => {
    setDeleteModal({ id, title });
  };

  return (
    <div className="min-h-screen">
      <UniversalBackground />

      <div className="relative z-10">
        {/* Заголовок */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2" style={{ color: '#fffffe' }}>
                🔧 Админ Панель
              </h1>
              <p className="text-lg" style={{ color: '#abd1c6' }}>
                Управление заявками и статистика платформы
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="px-4 py-2 bg-white/90 backdrop-blur-xl hover:bg-gray-50 rounded-xl transition-all duration-300 border shadow-lg hover:shadow-xl"
                style={{ 
                  borderColor: '#abd1c6/30',
                  color: '#2d5a4e'
                }}
              >
                🏠 Главная
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
                        </div>

        {/* Пагинация */}
        {pages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={pages}
                onPageChange={setPage}
              />
            </div>
        )}

          {/* Статистика времени на странице */}
          <PageTimeStats />
        </div>
      </div>

      {/* Модалка статуса */}
      <StatusModal
        modal={modal}
        onClose={() => setModal({ id: "", status: "PENDING", comment: "" })}
        onStatusChange={(status) => setModal(prev => ({ ...prev, status }))}
        onCommentChange={(comment) => setModal(prev => ({ ...prev, comment }))}
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
                    borderColor: '#abd1c6/30',
                    color: '#2d5a4e'
                  }}
                >
                  Отмена
                </button>
                <button
                  onClick={deleteApplication}
                  className="px-6 py-3 text-white rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                  style={{ background: 'linear-gradient(135deg, #e16162 0%, #d63384 100%)' }}
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
        onClose={() => setLightbox({ isOpen: false, images: [], currentIndex: 0 })}
        images={lightbox.images}
        currentIndex={lightbox.currentIndex}
        onIndexChange={(index) => setLightbox(prev => ({ ...prev, currentIndex: index }))}
      />
    </div>
  );
}