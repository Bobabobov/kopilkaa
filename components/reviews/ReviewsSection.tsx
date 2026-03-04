"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useReviews } from "@/hooks/reviews/useReviews";
import { ReviewForm } from "./ReviewForm";
import { ReviewsList } from "./ReviewsList";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { TelegramIcon } from "@/components/ui/icons/TelegramIcon";
import { Card, CardContent } from "@/components/ui/Card";

export function ReviewsSection() {
  const {
    loading,
    loadingMore,
    reviews,
    total,
    currentPage,
    totalPages,
    hasMore,
    submitting,
    canReview,
    approvedApplications,
    viewerReview,
    refresh,
    loadMore,
    submitReview,
    deleteReview,
    ToastComponent,
  } = useReviews();

  const heroTitle = useMemo(
    () => ({
      title: "Отзывы участников",
      subtitle: "Честные истории тех, кто оформил заявку и получил одобрение",
    }),
    [],
  );

  return (
    <div className="min-h-screen relative px-4 sm:px-6 lg:px-10 py-8 space-y-8">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#f9bc60]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#abd1c6]/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="max-w-6xl mx-auto px-1"
      >
        <Card variant="darkGlass" padding="lg" className="max-w-6xl mx-auto">
          <CardContent className="p-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-lg"
                style={{ background: "rgba(249, 188, 96, 0.15)", color: "#f9bc60" }}
              >
                <LucideIcons.MessageCircle className="w-3 h-3" />
                Опыт сообщества
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#fffffe]">
              {heroTitle.title}
            </h1>
            <p className="text-sm md:text-base text-[#abd1c6] max-w-5xl mt-1">
              {heroTitle.subtitle}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {viewerReview ? (
        <Card variant="darkGlass" padding="lg" className="max-w-6xl mx-auto">
          <CardContent className="flex items-start gap-4 p-0">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-[#001e1d] flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #f9bc60 0%, #e8a545 100%)" }}
            >
              <LucideIcons.CheckCircle size="sm" />
            </div>
            <div className="space-y-3 flex-1 min-w-0">
              <p className="text-xs uppercase tracking-[0.08em] text-[#94a1b2]">
                Отзыв уже оставлен
              </p>
              <h2 className="text-lg sm:text-xl font-semibold text-[#fffffe]">
                Спасибо за ваш отзыв
              </h2>
              <p className="text-sm text-[#abd1c6]">
                Вы можете прочитать свой отзыв в списке ниже или удалить его и
                написать новый.
              </p>
              <button
                onClick={() => {
                  if (
                    confirm(
                      "Вы уверены, что хотите удалить свой отзыв? После удаления вы сможете написать новый.",
                    )
                  ) {
                    deleteReview(viewerReview.id);
                  }
                }}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-300 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <LucideIcons.Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                    <span>Удаление...</span>
                  </>
                ) : (
                  <>
                    <LucideIcons.Trash2 size="xs" />
                    <span>Удалить отзыв</span>
                  </>
                )}
              </button>
            </div>
          </CardContent>
        </Card>
      ) : !canReview ? (
        <Card variant="darkGlass" padding="lg" className="max-w-6xl mx-auto">
          <CardContent className="flex items-start gap-4 p-0">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-[#001e1d] flex-shrink-0"
              style={{ background: "rgba(249, 188, 96, 0.25)" }}
            >
              <LucideIcons.Info size="sm" />
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.08em] text-[#94a1b2]">
                Недоступно
              </p>
              <h2 className="text-lg sm:text-xl font-semibold text-[#fffffe]">
                Отзыв можно оставить после одобрения заявки
              </h2>
              <p className="text-sm text-[#abd1c6]">
                Как только ваша заявка будет одобрена, появится возможность
                поделиться опытом.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <ReviewForm
          canReview={canReview}
          approvedApplications={approvedApplications}
          viewerReview={viewerReview}
          submitting={submitting}
          onSubmit={submitReview}
        />
      )}

      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-center justify-center gap-3 text-center">
          <span className="h-px flex-1 max-w-[120px] bg-white/10" aria-hidden />
          <div
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-semibold tracking-wide text-[#fffffe]"
            style={{ background: "rgba(249, 188, 96, 0.15)", color: "#f9bc60" }}
          >
            <LucideIcons.MessageCircle size="sm" />
            <span className="text-base sm:text-lg">Свежие отзывы</span>
            {total > 0 && (
              <span className="text-xs opacity-90">({total.toLocaleString("ru-RU")})</span>
            )}
            {loading && (
              <LucideIcons.Loader2 className="h-4 w-4 animate-spin opacity-80" />
            )}
          </div>
          <span className="h-px flex-1 max-w-[120px] bg-white/10" aria-hidden />
        </div>

        {/* Telegram канал баннер */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl border border-[#229ED9]/40 bg-gradient-to-br from-[#229ED9]/15 via-[#001e1d]/60 to-[#001e1d]/70 backdrop-blur-xl p-4 sm:p-5 shadow-[0_15px_40px_-20px_rgba(34,158,217,0.3)] hover:shadow-[0_20px_50px_-20px_rgba(34,158,217,0.4)] hover:border-[#229ED9]/60 transition-all"
        >
          {/* Подсветки */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#229ED9]/20 blur-3xl rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#f9bc60]/10 blur-2xl rounded-full" />
          </div>

          <Link
            href="https://t.me/+MVL9z_I6LOVjNmE6"
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 flex flex-col sm:flex-row items-center gap-4 group"
          >
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-[#229ED9]/50 bg-white/5 backdrop-blur-sm shadow-lg group-hover:border-[#229ED9] group-hover:shadow-xl group-hover:shadow-[#229ED9]/30 transition-all group-hover:scale-105">
                <img
                  src="/logo12.png"
                  alt="Логотип"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/logo.png";
                  }}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#229ED9] rounded-full border-2 border-[#001e1d] flex items-center justify-center shadow-lg">
                <TelegramIcon className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2 min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <TelegramIcon className="w-5 h-5 text-[#229ED9] flex-shrink-0" />
                <h4 className="text-base sm:text-lg font-semibold text-[#fffffe] group-hover:text-[#229ED9] transition-colors">
                  Больше историй в Telegram
                </h4>
              </div>
              <p className="text-sm text-[#abd1c6]/90">
                Присоединяйтесь к нашему Telegram-каналу, где собраны все отзывы
                и истории участников
              </p>
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#229ED9] font-medium group-hover:text-[#4ab8e8] transition-colors">
                <span>Перейти в канал</span>
                <LucideIcons.ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </motion.div>

        <ReviewsList reviews={reviews} loading={loading} />

        {hasMore && (
          <div className="flex justify-center pt-6">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
                color: "#001e1d",
                boxShadow: "0 8px 24px rgba(249, 188, 96, 0.25)",
              }}
            >
              {loadingMore ? (
                <>
                  <LucideIcons.Loader2 className="h-4 w-4 animate-spin" />
                  <span>Загрузка...</span>
                </>
              ) : (
                <>
                  <LucideIcons.ChevronDown size="sm" />
                  <span>Загрузить еще</span>
                </>
              )}
            </button>
          </div>
        )}

        {!loading && !hasMore && reviews.length > 0 && (
          <div className="text-center py-6">
            <p className="text-sm text-[#94a1b2]">
              Показано {reviews.length} из {total.toLocaleString("ru-RU")}{" "}
              отзывов
            </p>
          </div>
        )}
      </div>

      <ToastComponent />
    </div>
  );
}
