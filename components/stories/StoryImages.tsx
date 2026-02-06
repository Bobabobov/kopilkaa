"use client";

import { memo, useState, useCallback } from "react";
import Image from "next/image";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { StoryLightbox } from "@/components/stories/StoryLightbox";
import { buildUploadUrl, isUploadUrl, isExternalUrl } from "@/lib/uploads/url";

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

  return (
    <section className="mb-10" aria-label="Галерея изображений истории">
      <h2 className="flex items-center gap-2 text-lg sm:text-xl font-bold text-[#fffffe] mb-4 sm:mb-5">
        <LucideIcons.Image size="md" className="text-[#f9bc60]" aria-hidden />
        Изображения
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {sortedImages.map((image, index) => {
          const previewUrl = buildPreviewUrl(image.url);
          const shouldBypassOptimization =
            isUploadUrl(previewUrl) || isExternalUrl(previewUrl);
          const isFailed = failedUrls[previewUrl] || failedUrls[image.url];
          return (
            <figure
              key={`${image.url}-${index}`}
              className="relative overflow-hidden rounded-2xl border border-[#abd1c6]/25 bg-[#001e1d]/30 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.2)]"
            >
            <button
              type="button"
                className="relative w-full min-h-[180px] aspect-[4/3] sm:aspect-[3/2] flex items-center justify-center bg-[#001e1d]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f9bc60]/60"
                onClick={() => {
                  if (!isFailed) openLightbox(index);
                }}
              aria-label={`Открыть изображение ${index + 1} из ${sortedImages.length}`}
                disabled={isFailed}
            >
                {isFailed ? (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-xs text-white/70">
                    <LucideIcons.Image size="sm" />
                    Изображение недоступно
                  </div>
                ) : (
                  <Image
                    src={previewUrl}
                    alt={`${title || "История"} — изображение ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 560px"
                    className="object-contain"
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
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                <LucideIcons.ZoomIn size="xs" />
                Открыть
              </span>
            </button>
            <figcaption className="sr-only">
              Изображение {index + 1} из {sortedImages.length}
            </figcaption>
            </figure>
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
      />
    </section>
  );
}

export default memo(StoryImagesInner);
