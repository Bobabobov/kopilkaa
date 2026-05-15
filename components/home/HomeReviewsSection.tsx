"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { useReviews } from "@/hooks/reviews/useReviews";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { HomeSectionLayout } from "@/components/home/HomeSectionLayout";

const MAX_HOME_REVIEWS = 3;

export default function HomeReviewsSection() {
  const { loading, reviews, total } = useReviews({ limit: MAX_HOME_REVIEWS });

  const visibleReviews = (reviews || []).slice(0, MAX_HOME_REVIEWS);

  return (
    <section className="pt-10 pb-24 px-4" id="home-reviews">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <span
            className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider mb-4"
            style={{ color: "#f9bc60", letterSpacing: "0.12em" }}
          >
            <LucideIcons.MessageCircle size="sm" />
            Отзывы
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold mb-3 tracking-tight"
            style={{ color: "#fffffe" }}
          >
            Что говорят участники
          </h2>
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto"
            style={{ color: "#abd1c6" }}
          >
            Отзывы участников с фото и подтверждениями — чтобы было понятно, как
            именно помогла платформа.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90">
              <LucideIcons.Sparkles size="sm" className="text-[#f9bc60]" />
              {loading
                ? "Загружаем отзывы..."
                : total > 0
                  ? `${total.toLocaleString("ru-RU")} отзывов`
                  : "Пока без отзывов"}
            </span>
          </div>
        </motion.div>

        {loading ? (
          <HomeSectionLayout ariaLabel="Загрузка отзывов">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 rounded-2xl border border-white/10 bg-white/5 animate-pulse"
              />
            ))}
          </HomeSectionLayout>
        ) : visibleReviews.length === 0 ? (
          <div className="text-center py-10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-white/10 items-center justify-center mb-4 border border-white/10">
              <LucideIcons.MessageCircle size="lg" className="text-[#f9bc60]" />
            </div>
            <p className="text-[#fffffe] font-semibold mb-1">
              Пока нет отзывов
            </p>
            <p className="text-sm text-[#abd1c6]">
              Когда появятся первые отзывы, они будут отображаться здесь.
            </p>
          </div>
        ) : (
          <HomeSectionLayout ariaLabel="Отзывы участников">
            {visibleReviews.map((review) => (
              <div key={review.id} className="h-full">
                <ReviewCard review={review} />
              </div>
            ))}
          </HomeSectionLayout>
        )}

        <div className="mt-10 flex items-center justify-center">
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all md:hover:scale-[1.02] active:scale-[0.98] border border-white/10 bg-white/5 text-[#fffffe] hover:bg-white/10 hover:border-[#f9bc60]/30"
          >
            <span>
              {total > 0
                ? `Все отзывы (${total.toLocaleString("ru-RU")})`
                : "Все отзывы"}
            </span>
            <LucideIcons.ArrowRight size="sm" />
          </Link>
        </div>
      </div>
    </section>
  );
}
