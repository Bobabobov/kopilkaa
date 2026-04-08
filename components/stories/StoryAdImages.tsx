"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { StoryLightbox } from "@/components/stories/StoryLightbox";
import { buildUploadUrl, isExternalUrl, isUploadUrl } from "@/lib/uploads/url";

type StoryImage = {
  url: string;
  sort: number;
};

interface StoryAdImagesProps {
  images?: StoryImage[];
  title?: string;
}

const buildPreviewUrl = (url: string) =>
  buildUploadUrl(url, { variant: "medium" });

function StoryAdImagesInner({ images = [], title }: StoryAdImagesProps) {
  const sortedImages = useMemo(
    () => [...images].sort((a, b) => a.sort - b.sort).filter((i) => !!i?.url),
    [images],
  );

  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});
  const [ratios, setRatios] = useState<Record<string, number>>({});

  useEffect(() => {
    if (sortedImages.length === 0) return;

    let cancelled = false;

    const load = async () => {
      const entries = await Promise.all(
        sortedImages.map(async (img) => {
          const previewUrl = buildPreviewUrl(img.url);
          const key = previewUrl;
          if (ratios[key]) return [key, ratios[key]] as const;

          // Get natural size to avoid cropping and choose a pleasant container ratio.
          // We use the preview URL to keep it lightweight.
          return await new Promise<readonly [string, number] | null>(
            (resolve) => {
              const probe = new window.Image();
              probe.onload = () => {
                const w = probe.naturalWidth || 1;
                const h = probe.naturalHeight || 1;
                resolve([key, w / h] as const);
              };
              probe.onerror = () => resolve(null);
              probe.src = previewUrl;
            },
          );
        }),
      );

      if (cancelled) return;

      setRatios((prev) => {
        const next = { ...prev };
        for (const item of entries) {
          if (!item) continue;
          const [k, r] = item;
          if (!next[k]) next[k] = r;
        }
        return next;
      });
    };

    load();

    return () => {
      cancelled = true;
    };
    // Intentionally not depending on ratios to avoid loops.
  }, [sortedImages.map((i) => i.url).join("|")]);

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

  if (sortedImages.length === 0) return null;

  return (
    <section className="mb-10" aria-label="Галерея рекламной истории">
      <div className="flex items-start justify-between gap-4 mb-4 sm:mb-5">
        <h2 className="flex items-center gap-2 text-lg sm:text-xl font-bold text-[#fffffe]">
          <LucideIcons.Image size="md" className="text-[#f9bc60]" aria-hidden />
          Галерея
        </h2>
      </div>

      <div className="space-y-5 sm:space-y-6">
        {sortedImages.map((image, index) => {
          const previewUrl = buildPreviewUrl(image.url);
          const shouldBypassOptimization =
            isUploadUrl(previewUrl) || isExternalUrl(previewUrl);
          const isFailed = failedUrls[previewUrl] || failedUrls[image.url];

          // Clamp ratio to avoid overly tall/ultra wide containers.
          const ratioRaw = ratios[previewUrl];
          const ratio =
            typeof ratioRaw === "number"
              ? Math.max(0.6, Math.min(2.2, ratioRaw))
              : 16 / 10;
          const isHero = index === 0;

          return (
            <figure
              key={`${image.url}-${index}`}
              className={[
                "relative overflow-hidden rounded-3xl border border-[#abd1c6]/20",
                "bg-gradient-to-br from-[#001e1d]/70 via-[#002724]/35 to-transparent",
                "shadow-[0_18px_55px_-30px_rgba(0,0,0,0.35)]",
              ].join(" ")}
            >
              <button
                type="button"
                onClick={() => {
                  if (!isFailed) openLightbox(index);
                }}
                disabled={isFailed}
                className={[
                  "relative w-full flex items-center justify-center",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f9bc60]/60",
                  isHero
                    ? "px-3 py-4 sm:px-6 sm:py-6"
                    : "px-3 py-4 sm:px-5 sm:py-5",
                ].join(" ")}
                aria-label={`Открыть изображение ${index + 1} из ${sortedImages.length}`}
              >
                {/* Background accents */}
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -top-24 -right-20 h-52 w-52 rounded-full bg-[#f9bc60]/10 blur-3xl" />
                  <div className="absolute -bottom-28 -left-24 h-56 w-56 rounded-full bg-[#abd1c6]/10 blur-3xl" />
                </div>

                <div
                  className={[
                    "relative w-full max-w-5xl",
                    "rounded-2xl border border-[#abd1c6]/15 bg-black/20",
                    "shadow-[0_18px_55px_-35px_rgba(0,0,0,0.5)]",
                    "overflow-hidden",
                  ].join(" ")}
                  style={{
                    // Adaptive “frame” based on real image ratio, but capped.
                    aspectRatio: `${ratio} / 1`,
                    maxHeight: isHero ? "72vh" : "62vh",
                  }}
                >
                  {isFailed ? (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-xs text-white/70">
                      <LucideIcons.Image size="sm" />
                      Изображение недоступно
                    </div>
                  ) : shouldBypassOptimization ? (
                    <img
                      src={previewUrl}
                      alt={`${title || "Рекламная история"} — изображение ${index + 1}`}
                      className="w-full h-full object-contain"
                      loading={isHero ? "eager" : "lazy"}
                      onError={() =>
                        setFailedUrls((prev) => ({
                          ...prev,
                          [previewUrl]: true,
                          [image.url]: true,
                        }))
                      }
                    />
                  ) : (
                    // Keep using <img> here too: for this page the main goal is perfect fit
                    // and natural sizing across ratios. Lightbox uses Next/Image for full.
                    <img
                      src={previewUrl}
                      alt={`${title || "Рекламная история"} — изображение ${index + 1}`}
                      className="w-full h-full object-contain"
                      loading={isHero ? "eager" : "lazy"}
                      onError={() =>
                        setFailedUrls((prev) => ({
                          ...prev,
                          [previewUrl]: true,
                          [image.url]: true,
                        }))
                      }
                    />
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#f9bc60] via-[#e8a545] to-[#f9bc60]" />
                </div>

                <span className="absolute bottom-4 right-4 inline-flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  <LucideIcons.ZoomIn size="xs" />
                  Смотреть
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

export default memo(StoryAdImagesInner);
