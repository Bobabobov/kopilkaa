"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { BugReport } from "@/app/reports/page";

interface BugReportCardProps {
  report: BugReport;
  index: number;
  isAdmin?: boolean;
  onStatusUpdate?: (reportId: string, newStatus: string) => void;
  onDeleteReport?: (reportId: string) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  MODERATOR: "Модератор",
  DEVELOPER: "Разработчик",
  DESIGNER: "Дизайнер",
  OTHER: "Другое",
};

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

export default function BugReportCard({
  report,
  index,
  isAdmin = false,
  onStatusUpdate,
  onDeleteReport,
}: BugReportCardProps) {
  const router = useRouter();
  const [likes, setLikes] = useState(report.likesCount);
  const [dislikes, setDislikes] = useState(report.dislikesCount);
  const [userLike, setUserLike] = useState<boolean | null>(null);
  const [liking, setLiking] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(report.status);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const statusConfig = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.OPEN;
  const StatusIcon = statusConfig.icon;

  const [selectedStatus, setSelectedStatus] = useState(report.status);

  const toggleStatusDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowStatusDropdown((prev) => !prev);
  };

  const handleLike = async (isLike: boolean) => {
    if (liking) return;

    setLiking(true);
    try {
      const response = await fetch(`/api/bug-reports/${report.id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isLike }),
      });

      if (response.ok) {
        const data = await response.json();
        setLikes(data.likes);
        setDislikes(data.dislikes);
        
        if (userLike === isLike) {
          setUserLike(null); // Убираем лайк/дизлайк
        } else {
          setUserLike(isLike);
        }
      }
    } catch (error) {
      console.error("Like error:", error);
    } finally {
      setLiking(false);
    }
  };

  const handleCardClick = () => {
    router.push(`/reports/${report.id}`);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (updatingStatus || newStatus === currentStatus) {
      setShowStatusDropdown(false);
      return;
    }

    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/admin/bug-reports/${report.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setCurrentStatus(newStatus);
        if (onStatusUpdate) {
          onStatusUpdate(report.id, newStatus);
        }
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Status update error:", error);
    } finally {
      setUpdatingStatus(false);
      setShowStatusDropdown(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={handleCardClick}
      className="relative rounded-2xl p-6 bg-gradient-to-br from-[#004643]/60 to-[#001e1d]/40 border border-[#abd1c6]/30 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
    >
      {/* Декоративные элементы */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#e16162]/5 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-[#f9bc60]/5 rounded-full blur-xl"></div>

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 overflow-hidden">
            <h3 className="text-lg font-bold text-[#fffffe] mb-2 line-clamp-2 break-words overflow-hidden">
              {report.title}
            </h3>
            <div
              className="flex items-center gap-3 flex-wrap"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {isAdmin ? (
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${statusConfig.color}`}>
                    <StatusIcon size="xs" />
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      disabled={updatingStatus}
                      className="bg-transparent text-inherit focus:outline-none cursor-pointer"
                    >
                      {Object.entries(STATUS_CONFIG).map(([statusKey, config]) => (
                        <option key={statusKey} value={statusKey} className="text-black">
                          {config.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    disabled={updatingStatus || selectedStatus === currentStatus}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleStatusChange(selectedStatus);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#f9bc60] text-[#001e1d] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updatingStatus ? "..." : "Сохранить"}
                  </button>
                  {onDeleteReport && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDeleteReport(report.id);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#e16162] text-white hover:bg-[#d14d4e] transition-colors"
                    >
                      Удалить
                    </button>
                  )}
                </div>
              ) : (
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${statusConfig.color}`}>
                  <StatusIcon size="xs" />
                  <span>{statusConfig.label}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Описание */}
        <p className="text-sm text-[#abd1c6] leading-relaxed line-clamp-3 break-words overflow-hidden">
          {report.description}
        </p>

        {/* Изображения */}
        {report.images.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {report.images.slice(0, 3).map((img, idx) => (
              <div
                key={idx}
                className="aspect-square rounded-lg overflow-hidden border border-[#abd1c6]/20 bg-[#001e1d]/20"
              >
                <img
                  src={img.url}
                  alt={`Screenshot ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[#abd1c6]/20">
          <div className="flex items-center gap-4 text-xs text-[#abd1c6]">
            <div className="flex items-center gap-1.5">
              {report.user.avatar ? (
                <img
                  src={report.user.avatar}
                  alt={report.user.name || "User"}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#004643] to-[#001e1d] flex items-center justify-center text-[#f9bc60] text-xs font-bold">
                  {(report.user.name || report.user.email)[0].toUpperCase()}
                </div>
              )}
              <span>{report.user.name || report.user.email.split("@")[0]}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <LucideIcons.Calendar size="xs" />
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
              onClick={(e) => {
                e.stopPropagation();
                handleLike(true);
              }}
              disabled={liking}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                userLike === true
                  ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30"
                  : "bg-[#001e1d]/40 text-[#abd1c6] border border-[#abd1c6]/20 hover:border-[#10B981]/50"
              }`}
            >
              <LucideIcons.ThumbsUp size="xs" />
              <span className="text-xs font-medium">{likes}</span>
            </motion.button>
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                handleLike(false);
              }}
              disabled={liking}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                userLike === false
                  ? "bg-[#e16162]/20 text-[#e16162] border border-[#e16162]/30"
                  : "bg-[#001e1d]/40 text-[#abd1c6] border border-[#abd1c6]/20 hover:border-[#e16162]/50"
              }`}
            >
              <LucideIcons.ThumbsDown size="xs" />
              <span className="text-xs font-medium">{dislikes}</span>
            </motion.button>
          </div>
        </div>

        {/* Комментарий администратора */}
        {report.adminComment && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 p-4 bg-[#3B82F6]/10 border border-[#3B82F6]/30 rounded-lg"
          >
            <div className="flex items-start gap-2">
              <LucideIcons.MessageCircle size="xs" className="text-[#3B82F6] mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs font-medium text-[#3B82F6] mb-1">
                  Комментарий администратора:
                </div>
                <div className="text-xs text-[#abd1c6]">
                  {report.adminComment}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

