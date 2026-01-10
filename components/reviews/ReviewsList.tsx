"use client";

import { motion } from "framer-motion";
import type { ReviewItem } from "@/hooks/reviews/useReviews";
import { ReviewCard } from "./ReviewCard";

type Props = {
  reviews: ReviewItem[];
};

export function ReviewsList({ reviews }: Props) {
  if (!reviews.length) {
    return (
      <div className="rounded-2xl border border-[#abd1c6]/30 bg-transparent text-center text-[#4f615a] py-4 px-3">
        Пока нет отзывов. Будьте первым, кто поделится опытом.
      </div>
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
