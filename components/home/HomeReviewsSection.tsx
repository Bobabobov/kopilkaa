"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { useReviews } from "@/hooks/reviews/useReviews";
import { ReviewsList } from "@/components/reviews/ReviewsList";

const MAX_HOME_REVIEWS = 8;

export default function HomeReviewsSection() {
  const { loading, reviews, total } = useReviews();

  const visibleReviews = (reviews || []).slice(0, MAX_HOME_REVIEWS);

  return (
    <section className="pt-10 pb-24 px-4" id="home-reviews">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
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
          <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: "#abd1c6" }}>
            Реальные истории с фото и чеками — так видно, на что пошла помощь.
          </p>
        </motion.div>

        <ReviewsList
          reviews={visibleReviews}
          loading={loading}
          emptyTitle="Пока нет отзывов"
          emptyDescription="Когда появятся первые отзывы, они будут отображаться здесь"
        />

        <div className="mt-10 flex items-center justify-center">
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] border border-[#f9bc60]/45 bg-[#f9bc60]/15 text-[#f9bc60] hover:bg-[#f9bc60]/20"
          >
            <span>
              {total > 0 ? `Все отзывы (${total.toLocaleString("ru-RU")})` : "Все отзывы"}
            </span>
            <LucideIcons.ArrowRight size="sm" />
          </Link>
        </div>
      </div>
    </section>
  );
}

