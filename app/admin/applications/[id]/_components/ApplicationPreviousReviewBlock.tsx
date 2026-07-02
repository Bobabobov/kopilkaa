"use client";

import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { StoryLightbox } from "@/components/stories/StoryLightbox";
import { buildUploadUrl, isExternalUrl, isUploadUrl } from "@/lib/uploads/url";
import type { PreviousApprovedWithReview } from "../types";

interface ApplicationPreviousReviewBlockProps {
  data: PreviousApprovedWithReview | null | undefined;
  /** Показывать заголовок блока (если секция уже имеет свой заголовок — false) */
  showTitle?: boolean;
}

type ReviewImage = { url: string; sort: number };

function PreviousReviewImageGrid({
  images,
  label,
  borderColor,
  onOpen,
}: {
  images: ReviewImage[];
  label: string;
  borderColor: string;
  onOpen: (images: ReviewImage[], index: number) => void;
}) {
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});
  const sorted = useMemo(
    () => [...images].sort((a, b) => a.sort - b.sort),
    [images],
  );

  if (sorted.length === 0) return null;

  return (
    <div className="mt-3">
      <p
        className="text-xs sm:text-sm font-medium mb-2"
        style={{ color: "#abd1c6" }}
      >
        {label}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
        {sorted.map((img, idx) => {
          const previewUrl = buildUploadUrl(img.url, { variant: "thumb" });
          const shouldBypassOptimization =
            isUploadUrl(previewUrl) || isExternalUrl(previewUrl);
          const isFailed = failedUrls[previewUrl] || failedUrls[img.url];

          return (
            <button
              key={`${img.url}-${idx}`}
              type="button"
              className="group relative aspect-square overflow-hidden rounded-xl cursor-zoom-in border-2 transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f9bc60]/60"
              style={{ borderColor }}
              onClick={() => {
                if (!isFailed) onOpen(sorted, idx);
              }}
              disabled={isFailed}
              aria-label={`Открыть ${label.toLowerCase()} ${idx + 1}`}
            >
              {isFailed ? (
                <div className="flex h-full w-full items-center justify-center text-xs text-white/70">
                  Недоступно
                </div>
              ) : (
                <Image
                  src={previewUrl}
                  alt={`${label} ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 160px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized={shouldBypassOptimization}
                  onError={(e) => {
                    setFailedUrls((prev) => ({
                      ...prev,
                      [previewUrl]: true,
                      [img.url]: true,
                    }));
                    e.currentTarget.src = "/stories-preview.jpg";
                  }}
                />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ApplicationPreviousReviewBlock({
  data,
  showTitle = true,
}: ApplicationPreviousReviewBlockProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<ReviewImage[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = useCallback((images: ReviewImage[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const handlePrevious = useCallback(() => {
    setLightboxIndex((i) =>
      i === 0 ? lightboxImages.length - 1 : i - 1,
    );
  }, [lightboxImages.length]);

  const handleNext = useCallback(() => {
    setLightboxIndex((i) =>
      i === lightboxImages.length - 1 ? 0 : i + 1,
    );
  }, [lightboxImages.length]);

  if (data === undefined) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className={showTitle ? "mb-6" : ""}
      >
        {showTitle && (
          <h3
            className="flex items-center gap-2 text-lg sm:text-xl font-semibold mb-3"
            style={{ color: "#fffffe" }}
          >
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            Проверка: отзыв по прошлой заявке
          </h3>
        )}

        {!data ? (
          <div
            className="rounded-2xl p-3 sm:p-4 border min-w-0 bg-gradient-to-br from-[#004643]/80 via-[#004643]/70 to-[#001e1d]/80"
            style={{
              borderColor: "rgba(171, 209, 198, 0.4)",
              color: "#94a1b2",
            }}
          >
            <span className="text-xs sm:text-sm">
              Нет прошлой одобренной заявки (первая заявка пользователя или ещё
              не было одобрений).
            </span>
          </div>
        ) : !data.review ? (
          <div
            className="rounded-2xl p-3 sm:p-4 border min-w-0 bg-gradient-to-br from-[#f9bc60]/15 via-[#004643]/70 to-[#001e1d]/85"
            style={{
              borderColor: "rgba(249, 188, 96, 0.7)",
              color: "#f9bc60",
            }}
          >
            <p className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
              По прошлой одобренной заявке отзыв не оставлен.
            </p>
            <Link
              href={`/admin/applications/${data.id}`}
              className="text-xs underline hover:no-underline"
              style={{ color: "#abd1c6" }}
            >
              Открыть прошлую заявку: {data.title.slice(0, 50)}
              {data.title.length > 50 ? "…" : ""}
            </Link>
          </div>
        ) : (
          <div>
            <div
              className="rounded-xl p-2.5 sm:p-3 mb-2 sm:mb-3 border flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0 bg-gradient-to-r from-[#004643]/80 to-[#001e1d]/85"
              style={{
                borderColor: "rgba(171, 209, 198, 0.5)",
                color: "#abd1c6",
              }}
            >
              <Link
                href={`/admin/applications/${data.id}`}
                className="text-xs sm:text-sm font-medium underline hover:no-underline break-words min-w-0"
                style={{ color: "#f9bc60" }}
              >
                Заявка: <span className="line-clamp-2">{data.title}</span>
              </Link>
              <span className="text-xs opacity-80">
                {new Date(data.createdAt).toLocaleDateString("ru-RU", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span className="text-xs opacity-80">
                Отзыв: {new Date(data.review.createdAt).toLocaleString("ru-RU")}
              </span>
            </div>
            <div
              className="rounded-xl sm:rounded-2xl p-3 sm:p-5 lg:p-6 border mb-2 sm:mb-3 whitespace-pre-wrap break-words text-sm sm:text-[15px] lg:text-base leading-relaxed min-w-0 overflow-hidden bg-gradient-to-br from-[#f9bc60]/18 via-[#004643]/80 to-[#001e1d]/90"
              style={{
                borderColor: "rgba(249, 188, 96, 0.7)",
                color: "#f8fbfa",
              }}
            >
              {data.review.content}
            </div>

            <PreviousReviewImageGrid
              images={data.review.images}
              label="Фото отзыва"
              borderColor="rgba(249, 188, 96, 0.4)"
              onOpen={openLightbox}
            />
          </div>
        )}
      </motion.div>

      <StoryLightbox
        isOpen={lightboxOpen}
        images={lightboxImages}
        currentIndex={lightboxIndex}
        onClose={closeLightbox}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSelectIndex={setLightboxIndex}
      />
    </>
  );
}
