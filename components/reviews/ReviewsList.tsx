"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { Card, CardContent } from "@/components/ui/Card";
import type { ReviewItem } from "@/hooks/reviews/useReviews";
import { ReviewCard } from "./ReviewCard";

type Props = {
  reviews: ReviewItem[];
  loading?: boolean;
  /** Заголовок пустого состояния (по умолчанию: «Пока нет отзывов») */
  emptyTitle?: string;
  /** Описание пустого состояния */
  emptyDescription?: string;
};

export function ReviewsList({
  reviews,
  loading = false,
  emptyTitle = "Пока нет отзывов",
  emptyDescription = "Будьте первым, кто поделится опытом участия в программе",
}: Props) {
  if (loading && !reviews.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        role="status"
        aria-live="polite"
        aria-busy="true"
        className="flex flex-col items-center justify-center py-16 gap-3"
      >
        <span className="sr-only">Загрузка отзывов…</span>
        <LucideIcons.Loader2
          className="w-10 h-10 animate-spin text-[#f9bc60]"
          aria-hidden
        />
      </motion.div>
    );
  }

  if (!loading && !reviews.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Card variant="darkGlass" padding="lg" className="text-center">
          <CardContent className="pt-2">
            <div
              className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "rgba(249, 188, 96, 0.12)" }}
            >
              <LucideIcons.MessageCircle className="w-8 h-8 text-[#f9bc60]" aria-hidden />
            </div>
            <h3 className="text-lg font-semibold text-[#fffffe]">{emptyTitle}</h3>
            <p className="text-sm text-[#abd1c6] mt-2">
              {emptyDescription}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </motion.div>
  );
}
