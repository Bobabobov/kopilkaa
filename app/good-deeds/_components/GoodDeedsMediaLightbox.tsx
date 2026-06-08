"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { buildUploadUrl, isUploadUrl } from "@/lib/uploads/url";
import { cn } from "@/lib/utils";

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

function displaySrc(url: string, variant: "thumb" | "full") {
  if (!isUploadUrl(url)) return url;
  return buildUploadUrl(url, { variant });
}

function videoSrc(url: string) {
  return isUploadUrl(url) ? buildUploadUrl(url) : url;
}

export function GoodDeedsMediaLightbox({
  isOpen,
  media,
  currentIndex,
  onClose,
  onIndexChange,
}: Props) {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const scrollLockRef = useRef<number | null>(null);
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});
  const [imgPlainSrc, setImgPlainSrc] = useState(false);
  const [mounted, setMounted] = useState(false);

  const onCloseRef = useRef(onClose);
  const onIndexChangeRef = useRef(onIndexChange);

  useEffect(() => {
    onCloseRef.current = onClose;
    onIndexChangeRef.current = onIndexChange;
  }, [onClose, onIndexChange]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    scrollLockRef.current = scrollY;

    const prevOverflow = document.body.style.overflow;
    const prevPosition = document.body.style.position;
    const prevTop = document.body.style.top;
    const prevWidth = document.body.style.width;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    const goPrev = () => {
      onIndexChangeRef.current(
        (currentIndex - 1 + media.length) % media.length,
      );
    };
    const goNext = () => {
      onIndexChangeRef.current((currentIndex + 1) % media.length);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (media.length <= 1) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.body.style.overflow = prevOverflow;
      document.body.style.position = prevPosition;
      document.body.style.top = prevTop;
      document.body.style.width = prevWidth;

      if (scrollLockRef.current !== null) {
        window.scrollTo(0, scrollLockRef.current);
        scrollLockRef.current = null;
      }
    };
  }, [isOpen, media.length, currentIndex]);

  useEffect(() => {
    setImgPlainSrc(false);
    setFailedUrls({});
  }, [currentIndex, isOpen]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (media.length <= 1) return;
      const start = touchStartRef.current;
      const touch = e.changedTouches[0];
      touchStartRef.current = null;
      if (!start || !touch) return;

      const deltaX = touch.clientX - start.x;
      const deltaY = touch.clientY - start.y;

      if (Math.abs(deltaX) < 40 || Math.abs(deltaX) <= Math.abs(deltaY)) return;

      e.preventDefault();
      if (deltaX > 0) {
        onIndexChangeRef.current(
          (currentIndex - 1 + media.length) % media.length,
        );
      } else {
        onIndexChangeRef.current((currentIndex + 1) % media.length);
      }
    },
    [currentIndex, media.length],
  );

  if (!mounted) return null;

  const item = media[currentIndex];
  if (!isOpen || !item) return null;

  const hasMultiple = media.length > 1;
  const isVideo = item.type === "VIDEO";
  const imageFull = displaySrc(item.url, "full");
  const imageDisplay = imgPlainSrc ? item.url : imageFull;
  const isFailed = failedUrls[item.url];

  const goPrev = () =>
    onIndexChange((currentIndex - 1 + media.length) % media.length);
  const goNext = () =>
    onIndexChange((currentIndex + 1) % media.length);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="good-deeds-lightbox"
          className="fixed inset-0 z-[9999]"
          style={{
            paddingTop: "env(safe-area-inset-top)",
            paddingRight: "env(safe-area-inset-right)",
            paddingBottom: "env(safe-area-inset-bottom)",
            paddingLeft: "env(safe-area-inset-left)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр медиа"
          onClick={onClose}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="absolute inset-0 bg-[#001e1d]/94 backdrop-blur-md" />

          <button
            type="button"
            className={cn(
              "fixed z-[10002] inline-flex items-center gap-2 rounded-full",
              "bg-[#fffffe] text-[#001e1d] shadow-[0_8px_28px_rgba(0,0,0,0.45)]",
              "px-4 py-2.5 text-sm font-bold transition-transform active:scale-95",
            )}
            style={{
              top: "max(0.75rem, env(safe-area-inset-top, 0px))",
              right: "max(0.75rem, env(safe-area-inset-right, 0px))",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Закрыть просмотр"
          >
            <LucideIcons.X size="sm" />
            <span>Закрыть</span>
          </button>

          <div className="pointer-events-none relative z-[10001] flex h-full min-h-0 flex-col">
            <div
              className="pointer-events-auto shrink-0 px-4 py-3 sm:px-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3.5 py-1.5 text-sm font-medium text-[#fffffe] backdrop-blur-sm">
                {isVideo ? (
                  <LucideIcons.Play size="sm" className="text-[#f9bc60]" />
                ) : (
                  <LucideIcons.Image size="sm" className="text-[#f9bc60]" />
                )}
                {currentIndex + 1} / {media.length}
              </div>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-4">
              {hasMultiple && (
                <button
                  type="button"
                  className="pointer-events-auto absolute left-1 sm:left-3 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/50 text-[#fffffe] backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  aria-label="Предыдущее"
                >
                  <LucideIcons.ChevronLeft size="lg" />
                </button>
              )}

              <motion.div
                key={`${currentIndex}-${item.url}`}
                className="pointer-events-auto flex max-h-full w-full max-w-5xl items-center justify-center px-10 sm:px-14"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isVideo ? (
                  <video
                    key={item.url}
                    src={videoSrc(item.url)}
                    controls
                    playsInline
                    className="max-h-[calc(100dvh-11rem)] w-full max-w-full rounded-xl bg-black shadow-[0_24px_64px_-20px_rgba(0,0,0,0.65)]"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : isFailed ? (
                  <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-8 py-12 text-[#abd1c6]">
                    <LucideIcons.Image size="lg" />
                    Изображение недоступно
                  </div>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={imageDisplay}
                    alt={`Фото ${currentIndex + 1}`}
                    className="max-h-[calc(100dvh-11rem)] w-auto max-w-full rounded-xl object-contain shadow-[0_24px_64px_-20px_rgba(0,0,0,0.65)]"
                    draggable={false}
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                    }}
                    onError={() => {
                      if (!imgPlainSrc && isUploadUrl(item.url)) {
                        setImgPlainSrc(true);
                        return;
                      }
                      setFailedUrls((prev) => ({ ...prev, [item.url]: true }));
                    }}
                  />
                )}
              </motion.div>

              {hasMultiple && (
                <button
                  type="button"
                  className="pointer-events-auto absolute right-1 sm:right-3 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/50 text-[#fffffe] backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  aria-label="Следующее"
                >
                  <LucideIcons.ChevronRight size="lg" />
                </button>
              )}
            </div>

            {hasMultiple && (
              <div
                className="pointer-events-auto shrink-0 border-t border-white/[0.08] bg-black/35 px-4 py-3 sm:px-6 backdrop-blur-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mx-auto flex max-w-3xl gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
                  {media.map((entry, index) => {
                    const isActive = index === currentIndex;
                    const thumbUrl =
                      entry.type === "VIDEO"
                        ? displaySrc(entry.url, "thumb")
                        : displaySrc(entry.url, "thumb");

                    return (
                      <button
                        key={`${entry.url}-${index}`}
                        type="button"
                        onClick={() => onIndexChange(index)}
                        className={cn(
                          "relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                          isActive
                            ? "border-[#f9bc60] scale-105 shadow-[0_0_0_2px_rgba(249,188,96,0.25)]"
                            : "border-transparent opacity-70 hover:border-white/30 hover:opacity-100",
                        )}
                        aria-label={`Показать ${entry.type === "VIDEO" ? "видео" : "фото"} ${index + 1}`}
                        aria-current={isActive}
                      >
                        {entry.type === "VIDEO" ? (
                          <div className="flex h-full w-full items-center justify-center bg-[#001e1d]">
                            <LucideIcons.Play
                              size="sm"
                              className="text-[#f9bc60]"
                            />
                          </div>
                        ) : (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={thumbUrl}
                            alt=""
                            className="h-full w-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              type="button"
              className="pointer-events-auto mx-4 mb-4 mt-2 shrink-0 rounded-xl border border-white/15 bg-[#f9bc60] py-3.5 text-sm font-bold text-[#001e1d] sm:hidden"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              Закрыть просмотр
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
