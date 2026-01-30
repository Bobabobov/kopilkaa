// app/admin/reports/components/ReportCard.tsx
"use client";

import { motion } from "framer-motion";
import { Report } from "@/hooks/admin/reports/useReports";
import UserCard from "./UserCard";
import ReportActions from "./ReportActions";

interface ReportCardProps {
  report: Report;
  onBanUser: (userId: string, days?: number) => Promise<boolean>;
  onUnbanUser: (userId: string) => Promise<boolean>;
  onDeleteUser: (userId: string) => Promise<boolean>;
  onUpdateStatus: (reportId: string, status: string) => Promise<boolean>;
}

export default function ReportCard({
  report,
  onBanUser,
  onUnbanUser,
  onDeleteUser,
  onUpdateStatus,
}: ReportCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-[#f9bc60]/20 text-[#f9bc60]";
      case "resolved":
        return "bg-green-500/20 text-green-400";
      case "reviewed":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-[#abd1c6]/20 text-[#abd1c6]";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Ожидает";
      case "resolved":
        return "Решена";
      case "reviewed":
        return "Рассмотрена";
      case "dismissed":
        return "Отклонена";
      default:
        return status;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#001e1d]/30 rounded-2xl p-6 border border-[#abd1c6]/10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Кто пожаловался */}
        <UserCard
          userId={report.reporter.id}
          name={report.reporter.name}
          email={report.reporter.email}
          avatar={report.reporter.avatar}
          label="Кто пожаловался:"
        />

        {/* На кого пожаловались */}
        <UserCard
          userId={report.reported.id}
          name={report.reported.name}
          email={report.reported.email}
          avatar={report.reported.avatar}
          label="На кого пожаловались:"
          isBanned={report.reported.isBanned}
          bannedUntil={report.reported.bannedUntil}
        />

        {/* Действия */}
        <ReportActions
          report={report}
          onBanUser={onBanUser}
          onUnbanUser={onUnbanUser}
          onDeleteUser={onDeleteUser}
          onUpdateStatus={onUpdateStatus}
        />
      </div>

      {/* Текст жалобы */}
      <div className="mt-4 p-4 bg-[#001e1d]/50 rounded-xl border border-[#abd1c6]/10">
        <p className="text-[#fffffe] whitespace-pre-wrap">{report.reason}</p>
      </div>

      {/* Статус и дата */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span
            className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(
              report.status,
            )}`}
          >
            {getStatusLabel(report.status)}
          </span>
          <span className="text-[#abd1c6] text-sm">
            {new Date(report.createdAt).toLocaleString("ru-RU")}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
