"use client";

import { useEffect, useState } from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface AdRequest {
  id: string;
  companyName: string;
  email: string;
  website?: string;
  format: string;
  duration: number;
  bannerUrl?: string;
  comment?: string;
  status: string;
  adminComment?: string;
  processedBy?: string;
  createdAt: string;
}

interface Stats {
  total: number;
  new: number;
  processing: number;
  approved: number;
  rejected: number;
}

const formatLabels: Record<string, string> = {
  banner: "Большой баннер наверху",
  side: "Блок сбоку",
  story: "Рекламная история",
  tg: "Telegram пост",
  post: "Рекламный пост",
  telegram: "Telegram",
  other: "Другое",
};

const statusLabels: Record<string, string> = {
  new: "Новая",
  processing: "В обработке",
  approved: "Одобрена",
  rejected: "Отклонена",
};

const statusColors: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-300 border-blue-500/50",
  processing: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
  approved: "bg-green-500/20 text-green-300 border-green-500/50",
  rejected: "bg-red-500/20 text-red-300 border-red-500/50",
};

export default function AdsRequestsSection() {
  const [adRequests, setAdRequests] = useState<AdRequest[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<AdRequest | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [adminComment, setAdminComment] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchAdRequests();
  }, [filterStatus]);

  const fetchAdRequests = async () => {
    setLoading(true);
    try {
      const url = `/api/ad-requests${
        filterStatus !== "all" ? `?status=${filterStatus}` : ""
      }`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setAdRequests(data.adRequests);
        setStats(data.stats);
      } else {
        console.error("Failed to fetch ad requests:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching ad requests:", error);
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
      } else {
        console.error("Failed to update ad request:", response.statusText);
        alert("Ошибка при обновлении заявки");
      }
    } catch (error) {
      console.error("Error updating ad request:", error);
      alert("Ошибка при обновлении заявки");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту заявку?")) return;

    try {
      const response = await fetch(`/api/ad-requests/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchAdRequests();
      } else {
        console.error("Failed to delete ad request:", response.statusText);
        alert("Ошибка при удалении заявки");
      }
    } catch (error) {
      console.error("Error deleting ad request:", error);
      alert("Ошибка при удалении заявки");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[#abd1c6]">Загрузка заявок...</div>
      </div>
    );
  }

  return (
    <>
      {/* Статистика заявок */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="p-4 bg-[#001e1d] rounded-xl border border-[#abd1c6]/30">
            <div className="text-2xl font-bold text-[#fffffe]">
              {stats.total}
            </div>
            <div className="text-sm text-[#abd1c6]">Всего заявок</div>
          </div>
          <div className="p-4 bg-[#001e1d] rounded-xl border border-blue-500/50">
            <div className="text-2xl font-bold text-blue-300">
              {stats.new}
            </div>
            <div className="text-sm text-[#abd1c6]">Новые</div>
          </div>
          <div className="p-4 bg-[#001e1d] rounded-xl border border-yellow-500/50">
            <div className="text-2xl font-bold text-yellow-300">
              {stats.processing}
            </div>
            <div className="text-sm text-[#abd1c6]">В обработке</div>
          </div>
          <div className="p-4 bg-[#001e1d] rounded-xl border border-green-500/50">
            <div className="text-2xl font-bold text-green-300">
              {stats.approved}
            </div>
            <div className="text-sm text-[#abd1c6]">Одобрено</div>
          </div>
          <div className="p-4 bg-[#001e1d] rounded-xl border border-red-500/50">
            <div className="text-2xl font-bold text-red-300">
              {stats.rejected}
            </div>
            <div className="text-sm text-[#abd1c6]">Отклонено</div>
          </div>
        </div>
      )}

      {/* Фильтры по заявкам */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilterStatus("all")}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filterStatus === "all"
              ? "bg-[#f9bc60] text-[#001e1d]"
              : "bg-[#001e1d] text-[#abd1c6] border border-[#abd1c6]/30 hover:border-[#abd1c6]/50"
          }`}
        >
          Все
        </button>
        <button
          onClick={() => setFilterStatus("new")}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filterStatus === "new"
              ? "bg-blue-500 text-white"
              : "bg-[#001e1d] text-[#abd1c6] border border-[#abd1c6]/30 hover:border-[#abd1c6]/50"
          }`}
        >
          Новые
        </button>
        <button
          onClick={() => setFilterStatus("processing")}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filterStatus === "processing"
              ? "bg-yellow-500 text-white"
              : "bg-[#001e1d] text-[#abd1c6] border border-[#abd1c6]/30 hover:border-[#abd1c6]/50"
          }`}
        >
          В обработке
        </button>
        <button
          onClick={() => setFilterStatus("approved")}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filterStatus === "approved"
              ? "bg-green-500 text-white"
              : "bg-[#001e1d] text-[#abd1c6] border border-[#abd1c6]/30 hover:border-[#abd1c6]/50"
          }`}
        >
          Одобренные
        </button>
        <button
          onClick={() => setFilterStatus("rejected")}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filterStatus === "rejected"
              ? "bg-red-500 text-white"
              : "bg-[#001e1d] text-[#abd1c6] border border-[#abd1c6]/30 hover:border-[#abd1c6]/50"
          }`}
        >
          Отклонённые
        </button>
      </div>

      {/* Список заявок */}
      <div className="space-y-4">
        {adRequests.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-[#abd1c6] text-lg">Заявок не найдено</p>
          </div>
        )}

        {adRequests.map((request) => (
          <div
            key={request.id}
            className="p-6 md:p-7 bg-gradient-to-br from-[#001e1d] via-[#001e1d] to-[#00312b] rounded-2xl border border-[#0b3b33]/60 hover:border-[#f9bc60]/50 hover:shadow-[0_18px_40px_rgba(0,0,0,0.55)] transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6 mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h3 className="text-xl font-bold text-[#fffffe] truncate">
                    {request.companyName}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[request.status]}`}
                  >
                    {statusLabels[request.status]}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-3 text-sm text-[#abd1c6]">
                  <div className="space-y-1">
                    <div>
                      <span className="font-medium text-[#fffffe]">
                        Email:
                      </span>{" "}
                      <a
                        href={`mailto:${request.email}`}
                        className="text-[#f9bc60] hover:underline break-all"
                      >
                        {request.email}
                      </a>
                    </div>
                    {request.website && (
                      <div>
                        <span className="font-medium text-[#fffffe]">
                          Сайт:
                        </span>{" "}
                        <a
                          href={request.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#f9bc60] hover:underline break-all"
                        >
                          {request.website}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div>
                      <span className="font-medium text-[#fffffe]">
                        Формат:
                      </span>{" "}
                      {formatLabels[request.format] || request.format}
                    </div>
                    <div>
                      <span className="font-medium text-[#fffffe]">
                        Срок:
                      </span>{" "}
                      {request.duration} дней
                    </div>
                    <div className="text-xs text-[#94b3aa]">
                      Создано:{" "}
                      {new Date(request.createdAt).toLocaleString("ru-RU")}
                    </div>
                  </div>
                </div>

                {request.comment && (
                  <div className="mt-4 rounded-2xl bg-[#002724] border border-[#0b3b33]/70 px-4 py-3">
                    <div className="text-xs uppercase tracking-wide text-[#7fb2a7] mb-1">
                      Комментарий
                    </div>
                    <div className="text-sm text-[#e5f5f1] whitespace-pre-line">
                      {request.comment}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-row md:flex-col gap-2 md:items-end shrink-0">
                <button
                  onClick={() => handleOpenModal(request)}
                  className="px-4 py-2 bg-[#abd1c6] text-[#001e1d] font-semibold rounded-lg hover:bg-[#d0e3dd] transition-colors flex items-center gap-2"
                >
                  <LucideIcons.Edit size="sm" />
                  Обработать
                </button>
                <button
                  onClick={() => handleDelete(request.id)}
                  className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <LucideIcons.Trash2 size="sm" />
                  Удалить
                </button>
              </div>
            </div>

            {request.adminComment && (
              <div className="mt-3 p-4 bg-[#002724] rounded-2xl border border-[#f9bc60]/40">
                <div className="text-xs text-[#f9bc60] mb-1 uppercase tracking-wide">
                  Комментарий администратора
                </div>
                <div className="text-sm text-[#fffffe] whitespace-pre-line">
                  {request.adminComment}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Модальное окно обработки заявки */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#001e1d] rounded-xl border border-[#abd1c6]/30 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#fffffe]">
                Обработка заявки
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-[#abd1c6] hover:text-[#fffffe] transition-colors"
              >
                <LucideIcons.X size="md" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <div className="text-sm font-medium text-[#abd1c6] mb-1">
                  Компания
                </div>
                <div className="text-[#fffffe]">
                  {selectedRequest.companyName}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-[#abd1c6] mb-1">
                  Email
                </div>
                <div className="text-[#fffffe]">{selectedRequest.email}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-[#abd1c6] mb-1">
                  Формат
                </div>
                <div className="text-[#fffffe]">
                  {formatLabels[selectedRequest.format] ||
                    selectedRequest.format}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-[#abd1c6] mb-1">
                  Срок
                </div>
                <div className="text-[#fffffe]">
                  {selectedRequest.duration} дней
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#abd1c6] mb-2">
                  Статус
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none"
                >
                  <option value="new">Новая</option>
                  <option value="processing">В обработке</option>
                  <option value="approved">Одобрена</option>
                  <option value="rejected">Отклонена</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#abd1c6] mb-2">
                  Комментарий администратора
                </label>
                <textarea
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] placeholder-[#abd1c6]/50 focus:border-[#f9bc60] focus:outline-none"
                  placeholder="Оставьте комментарий (необязательно)"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleUpdateStatus}
                  disabled={updating}
                  className="flex-1 px-6 py-3 bg-[#f9bc60] text-[#001e1d] font-semibold rounded-lg hover:bg-[#f9bc60]/90 transition-colors disabled:opacity-50"
                >
                  {updating ? "Сохранение..." : "Сохранить"}
                </button>
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


