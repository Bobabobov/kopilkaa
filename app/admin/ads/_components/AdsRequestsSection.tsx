"use client";

import { useEffect, useState } from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { useBeautifulNotifications } from "@/components/ui/BeautifulNotificationsProvider";
import type { AdRequest, Stats } from "./ad-requests/types";
import AdRequestsStats from "./ad-requests/AdRequestsStats";
import AdRequestsFilters from "./ad-requests/AdRequestsFilters";
import AdRequestCard from "./ad-requests/AdRequestCard";
import AdRequestModal from "./ad-requests/AdRequestModal";
import { getMessageFromApiJson } from "@/lib/api/parseApiError";

export default function AdsRequestsSection() {
  const [adRequests, setAdRequests] = useState<AdRequest[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<AdRequest | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [adminComment, setAdminComment] = useState("");
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { showToast, showDialog } = useBeautifulNotifications();

  useEffect(() => {
    fetchAdRequests();
  }, [filterStatus]);

  const fetchAdRequests = async () => {
    setLoading(true);
    try {
      const url = `/api/ad-requests${
        filterStatus !== "all" ? `?status=${filterStatus}` : ""
      }`;
      const response = await fetch(url, {
        cache: "no-store",
      });
      if (response.ok) {
        const data = await response.json();
        setAdRequests(data.adRequests);
        setStats(data.stats);
      } else if (response.status === 401) {
        setAdRequests([]);
        setStats(null);
      } else {
        const data = await response.json().catch(() => null);
        console.error("Failed to fetch ad requests:", response.statusText);
        showToast(
          "error",
          "Не удалось загрузить заявки",
          getMessageFromApiJson(data, response.statusText || "Ошибка запроса"),
        );
      }
    } catch (error) {
      console.error("Error fetching ad requests:", error);
      showToast(
        "error",
        "Не удалось загрузить заявки",
        "Проверьте соединение и попробуйте ещё раз",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (request: AdRequest) => {
    setSelectedRequest(request);
    setNewStatus(request.status);
    setAdminComment(request.adminComment || "");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
    setNewStatus("");
    setAdminComment("");
  };

  const handleUpdateStatus = async () => {
    if (!selectedRequest) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/ad-requests/${selectedRequest.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          adminComment: adminComment,
        }),
      });

      if (response.ok) {
        await fetchAdRequests();
        handleCloseModal();
        showToast("success", "Заявка обновлена");
      } else {
        const data = await response.json().catch(() => null);
        console.error("Failed to update ad request:", response.statusText);
        showToast(
          "error",
          "Ошибка при обновлении заявки",
          getMessageFromApiJson(data, response.statusText || "Ошибка запроса"),
        );
      }
    } catch (error) {
      console.error("Error updating ad request:", error);
      showToast(
        "error",
        "Ошибка при обновлении заявки",
        "Проверьте соединение и попробуйте ещё раз",
      );
    } finally {
      setUpdating(false);
    }
  };

  const deleteRequest = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/ad-requests/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchAdRequests();
        showToast("success", "Заявка удалена");
      } else {
        const data = await response.json().catch(() => null);
        console.error("Failed to delete ad request:", response.statusText);
        showToast(
          "error",
          "Ошибка при удалении заявки",
          getMessageFromApiJson(data, response.statusText || "Ошибка запроса"),
        );
      }
    } catch (error) {
      console.error("Error deleting ad request:", error);
      showToast(
        "error",
        "Ошибка при удалении заявки",
        "Проверьте соединение и попробуйте ещё раз",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleDelete = (id: string) => {
    showDialog({
      type: "confirm",
      title: "Удалить заявку?",
      message: "Действие необратимо. Заявка будет удалена из системы.",
      confirmText: "Удалить",
      cancelText: "Отмена",
      onConfirm: () => void deleteRequest(id),
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f9bc60] mb-4"></div>
        <div className="text-[#abd1c6]">Загрузка заявок...</div>
      </div>
    );
  }

  return (
    <>
      {stats && <AdRequestsStats stats={stats} />}

      <AdRequestsFilters
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
      />

      <div className="space-y-4">
        {deletingId && (
          <div className="mb-2 text-xs text-[#abd1c6]/70">Удаляем...</div>
        )}
        {adRequests.length === 0 && !loading && (
          <div className="text-center py-16 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#001e1d] border border-[#abd1c6]/20 mb-4">
              <LucideIcons.Mail size="lg" className="text-[#abd1c6]/50" />
            </div>
            <h3 className="text-xl font-semibold text-[#fffffe] mb-2">
              Заявок не найдено
            </h3>
            <p className="text-[#abd1c6] max-w-md mx-auto">
              {filterStatus === "all"
                ? "Пока нет заявок на рекламу. Они появятся здесь после отправки формы на странице /advertising"
                : `Нет заявок со статусом "${filterStatus}"`}
            </p>
          </div>
        )}

        {adRequests.map((request) => (
          <AdRequestCard
            key={request.id}
            request={request}
            onProcess={handleOpenModal}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {showModal && selectedRequest && (
        <AdRequestModal
          request={selectedRequest}
          newStatus={newStatus}
          adminComment={adminComment}
          updating={updating}
          onStatusChange={setNewStatus}
          onCommentChange={setAdminComment}
          onUpdate={handleUpdateStatus}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
