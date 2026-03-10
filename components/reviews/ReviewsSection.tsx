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

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.1, ease: "easeOut" },
  }),
};

export function ReviewsSection() {
  const {
    loading,
    loadingMore,
    submitting,
    canReview,
    approvedApplications,
    pendingReviewApplication,
    viewerReview,
    reviews,
    total,
    hasMore,
    loadMore,
    submitReview,
    deleteReview,
    ToastComponent,
  } = useReviews();

  const heroSubtitle = useMemo(
    () =>
      total > 0
        ? `Уже ${total.toLocaleString("ru-RU")} отзывов — чеки, фото и истории участников`
        : "Чеки, фото и истории тех, кто получил помощь",
    [total],
  );

  return (
    <div className="min-h-screen relative px-4 sm:px-6 lg:px-10 py-8 sm:py-12 space-y-12 sm:space-y-16">
      {/* Фон */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#f9bc60]/6 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#abd1c6]/6 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#004643]/20 rounded-full blur-3xl" />
      </div>

      {/* Hero */}
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto text-center"
      >
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 border"
          style={{
            background: "rgba(249, 188, 96, 0.12)",
            borderColor: "rgba(249, 188, 96, 0.35)",
            color: "#f9bc60",
          }}
        >
          <LucideIcons.MessageCircle className="w-4 h-4" />
          <span className="text-sm font-semibold uppercase tracking-wider">
            Опыт сообщества
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#fffffe] tracking-tight">
          Отзывы участников
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-[#abd1c6] max-w-2xl mx-auto leading-relaxed">
          {heroSubtitle}
        </p>
      </motion.header>

      {/* Форма обязательного отзыва */}
      {viewerReview ? (
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          custom={0}
          className="max-w-6xl mx-auto"
        >
          <Card variant="darkGlass" padding="lg" className="border-[#f9bc60]/30">
            <CardContent className="flex items-start gap-4 p-0">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-[#001e1d] flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #f9bc60 0%, #e8a545 100%)" }}
              >
                <LucideIcons.CheckCircle size="sm" />
              </div>
              <div className="space-y-3 flex-1 min-w-0">
                <p className="text-xs uppercase tracking-[0.08em] text-[#94a1b2]">
                  Отзыв оставлен
                </p>
                <h2 className="text-lg sm:text-xl font-semibold text-[#fffffe]">
                  Спасибо за отзыв
                </h2>
                <p className="text-sm text-[#abd1c6]">
                  Теперь вы можете подать новую заявку.
                </p>
                <button
                  onClick={() => {
                    if (
                      confirm(
                        "Удалить отзыв? Тогда нужно будет оставить новый, чтобы подать следующую заявку.",
                      )
                    ) {
                      deleteReview(viewerReview.id);
                    }
                  }}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-300 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold disabled:opacity-50 transition-colors"
                >
                  {submitting ? (
                    <LucideIcons.Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <LucideIcons.Trash2 size="xs" />
                  )}
                  Удалить отзыв
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : !canReview && approvedApplications > 0 ? null : !canReview ? (
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          custom={0}
          className="max-w-6xl mx-auto"
        >
          <Card variant="darkGlass" padding="lg">
            <CardContent className="flex items-start gap-4 p-0">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(249, 188, 96, 0.25)" }}
              >
                <LucideIcons.Info size="sm" />
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.08em] text-[#94a1b2]">
                  Недоступно
                </p>
                <h2 className="text-lg sm:text-xl font-semibold text-[#fffffe]">
                  Отзыв можно оставить после одобрения
                </h2>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : canReview ? (
        <ReviewForm
          canReview={canReview}
          approvedApplications={approvedApplications}
          pendingReviewApplication={pendingReviewApplication}
          viewerReview={viewerReview}
          submitting={submitting}
          onSubmit={(content, files, existingUrls) => {
            if (pendingReviewApplication) {
              submitReview(
                pendingReviewApplication.id,
                content,
                files,
                existingUrls,
              );
            }
          }}
        />
      ) : null}

      {/* ——— Секция: Отзывы ——— */}
      <motion.section
        id="reviews-new"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={1}
        className="max-w-6xl mx-auto"
      >
        <div
          className="rounded-3xl sm:rounded-[2rem] border-2 overflow-hidden"
          style={{
            background: "linear-gradient(180deg, rgba(249,188,96,0.08) 0%, rgba(0,30,29,0.4) 100%)",
            borderColor: "rgba(249, 188, 96, 0.35)",
          }}
        >
          <div className="p-6 sm:p-8 md:p-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, rgba(249,188,96,0.25) 0%, rgba(249,188,96,0.1) 100%)",
                    border: "2px solid rgba(249, 188, 96, 0.4)",
                  }}
                >
                  <LucideIcons.Gift className="w-7 h-7 text-[#f9bc60]" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#fffffe]">
                    Отзывы
                  </h2>
                  <p className="text-sm text-[#abd1c6] mt-0.5">
                    Отзывы с фото от участников
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {loading ? (
                  <LucideIcons.Loader2 className="w-5 h-5 animate-spin text-[#f9bc60]" />
                ) : (
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold"
                    style={{
                      background: "rgba(249, 188, 96, 0.2)",
                      color: "#f9bc60",
                    }}
                  >
                    {total.toLocaleString("ru-RU")}{" "}
                    {total % 10 === 1 && total % 100 !== 11
                      ? "отзыв"
                      : total % 10 >= 2 && total % 10 <= 4 && (total % 100 < 10 || total % 100 >= 20)
                        ? "отзыва"
                        : "отзывов"}
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-[#94a1b2] mb-8 max-w-2xl">
              Участники прикрепляют чеки, фото товаров или результата — так видно, на что пошла помощь.
            </p>
            <ReviewsList
              reviews={reviews}
              loading={loading}
              emptyTitle="Пока нет отзывов"
              emptyDescription="Когда появятся первые отзывы, они будут отображаться здесь"
            />
            {hasMore && (
              <div className="flex justify-center pt-8">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "rgba(249, 188, 96, 0.2)",
                    border: "2px solid rgba(249, 188, 96, 0.45)",
                    color: "#f9bc60",
                  }}
                >
                  {loadingMore ? (
                    <LucideIcons.Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LucideIcons.ChevronDown size="sm" />
                  )}
                  Ещё отзывы
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Telegram баннер */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="max-w-6xl mx-auto"
      >
        <Link
          href="https://t.me/+MVL9z_I6LOVjNmE6"
          target="_blank"
          rel="noopener noreferrer"
          className="group block relative overflow-hidden rounded-3xl border-2 border-[#229ED9]/40 bg-gradient-to-br from-[#229ED9]/12 via-[#001e1d]/70 to-[#001e1d]/80 p-6 sm:p-8 transition-all hover:border-[#229ED9]/60 hover:shadow-[0_20px_50px_-20px_rgba(34,158,217,0.25)]"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#229ED9]/15 blur-3xl rounded-full" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-[#f9bc60]/8 blur-2xl rounded-full" />
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-[#229ED9]/50 bg-white/5 group-hover:border-[#229ED9] transition-colors">
                <img
                  src="/logo12.png"
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/logo.png";
                  }}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#229ED9] rounded-full border-2 border-[#001e1d] flex items-center justify-center shadow-lg">
                <TelegramIcon className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-[#fffffe] flex items-center justify-center sm:justify-start gap-2">
                <TelegramIcon className="w-5 h-5 text-[#229ED9]" />
                Больше историй в Telegram
              </h3>
              <p className="text-sm text-[#abd1c6] mt-1">
                Присоединяйтесь к каналу — отзывы и новости проекта
              </p>
              <span className="inline-flex items-center gap-2 mt-3 text-sm text-[#229ED9] font-semibold group-hover:gap-3 transition-all">
                Перейти в канал
                <LucideIcons.ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </Link>
      </motion.section>

      <ToastComponent />
    </div>
  );
}
