import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import type { ReviewItem } from "@/hooks/reviews/useReviews";

interface ReviewContentSectionProps {
  review: ReviewItem;
}

export function ReviewContentSection({ review }: ReviewContentSectionProps) {
  const readTime = Math.max(1, Math.ceil((review.content?.length || 0) / 200));

  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full min-w-0 rounded-xl border border-white/10 bg-[#001e1d]/60 p-3 text-white shadow-[0_15px_40px_-30px_rgba(0,0,0,0.9)] sm:p-4 sm:rounded-2xl md:p-5 lg:p-6"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2 sm:mb-4 sm:gap-3">
        <h2 className="text-base font-semibold sm:text-lg">
          Опыт участника
        </h2>
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/70 sm:px-2.5">
          <LucideIcons.Clock size="xs" className="text-[#f9bc60]" />
          {readTime} мин чтения
        </span>
      </div>
      <p className="force-wrap w-full max-w-full min-w-0 whitespace-pre-line text-sm leading-relaxed text-white/85 sm:text-base">
        {review.content}
      </p>
    </motion.section>
  );
}
