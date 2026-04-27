"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { buildUploadUrl, isUploadUrl, isExternalUrl } from "@/lib/uploads/url";

export type LightboxMediaItem = {
  url: string;
  type: "IMAGE" | "VIDEO";
};

type Props = {
  isOpen: boolean;
  media: LightboxMediaItem[];
  currentIndex: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

function displaySrc(url: string, variant: "medium" | "full") {
  if (!isUploadUrl(url)) return url;
  return buildUploadUrl(url, { variant });
}

export function GoodDeedsMediaLightbox({
  isOpen,
  media,
  currentIndex,
  onClose,
  onIndexChange,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [imgFailed, setImgFailed] = useState<Record<string, boolean>>({});
  const [imgPlainSrc, setImgPlainSrc] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setImgFailed({});
      return;
    }

    const scrollY = window.scrollY || 0;
    const prevOverflow = document.body.style.overflow;
    const prevPosition = document.body.style.position;
    const prevTop = document.body.style.top;
    const prevWidth = document.body.style.width;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.position = prevPosition;
      document.body.style.top = prevTop;
      document.body.style.width = prevWidth;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (media.length <= 1) return;
      if (e.key === "ArrowLeft") {
        onIndexChange((currentIndex - 1 + media.length) % media.length);
      }
      if (e.key === "ArrowRight") {
        onIndexChange((currentIndex + 1) % media.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, media.length, currentIndex, onClose, onIndexChange]);

  useEffect(() => {
    setImgFailed({});
    setImgPlainSrc(false);
  }, [currentIndex]);

  if (!mounted || !isOpen || media.length === 0) return null;

  const item = media[currentIndex];
  if (!item) return null;

  const imageFull = displaySrc(item.url, "full");
  const imageDisplay = imgPlainSrc ? item.url : imageFull;
  const bypassImg =
    isUploadUrl(imageDisplay) || isExternalUrl(imageDisplay);
  const failed = imgFailed[item.url];

  const goPrev = () =>
    onIndexChange((currentIndex - 1 + media.length) % media.length);
  const goNext = () =>
    onIndexChange((currentIndex + 1) % media.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || media.length <= 1) return;
    const endX = e.changedTouches[0]?.clientX ?? null;
    if (endX === null) return;
    const delta = endX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (Math.abs(delta) < 50) return;
    if (delta > 0) goPrev();
    else goNext();
  };

  const content = (
    <div
      className="fixed inset-0 z-[9500] flex flex-col bg-black"
      style={{
        minHeight: "100dvh",
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Просмотр медиа"
    >
      <div
        className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-2"
        onClick={onClose}
      >
        <button
          type="button"
          className="absolute z-[9600] flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/25 bg-black/70 p-3 text-white shadow-lg transition hover:bg-black/90"
          style={{
            top: "max(0.75rem, env(safe-area-inset-top))",
            right: "max(0.75rem, env(safe-area-inset-right))",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Закрыть"
        >
          <LucideIcons.X className="h-6 w-6" />
        </button>

        <div
          className="flex h-full max-h-[calc(100dvh-5rem)] w-full max-w-6xl flex-col items-center justify-center"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {media.length > 1 && (
            <>
              <button
                type="button"
                className="absolute left-0 top-0 z-20 h-full w-1/5 cursor-pointer sm:w-1/6"
                onClick={goPrev}
                aria-label="Предыдущее"
              />
              <button
                type="button"
                className="absolute right-0 top-0 z-20 h-full w-1/5 cursor-pointer sm:w-1/6"
                onClick={goNext}
                aria-label="Следующее"
              />
            </>
          )}

          <div className="relative flex max-h-full w-full flex-1 items-center justify-center py-14 sm:py-16">
            {item.type === "VIDEO" ? (
              <video
                key={item.url}
                src={item.url}
                controls
                playsInline
                className="max-h-[min(85dvh,900px)] w-full max-w-6xl rounded-lg bg-black"
              />
            ) : failed ? (
              <div className="flex flex-col items-center gap-2 text-white/75">
                <LucideIcons.Image className="h-10 w-10" />
                <span>Не удалось загрузить изображение</span>
              </div>
            ) : (
              <div className="relative h-[min(85dvh,900px)] w-full">
                <Image
                  src={imageDisplay}
                  alt={`Фото ${currentIndex + 1}`}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  unoptimized={bypassImg}
                  draggable={false}
                  onError={() => {
                    if (!imgPlainSrc && isUploadUrl(item.url)) {
                      setImgPlainSrc(true);
                      return;
                    }
                    setImgFailed((p) => ({ ...p, [item.url]: true }));
                  }}
                />
              </div>
            )}
          </div>

          {media.length > 1 && (
            <>
              <div className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/55 p-2 text-white sm:left-6">
                <LucideIcons.ChevronLeft className="h-6 w-6" />
              </div>
              <div className="pointer-events-none absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/55 p-2 text-white sm:right-6">
                <LucideIcons.ChevronRight className="h-6 w-6" />
              </div>
            </>
          )}
        </div>

        <div
          className="absolute left-0 right-0 z-30 flex justify-center"
          style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-sm text-white backdrop-blur-sm">
            {item.type === "VIDEO" ? (
              <LucideIcons.Play className="h-4 w-4 shrink-0" size="sm" />
            ) : (
              <LucideIcons.Image className="h-4 w-4 shrink-0" size="sm" />
            )}
            <span>
              {currentIndex + 1} / {media.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
