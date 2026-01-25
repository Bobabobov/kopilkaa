// app/admin/reports/AdminReportsClient.tsx
"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useReports } from "./hooks/useReports";
import { useUserActions } from "./hooks/useUserActions";
import ReportFilters from "./components/ReportFilters";
import ReportCard from "./components/ReportCard";

export default function AdminReportsClient() {
  const [statusFilter, setStatusFilter] = useState("pending");
  const { reports, loading, loadReports, updateReportStatus } =
    useReports(statusFilter);

  const { banUser, unbanUser, deleteUser } = useUserActions(loadReports);

  const handleBanUser = useCallback(
    async (userId: string, days?: number) => {
      const success = await banUser(userId, days);
      if (success) {
        // Перезагружаем данные
        await loadReports();
        // Если жалобы обновлены и фильтр показывает только ожидающие/рассмотренные,
        // переключаем на "all" чтобы показать все жалобы
        if (statusFilter === "pending" || statusFilter === "reviewed") {
          setStatusFilter("all");
        }
      }
      return success;
    },
    [banUser, statusFilter, loadReports],
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="w-full px-6 pt-32 pb-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Заголовок */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#fffffe] mb-2">Жалобы</h1>
              <p className="text-[#abd1c6]">
                Управление жалобами на пользователей
              </p>
            </div>

            {/* Навигация */}
            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin"
                className="px-3 py-2 text-sm lg:px-4 lg:py-2 lg:text-base bg-[#abd1c6] text-[#001e1d] font-semibold rounded-lg hover:bg-[#abd1c6]/90 transition-colors"
              >
                Заявки
              </Link>
              <Link
                href="/admin/reports"
                className="px-3 py-2 text-sm lg:px-4 lg:py-2 lg:text-base bg-[#f9bc60] text-[#001e1d] font-semibold rounded-lg hover:bg-[#f9bc60]/90 transition-colors"
              >
                Жалобы
              </Link>
              <Link
                href="/admin/achievements"
                className="px-3 py-2 text-sm lg:px-4 lg:py-2 lg:text-base bg-[#abd1c6] text-[#001e1d] font-semibold rounded-lg hover:bg-[#abd1c6]/90 transition-colors"
              >
                Достижения
              </Link>
            </div>
          </div>

          {/* Фильтры */}
          <ReportFilters
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
          />

          {/* Список жалоб */}
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-[#f9bc60] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#abd1c6]">Загрузка...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12 bg-[#001e1d]/30 rounded-2xl border border-[#abd1c6]/10">
              <p className="text-[#abd1c6]">Нет жалоб</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onBanUser={handleBanUser}
                  onUnbanUser={unbanUser}
                  onDeleteUser={deleteUser}
                  onUpdateStatus={updateReportStatus}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
