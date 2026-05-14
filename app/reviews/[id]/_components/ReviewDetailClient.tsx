"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { Card } from "@/components/ui/Card";
import { StoryLightbox } from "@/components/stories/StoryLightbox";
import type { ReviewItem } from "@/hooks/reviews/useReviews";
import { ReviewHero } from "./ReviewHero";
import { ReviewContentSection } from "./ReviewContentSection";
import { ReviewImagesGrid } from "./ReviewImagesGrid";
import { ReviewSocialLinks } from "./ReviewSocialLinks";
import { ReviewReadingProgressBar } from "./ReviewReadingProgressBar";
import { ReviewMoreBlock } from "./ReviewMoreBlock";

interface ReviewDetailClientProps {
  initialReview: ReviewItem | null;
  initialError: string | null;
}

export default function ReviewDetailClient({
  initialReview,
  initialError,
}: ReviewDetailClientProps) {
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
      <main
        className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-10"
        id="review-detail"
      >
        <Card variant="darkGlass" padding="lg" className="max-w-md text-center">
          <div role="alert">
            <h1 className="text-xl font-semibold text-[#fffffe] mb-3">
              Не удалось открыть отзыв
            </h1>
            <p className="text-[#abd1c6]">{initialError}</p>
          </div>
        </Card>
      </main>
    );
  }

  if (!review) {
    return (
      <main
        className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-10"
        id="review-detail"
      >
        <div
          className="flex flex-col items-center gap-2 text-sm text-[#abd1c6]"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <span className="sr-only">Загрузка отзыва…</span>
          <LucideIcons.Loader2
            className="h-5 w-5 animate-spin text-[#f9bc60]"
            aria-hidden
          />
          <span aria-hidden="true">Загружаем отзыв...</span>
        </div>
      </main>
    );
  }

  const { user } = review;

  return (
    <main
      className="min-h-screen overflow-x-hidden px-3 py-4 xs:px-4 sm:px-6 sm:py-6 md:py-8 lg:px-10"
      id="review-detail"
    >
      <ReviewReadingProgressBar />
      <div className="mx-auto max-w-6xl w-full space-y-3 sm:space-y-4 md:space-y-5">
        <motion.nav
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          aria-label="Навигация"
        >
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 rounded-xl border border-[#abd1c6]/30 bg-[#001e1d]/60 px-4 py-2.5 text-sm font-semibold text-[#abd1c6] transition-all hover:border-[#f9bc60]/50 hover:bg-[#f9bc60]/15 hover:text-[#f9bc60]"
          >
            <LucideIcons.ArrowLeft size="sm" aria-hidden />
            <span className="hidden xs:inline">К списку отзывов</span>
            <span className="xs:hidden">Назад</span>
          </Link>
        </motion.nav>

        <motion.article
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl"
        >
          <Card variant="darkGlass" padding="none" className="overflow-hidden">
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden"
              aria-hidden
            >
              <div className="absolute -left-20 top-10 h-40 w-40 bg-[#f9bc60]/10 blur-3xl sm:h-60 sm:w-60" />
              <div className="absolute -bottom-16 right-0 h-48 w-48 bg-[#abd1c6]/15 blur-3xl sm:h-72 sm:w-72" />
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

              <ReviewMoreBlock />
            </div>
          </Card>
        </motion.article>
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
