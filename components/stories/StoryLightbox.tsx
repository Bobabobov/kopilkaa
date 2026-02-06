// components/stories/StoryLightbox.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { buildUploadUrl, isUploadUrl, isExternalUrl } from "@/lib/uploads/url";

interface StoryLightboxProps {
  isOpen: boolean;
  images: { url: string; sort: number }[];
  currentIndex: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function StoryLightbox({
  isOpen,
  images,
  currentIndex,
  onClose,
  onPrevious,
  onNext,
}: StoryLightboxProps) {
  const touchStartXRef = useRef<number | null>(null);
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrevious();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onPrevious, onNext]);

  useEffect(() => {
    if (!isOpen || images.length === 0) return;
    const preload = (url?: string) => {
      if (!url) return;
      const img = new window.Image();
      img.src = url;
    };
    const current = images[currentIndex]?.url
      ? buildUploadUrl(images[currentIndex].url, { variant: "full" })
      : undefined;
    const prev = images[(currentIndex - 1 + images.length) % images.length]
      ?.url
      ? buildUploadUrl(
          images[(currentIndex - 1 + images.length) % images.length].url,
          { variant: "full" },
        )
      : undefined;
    const next = images[(currentIndex + 1) % images.length]?.url
      ? buildUploadUrl(images[(currentIndex + 1) % images.length].url, {
          variant: "full",
        })
      : undefined;
    preload(current);
    preload(prev);
    preload(next);
  }, [isOpen, images, currentIndex]);

  if (!isOpen || images.length === 0) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? null;
    if (endX === null) return;
    const delta = endX - touchStartXRef.current;
    const threshold = 50;
    if (Math.abs(delta) < threshold) return;
    if (delta > 0) {
      onPrevious();
    } else {
      onNext();
    }
  };

  const fullUrl = buildUploadUrl(images[currentIndex].url, { variant: "full" });
  const shouldBypassOptimization =
    isUploadUrl(fullUrl) || isExternalUrl(fullUrl);
  const isFailed = failedUrls[fullUrl];

  const content = (
    <div
      className="fixed inset-0 z-[999] bg-black flex items-center justify-center overflow-hidden min-h-screen"
      style={{
        minHeight: "100dvh",
        paddingTop: "env(safe-area-inset-top)",
        paddingRight: "env(safe-area-inset-right)",
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft: "env(safe-area-inset-left)",
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Просмотр изображений"
    >
      <div
        className="relative w-full h-full flex items-center justify-center min-h-0"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Кнопка закрытия — всегда видна, safe area, крупный тап */}
        <button
          type="button"
          className="absolute z-[30] p-3 sm:p-3.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 shadow-lg min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
          style={{
            top: "max(0.5rem, env(safe-area-inset-top, 0px))",
            right: "max(0.5rem, env(safe-area-inset-right, 0px))",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Закрыть просмотр"
        >
          <LucideIcons.X size="lg" className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>

        {/* Навигация: кликабельные зоны по краям */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              className="absolute left-0 top-0 h-full w-1/4 sm:w-1/6 cursor-pointer z-10"
              onClick={(e) => {
                e.stopPropagation();
                onPrevious();
              }}
              aria-label="Предыдущее изображение"
            />
            <button
              type="button"
              className="absolute right-0 top-0 h-full w-1/4 sm:w-1/6 cursor-pointer z-10"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              aria-label="Следующее изображение"
            />
          </>
        )}

        {/* Изображение — родитель с явной высотой для Next/Image fill (Context7/Next.js) */}
        <div
          className="relative flex-1 min-w-0 min-h-[50vh] flex items-center justify-center px-2 py-14 sm:py-16"
          style={{
            maxHeight: "calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 4rem)",
          }}
        >
          <div className="relative w-full h-full min-h-[40vh] max-w-6xl max-h-full">
            {isFailed ? (
              <div className="flex h-full min-h-[200px] w-full flex-col items-center justify-center gap-3 text-white/80">
                <LucideIcons.Image size="lg" />
                Изображение недоступно
              </div>
            ) : (
              <Image
                src={fullUrl}
                alt={`Фото ${currentIndex + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1200px) 95vw, 1400px"
                className="object-contain pointer-events-none select-none"
                draggable={false}
                unoptimized={shouldBypassOptimization}
                onError={() =>
                  setFailedUrls((prev) => ({ ...prev, [fullUrl]: true }))
                }
              />
            )}
          </div>
        </div>

        {/* Визуальные стрелки (без клика) */}
        {images.length > 1 && (
          <>
            <div className="pointer-events-none absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/50 text-white z-10">
              <LucideIcons.ChevronLeft size="lg" />
            </div>
            <div className="pointer-events-none absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/50 text-white z-10">
              <LucideIcons.ChevronRight size="lg" />
            </div>
          </>
        )}

        {/* Счетчик изображений — с учётом safe area снизу */}
        {images.length > 1 && (
          <div
            className="absolute left-0 right-0 text-center z-10"
            style={{
              bottom: "max(0.75rem, env(safe-area-inset-bottom))",
            }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm">
              <LucideIcons.Image size="sm" />
              {currentIndex + 1} из {images.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(content, document.body);
}
