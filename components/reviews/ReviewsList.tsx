"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import type { ReviewItem } from "@/hooks/reviews/useReviews";
import { ReviewCard } from "./ReviewCard";

type Props = {
  reviews: ReviewItem[];
  loading?: boolean;
};

export function ReviewsList({ reviews, loading = false }: Props) {
  if (!loading && !reviews.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 sm:p-12 text-center"
      >
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#f9bc60]/20 to-[#f9bc60]/10 border border-[#f9bc60]/40 flex items-center justify-center">
            <LucideIcons.MessageCircle className="w-8 h-8 text-[#f9bc60]" />
          </div>
          <h3 className="text-lg font-semibold text-white">Пока нет отзывов</h3>
          <p className="text-sm text-white/70">
            Будьте первым, кто поделится опытом участия в программе
          </p>
        </div>
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
