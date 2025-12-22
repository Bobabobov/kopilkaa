"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import UniversalBackground from "@/components/ui/UniversalBackground";
import { BugReport } from "@/app/reports/page";

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

export default function BugReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<BugReport & { userLike: boolean | null } | null>(null);
  const [loadingReport, setLoadingReport] = useState(true);
  const [liking, setLiking] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Проверка авторизации
  useEffect(() => {
    fetch("/api/profile/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) {
          router.push("/?modal=auth");
          return;
        }
        setUser(d.user);
      })
      .catch(() => router.push("/?modal=auth"))
      .finally(() => setLoading(false));
  }, [router]);

  // Загрузка баг-репорта
  useEffect(() => {
    if (!user || !params.id) return;

    setLoadingReport(true);
    fetch(`/api/bug-reports/${params.id}`)
      .then((r) => {
        if (!r.ok) {
          if (r.status === 404) {
            router.push("/reports");
            return null;
          }
          throw new Error(`HTTP ${r.status}: ${r.statusText}`);
        }
        return r.json();
      })
      .then((d) => {
        if (d) {
          setReport(d.report);
        }
      })
      .catch((err) => {
        console.error("Load report error:", err);
        router.push("/reports");
      })
      .finally(() => setLoadingReport(false));
  }, [user, params.id, router]);

  const handleLike = async (isLike: boolean) => {
    if (liking || !report) return;

    setLiking(true);
    try {
      const response = await fetch(`/api/bug-reports/${report.id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isLike }),
      });

      if (response.ok) {
        const data = await response.json();
        setReport((prev) => {
          if (!prev) return null;
          const newUserLike = prev.userLike === isLike ? null : isLike;
          return {
            ...prev,
            likesCount: data.likes,
            dislikesCount: data.dislikes,
            userLike: newUserLike,
          };
        });
      }
    } catch (error) {
      console.error("Like error:", error);
    } finally {
      setLiking(false);
    }
  };

  if (loading || loadingReport) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <UniversalBackground />
        <div className="container-p mx-auto pt-8 pb-8 relative z-10">
          <div className="text-center">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (!user || !report) {
    return null;
  }

  const statusConfig = STATUS_CONFIG[report.status] || STATUS_CONFIG.OPEN;
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <UniversalBackground />

      {/* Декоративные элементы */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#e16162]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#f9bc60]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container-p mx-auto max-w-4xl relative z-10 px-4 pt-8 pb-12">
        {/* Кнопка назад */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#abd1c6] hover:text-[#fffffe] transition-colors mb-6"
        >
          <LucideIcons.ArrowLeft size="sm" />
          <span>Назад</span>
        </motion.button>

        {/* Карточка баг-репорта */}
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
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#fffffe]">Скриншоты</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {report.images.map((img, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      onClick={() => setSelectedImage(img.url)}
                      className="aspect-square rounded-lg overflow-hidden border border-[#abd1c6]/20 bg-[#001e1d]/20 cursor-pointer hover:border-[#f9bc60]/50 transition-all"
                    >
                      <img
                        src={img.url}
                        alt={`Screenshot ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
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
                  <span className="font-medium">{report.user.name || (report.user.email ? report.user.email.split("@")[0] : "Пользователь")}</span>
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
                  onClick={() => handleLike(true)}
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
                  onClick={() => handleLike(false)}
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
            {report.adminComment && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-5 bg-[#3B82F6]/10 border border-[#3B82F6]/30 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <LucideIcons.MessageCircle size="sm" className="text-[#3B82F6] mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-[#3B82F6] mb-2">
                      Комментарий администратора:
                    </div>
                    <div className="text-sm text-[#abd1c6] whitespace-pre-wrap break-words">
                      {report.adminComment}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Модальное окно для просмотра изображения */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-5xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-[#f9bc60] transition-colors"
            >
              <LucideIcons.X size="lg" />
            </button>
            <img
              src={selectedImage}
              alt="Screenshot"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}






