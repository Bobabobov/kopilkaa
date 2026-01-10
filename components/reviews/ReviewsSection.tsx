"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useReviews } from "@/hooks/reviews/useReviews";
import { ReviewForm } from "./ReviewForm";
import { ReviewsList } from "./ReviewsList";
import { LucideIcons } from "@/components/ui/LucideIcons";

export function ReviewsSection() {
  const {
    loading,
    reviews,
    canReview,
    approvedApplications,
    viewerReview,
    refresh,
    submitReview,
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
    <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="max-w-6xl mx-auto flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-1"
      >
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.08em] text-[#94a1b2]">Опыт сообщества</p>
          <h1 className="text-2xl md:text-3xl font-bold text-[#fffffe]">{heroTitle.title}</h1>
          <p className="text-sm md:text-base text-[#abd1c6] max-w-5xl">{heroTitle.subtitle}</p>
        </div>
        <button
          onClick={refresh}
          className="inline-flex items-center gap-2 rounded-xl border border-[#abd1c6]/40 bg-[#004643]/60 text-[#fffffe] px-4 py-2.5 text-sm font-semibold hover:border-[#f9bc60]/70 transition-all self-start md:self-center"
        >
          <LucideIcons.RefreshCw size="xs" />
          Обновить
        </button>
      </motion.div>

      {viewerReview ? (
        <div className="max-w-6xl mx-auto rounded-3xl border border-white/10 bg-white/6 backdrop-blur-xl p-5 sm:p-6 text-white shadow-[0_20px_50px_-28px_rgba(0,0,0,0.55)]">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#f9bc60] to-[#e16162] flex items-center justify-center text-white shadow-lg">
              <LucideIcons.CheckCircle size="sm" />
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.08em] text-white/70">Отзыв уже оставлен</p>
              <h2 className="text-lg sm:text-xl font-semibold text-white">Спасибо за ваш отзыв</h2>
              <p className="text-sm text-white/80">
                Вы можете прочитать свой отзыв в списке ниже. Повторная отправка не требуется.
              </p>
            </div>
          </div>
        </div>
      ) : !canReview ? (
        <div className="max-w-6xl mx-auto rounded-3xl border border-white/10 bg-white/6 backdrop-blur-xl p-5 sm:p-6 text-white shadow-[0_20px_50px_-28px_rgba(0,0,0,0.55)]">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#f9bc60] to-[#e16162] flex items-center justify-center text-white shadow-lg">
              <LucideIcons.Info size="sm" />
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.08em] text-white/70">Недоступно</p>
              <h2 className="text-lg sm:text-xl font-semibold text-white">Отзыв можно оставить после одобрения заявки</h2>
              <p className="text-sm text-white/80">
                Как только ваша заявка будет одобрена, появится возможность поделиться опытом.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <ReviewForm
          canReview={canReview}
          approvedApplications={approvedApplications}
          viewerReview={viewerReview}
          onSubmit={submitReview}
        />
      )}

      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-center justify-center gap-3 text-center">
          <span className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-white/5 border border-white/10 text-white/90 shadow-[0_12px_30px_-24px_rgba(0,0,0,0.8)]">
            <LucideIcons.MessageCircle size="sm" className="text-[#f9bc60]" />
            <h3 className="text-base sm:text-lg font-semibold tracking-wide">Свежие отзывы</h3>
            {loading && (
              <LucideIcons.Loader2 className="h-4 w-4 animate-spin text-white/70" />
            )}
          </div>
          <span className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>

        <ReviewsList reviews={reviews} />
      </div>

      <ToastComponent />
    </div>
  );
}
