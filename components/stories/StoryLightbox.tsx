// components/stories/StoryLightbox.tsx
"use client";
import { useEffect, useRef, useState } from "react";
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

  return (
    <div
      className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-md flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Просмотр изображений"
    >
      <div
        className="relative w-full h-full flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Кнопка закрытия */}
        <button
          className="absolute top-3 right-3 sm:top-5 sm:right-5 p-2.5 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm z-20 transition-colors"
          onClick={onClose}
          aria-label="Закрыть просмотр"
        >
          <LucideIcons.Close size="lg" />
        </button>

        {/* Навигация: кликабельные зоны по краям */}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-0 top-0 h-full w-1/4 sm:w-1/6 cursor-pointer z-10"
              onClick={(e) => {
                e.stopPropagation();
                onPrevious();
              }}
              aria-label="Предыдущее изображение"
            />
            <button
              className="absolute right-0 top-0 h-full w-1/4 sm:w-1/6 cursor-pointer z-10"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              aria-label="Следующее изображение"
            />
          </>
        )}

        {/* Изображение */}
        <div className="relative w-[94vw] h-[86vh] max-w-6xl max-h-[90vh]">
          {isFailed ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-white/80">
              <LucideIcons.ImageOff size="lg" />
              Изображение недоступно
            </div>
          ) : (
            <Image
              src={fullUrl}
              alt={`Фото ${currentIndex + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1200px) 95vw, 1400px"
              className="object-contain"
              draggable={false}
              unoptimized={shouldBypassOptimization}
              onError={() =>
                setFailedUrls((prev) => ({ ...prev, [fullUrl]: true }))
              }
            />
          )}
        </div>

        {/* Визуальные стрелки (без клика) */}
        {images.length > 1 && (
          <>
            <div className="pointer-events-none absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-white/10 text-white backdrop-blur-sm z-10">
              <LucideIcons.ChevronLeft size="lg" />
            </div>
            <div className="pointer-events-none absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-white/10 text-white backdrop-blur-sm z-10">
              <LucideIcons.ChevronRight size="lg" />
            </div>
          </>
        )}

        {/* Счетчик изображений */}
        {images.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-5 left-0 right-0 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm">
              <LucideIcons.Image size="sm" />
              {currentIndex + 1} из {images.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
