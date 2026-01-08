// Карточка деталей баг-репорта
"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { BugReport } from "@/app/reports/page";
import ReportImages from "./ReportImages";
import AdminComment from "./AdminComment";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  OPEN: {
    label: "Открыт",
    color: "bg-[#e16162]/20 text-[#e16162] border-[#e16162]/30",
    icon: LucideIcons.Circle,
  },
  IN_PROGRESS: {
    label: "В работе",
    color: "bg-[#f9bc60]/20 text-[#f9bc60] border-[#f9bc60]/30",
    icon: LucideIcons.Clock,
  },
  RESOLVED: {
    label: "Решено",
    color: "bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30",
    icon: LucideIcons.CheckCircle,
  },
  CLOSED: {
    label: "Закрыт",
    color: "bg-[#abd1c6]/20 text-[#abd1c6] border-[#abd1c6]/30",
    icon: LucideIcons.XCircle,
  },
};

interface ReportDetailCardProps {
  report: BugReport & { userLike: boolean | null };
  onLike: (isLike: boolean) => void;
  liking: boolean;
  onImageClick: (url: string) => void;
}

export default function ReportDetailCard({
  report,
  onLike,
  liking,
  onImageClick,
}: ReportDetailCardProps) {
  const statusConfig = STATUS_CONFIG[report.status] || STATUS_CONFIG.OPEN;
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-br from-[#004643]/60 to-[#001e1d]/40 border border-[#abd1c6]/30 shadow-xl"
    >
      {/* Декоративные элементы */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#e16162]/5 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-[#f9bc60]/5 rounded-full blur-xl"></div>

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-[#fffffe] mb-4 break-words">
              {report.title}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium ${statusConfig.color}`}>
                <StatusIcon size="sm" />
                <span>{statusConfig.label}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Описание */}
        <div className="prose prose-invert max-w-none">
          <p className="text-base text-[#abd1c6] leading-relaxed whitespace-pre-wrap break-words">
            {report.description}
          </p>
        </div>

        {/* Изображения */}
        {report.images.length > 0 && (
          <ReportImages images={report.images} onImageClick={onImageClick} />
        )}

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-[#abd1c6]/20">
          <div className="flex items-center gap-4 text-sm text-[#abd1c6]">
            <div className="flex items-center gap-2">
              <img
                src={report.user.avatar || "/default-avatar.png"}
                alt={report.user.name || "User"}
                className="w-8 h-8 rounded-full"
                onError={(e) => {
                  e.currentTarget.src = "/default-avatar.png";
                }}
              />
              <span className="font-medium">
                {report.user.name ||
                  (report.user.email
                    ? report.user.email.split("@")[0]
                    : "Пользователь")}
              </span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <LucideIcons.Calendar size="sm" />
              <span>
                {new Date(report.createdAt).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                в{" "}
                {new Date(report.createdAt).toLocaleTimeString("ru-RU", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          {/* Лайки */}
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => onLike(true)}
              disabled={liking}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                report.userLike === true
                  ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30"
                  : "bg-[#001e1d]/40 text-[#abd1c6] border border-[#abd1c6]/20 hover:border-[#10B981]/50"
              }`}
            >
              <LucideIcons.ThumbsUp size="sm" />
              <span className="text-sm font-medium">{report.likesCount}</span>
            </motion.button>
            <motion.button
              onClick={() => onLike(false)}
              disabled={liking}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                report.userLike === false
                  ? "bg-[#e16162]/20 text-[#e16162] border border-[#e16162]/30"
                  : "bg-[#001e1d]/40 text-[#abd1c6] border border-[#abd1c6]/20 hover:border-[#e16162]/50"
              }`}
            >
              <LucideIcons.ThumbsDown size="sm" />
              <span className="text-sm font-medium">{report.dislikesCount}</span>
            </motion.button>
          </div>
        </div>

        {/* Комментарий администратора */}
        {report.adminComment && <AdminComment comment={report.adminComment} />}
      </div>
    </motion.div>
  );
}

