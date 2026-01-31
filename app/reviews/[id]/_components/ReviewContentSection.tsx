import type { ReviewItem } from "@/hooks/reviews/useReviews";

interface ReviewContentSectionProps {
  review: ReviewItem;
}

export function ReviewContentSection({ review }: ReviewContentSectionProps) {
  return (
    <section className="w-full min-w-0 rounded-xl border border-white/10 bg-[#001e1d]/60 p-3 text-white shadow-[0_15px_40px_-30px_rgba(0,0,0,0.9)] sm:p-4 sm:rounded-2xl md:p-5 lg:p-6">
      <h2 className="mb-2 text-base font-semibold sm:mb-3 sm:text-lg">
        Опыт участника
      </h2>
      <p className="force-wrap w-full max-w-full min-w-0 whitespace-pre-line text-sm leading-relaxed text-white/85 sm:text-base">
        {review.content}
      </p>
    </section>
  );
}
