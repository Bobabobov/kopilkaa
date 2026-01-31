"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { StoryLightbox } from "@/components/stories/StoryLightbox";
import type { ReviewItem } from "@/hooks/reviews/useReviews";
import { ReviewHero } from "./ReviewHero";
import { ReviewContentSection } from "./ReviewContentSection";
import { ReviewImagesGrid } from "./ReviewImagesGrid";
import { ReviewSocialLinks } from "./ReviewSocialLinks";

interface ReviewDetailClientProps {
  reviewId: string;
  initialReview: ReviewItem | null;
  initialError: string | null;
}

export default function ReviewDetailClient({
  reviewId: _reviewId,
  initialReview,
  initialError,
}: ReviewDetailClientProps) {
  const router = useRouter();
  const [review, setReview] = useState<ReviewItem | null>(initialReview);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    setReview(initialReview);
  }, [initialReview]);

  const formattedDate = useMemo(() => {
    if (!review) return "";
    return new Date(review.createdAt).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }, [review]);

  if (initialError) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white/80 shadow-2xl backdrop-blur-lg">
          Отзыв не найден
        </div>
      </main>
    );
  }

  if (!review) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-10 text-[#abd1c6] sm:px-6 lg:px-10">
        <div className="flex items-center gap-2 text-sm">
          <LucideIcons.Loader2 className="h-5 w-5 animate-spin" />
          Загружаем отзыв...
        </div>
      </main>
    );
  }

  const { user } = review;

  return (
    <main className="min-h-screen overflow-x-hidden px-3 py-4 xs:px-4 sm:px-6 sm:py-6 md:py-8 lg:px-10">
      <div className="mx-auto max-w-6xl w-full space-y-3 sm:space-y-4 md:space-y-5">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white/80 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white sm:px-3 sm:py-2 sm:text-sm"
        >
          <LucideIcons.ArrowLeft size="sm" />
          <span className="hidden xs:inline">Назад к отзывам</span>
          <span className="xs:hidden">Назад</span>
        </button>

        <article className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.85)] backdrop-blur-2xl sm:rounded-3xl">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 top-10 h-40 w-40 bg-[#f9bc60]/15 blur-3xl sm:h-60 sm:w-60" />
            <div className="absolute -bottom-16 right-0 h-48 w-48 bg-[#abd1c6]/20 blur-3xl sm:h-72 sm:w-72" />
          </div>

          <ReviewHero
            review={review}
            formattedDate={formattedDate}
            onOpenLightbox={(index) => {
              setLightboxIndex(index);
              setLightboxOpen(true);
            }}
          />

          <div className="relative z-10 w-full min-w-0 space-y-4 px-3 py-4 xs:px-4 sm:px-5 sm:py-5 md:px-6 md:py-6 lg:px-8 lg:py-8 sm:space-y-5 md:space-y-6">
            <ReviewContentSection review={review} />

            <ReviewImagesGrid
              images={review.images}
              onOpenLightbox={(index) => {
                setLightboxIndex(index);
                setLightboxOpen(true);
              }}
            />

            <ReviewSocialLinks
              vkLink={user?.vkLink}
              telegramLink={user?.telegramLink}
              youtubeLink={user?.youtubeLink}
            />
          </div>
        </article>
      </div>

      {review.images && review.images.length > 0 && (
        <StoryLightbox
          isOpen={lightboxOpen}
          images={review.images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onPrevious={() => {
            setLightboxIndex((prev) =>
              prev > 0 ? prev - 1 : review.images.length - 1,
            );
          }}
          onNext={() => {
            setLightboxIndex((prev) =>
              prev < review.images.length - 1 ? prev + 1 : 0,
            );
          }}
        />
      )}
    </main>
  );
}
