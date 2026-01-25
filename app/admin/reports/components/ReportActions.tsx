// app/admin/reports/components/ReportActions.tsx
"use client";

import { Report } from "../hooks/useReports";

interface ReportActionsProps {
  report: Report;
  onBanUser: (userId: string, days?: number) => Promise<boolean>;
  onUnbanUser: (userId: string) => Promise<boolean>;
  onDeleteUser: (userId: string) => Promise<boolean>;
  onUpdateStatus: (reportId: string, status: string) => Promise<boolean>;
}

export default function ReportActions({
  report,
  onBanUser,
  onUnbanUser,
  onDeleteUser,
  onUpdateStatus,
}: ReportActionsProps) {
  const isCurrentlyBanned =
    report.reported.isBanned &&
    (!report.reported.bannedUntil ||
      new Date(report.reported.bannedUntil) > new Date());

  const handleBan = async (days?: number) => {
    await onBanUser(report.reported.id, days);
  };

  return (
    <div className="space-y-4">
      {/* Действия с пользователем */}
      <div>
        <p className="text-[#abd1c6] text-sm mb-2">Действия:</p>
        <div className="flex flex-wrap gap-2">
          {!isCurrentlyBanned ? (
            <>
              <button
                onClick={() => handleBan(1)}
                className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-colors"
              >
                Заблокировать на 1 день
              </button>
              <button
                onClick={() => handleBan(7)}
                className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-colors"
              >
                На 7 дней
              </button>
              <button
                onClick={() => handleBan()}
                className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-colors"
              >
                Навсегда
              </button>
            </>
          ) : (
            <button
              onClick={() => onUnbanUser(report.reported.id)}
              className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm transition-colors"
            >
              Разблокировать
            </button>
          )}
          <button
            onClick={() => onDeleteUser(report.reported.id)}
            className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-500 rounded-lg text-sm transition-colors"
          >
            Удалить
          </button>
        </div>
      </div>

      {/* Изменение статуса жалобы */}
      {report.status === "pending" && (
        <div className="flex gap-2">
          <button
            onClick={() => onUpdateStatus(report.id, "reviewed")}
            className="px-3 py-1.5 bg-[#abd1c6]/20 hover:bg-[#abd1c6]/30 text-[#abd1c6] rounded-lg text-sm transition-colors"
          >
            Рассмотреть
          </button>
          <button
            onClick={() => onUpdateStatus(report.id, "dismissed")}
            className="px-3 py-1.5 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded-lg text-sm transition-colors"
          >
            Отклонить
          </button>
        </div>
      )}

      {report.status === "reviewed" && (
        <button
          onClick={() => onUpdateStatus(report.id, "resolved")}
          className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm transition-colors"
        >
          Решено
        </button>
      )}
    </div>
  );
}
