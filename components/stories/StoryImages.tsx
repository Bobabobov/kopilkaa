"use client";

import { memo, useState, useCallback } from "react";
import Image from "next/image";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { StoryLightbox } from "@/components/stories/StoryLightbox";
import { buildUploadUrl, isUploadUrl, isExternalUrl } from "@/lib/uploads/url";
import { cn } from "@/lib/utils";

interface StoryImage {
  url: string;
  sort: number;
}

interface StoryImagesProps {
  images?: StoryImage[];
  title?: string;
}

const buildPreviewUrl = (url: string) =>
  buildUploadUrl(url, { variant: "medium" });

function StoryImagesInner({ images = [], title }: StoryImagesProps) {
  if (!images || images.length === 0) {
    return null;
  }

  const sortedImages = [...images].sort((a, b) => a.sort - b.sort);
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});

  const openLightbox = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setIsOpen(false), []);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === 0 ? sortedImages.length - 1 : prev - 1,
    );
  }, [sortedImages.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === sortedImages.length - 1 ? 0 : prev + 1,
    );
  }, [sortedImages.length]);

  const handleSelectIndex = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  return (
    <section
      className="mb-10 w-full max-w-3xl"
      aria-label="Галерея изображений истории"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-base sm:text-lg font-bold text-[#fffffe]">
          <LucideIcons.Image size="sm" className="text-[#f9bc60]" aria-hidden />
          Фотографии
        </h2>
        <span className="text-xs font-medium text-[#abd1c6]/65">
          {sortedImages.length}
        </span>
      </div>

      <div
        className={cn(
          "grid gap-2.5 sm:gap-3",
          sortedImages.length === 1
            ? "grid-cols-1"
            : "grid-cols-2 sm:grid-cols-3",
        )}
      >
        {sortedImages.map((image, index) => {
          const previewUrl = buildPreviewUrl(image.url);
          const shouldBypassOptimization =
            isUploadUrl(previewUrl) || isExternalUrl(previewUrl);
          const isFailed = failedUrls[previewUrl] || failedUrls[image.url];

          return (
            <button
              key={`${image.url}-${index}`}
              type="button"
              className={cn(
                "group relative overflow-hidden rounded-xl border border-white/10 bg-[#001e1d]/30",
                "aspect-square focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f9bc60]/60",
                "transition-colors hover:border-[#f9bc60]/35",
              )}
              onClick={() => {
                if (!isFailed) openLightbox(index);
              }}
              aria-label={`Открыть фото ${index + 1} из ${sortedImages.length}`}
              disabled={isFailed}
            >
              {isFailed ? (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-xs text-[#abd1c6]/70">
                  <LucideIcons.Image size="sm" />
                  Недоступно
                </div>
              ) : (
                <Image
                  src={previewUrl}
                  alt={`${title || "История"} — фото ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 200px"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  unoptimized={shouldBypassOptimization}
                  onError={(e) => {
                    setFailedUrls((prev) => ({
                      ...prev,
                      [previewUrl]: true,
                      [image.url]: true,
                    }));
                    e.currentTarget.src = "/stories-preview.jpg";
                  }}
                />
              )}
              <span className="absolute inset-0 bg-[#001e1d]/0 transition-colors group-hover:bg-[#001e1d]/20" />
              <span className="absolute bottom-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                <LucideIcons.ZoomIn size="xs" />
              </span>
            </button>
          );
        })}
      </div>

      <StoryLightbox
        isOpen={isOpen}
        images={sortedImages}
        currentIndex={currentIndex}
        onClose={closeLightbox}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSelectIndex={handleSelectIndex}
      />
    </section>
  );
}

export default memo(StoryImagesInner);
