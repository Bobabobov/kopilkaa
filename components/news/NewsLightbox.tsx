"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

export function NewsLightbox({
  isOpen,
  images,
  currentIndex,
  onClose,
  onIndexChange,
}: {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Блокировка скролла
  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY || 0;
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyPosition = document.body.style.position;
    const prevBodyTop = document.body.style.top;
    const prevBodyWidth = document.body.style.width;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.documentElement.style.overflow = "hidden";

    const preventScroll = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    document.addEventListener("wheel", preventScroll, { passive: false });
    document.addEventListener("touchmove", preventScroll, { passive: false });
    document.addEventListener("scroll", preventScroll, { passive: false });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        onIndexChange((currentIndex - 1 + images.length) % images.length);
      } else if (e.key === "ArrowRight") {
        onIndexChange((currentIndex + 1) % images.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);

      document.removeEventListener("wheel", preventScroll);
      document.removeEventListener("touchmove", preventScroll);
      document.removeEventListener("scroll", preventScroll);

      document.body.style.overflow = prevBodyOverflow;
      document.body.style.position = prevBodyPosition;
      document.body.style.top = prevBodyTop;
      document.body.style.width = prevBodyWidth;
      document.documentElement.style.overflow = prevHtmlOverflow;

      window.scrollTo(0, scrollY);
    };
  }, [isOpen, currentIndex, images.length, onClose, onIndexChange]);

  if (!mounted || !isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const hasMany = images.length > 1;

  const handlePrevious = () => {
    onIndexChange((currentIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    onIndexChange((currentIndex + 1) % images.length);
  };

  const lightboxContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/95"
          style={{ zIndex: 9999 }}
          onClick={onClose}
        >
          {/* Кнопка закрытия - позиционируется относительно viewport */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="fixed top-4 right-4 w-14 h-14 bg-black/90 hover:bg-black border-2 border-white/40 hover:border-white/60 rounded-full flex items-center justify-center text-white transition-all duration-200 shadow-2xl z-50"
            style={{ zIndex: 10000 }}
            aria-label="Закрыть"
            title="Закрыть (Esc)"
          >
            <LucideIcons.X size="lg" />
          </button>

          {/* Центральный контейнер с изображением */}
          <div className="fixed inset-0 flex items-center justify-center">
            <div
              className="relative flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "95vw", maxHeight: "90vh" }}
            >
              {/* Изображение */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentImage}
                alt={`Изображение ${currentIndex + 1} из ${images.length}`}
                className="max-w-full max-h-full object-contain select-none"
                draggable={false}
                style={{
                  maxWidth: "95vw",
                  maxHeight: "90vh",
                  width: "auto",
                  height: "auto",
                }}
              />
            </div>
          </div>

          {/* Кнопка "Предыдущее" - фиксированная позиция */}
          {hasMany && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              className="fixed left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/80 hover:bg-black/90 border border-white/30 hover:border-white/50 rounded-full flex items-center justify-center text-white transition-all duration-200 shadow-xl z-40"
              style={{ zIndex: 10000 }}
              aria-label="Предыдущее фото"
              title="Предыдущее (←)"
            >
              <LucideIcons.ChevronLeft size="lg" />
            </button>
          )}

          {/* Кнопка "Следующее" - фиксированная позиция */}
          {hasMany && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="fixed right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/80 hover:bg-black/90 border border-white/30 hover:border-white/50 rounded-full flex items-center justify-center text-white transition-all duration-200 shadow-xl z-40"
              style={{ zIndex: 10000 }}
              aria-label="Следующее фото"
              title="Следующее (→)"
            >
              <LucideIcons.ChevronRight size="lg" />
            </button>
          )}

          {/* Счётчик - позиционируется относительно viewport */}
          {hasMany && (
            <div
              className="fixed bottom-4 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-black/80 rounded-full text-white text-sm font-semibold backdrop-blur-sm border border-white/30 shadow-xl z-40"
              onClick={(e) => e.stopPropagation()}
              style={{ zIndex: 10000 }}
            >
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(lightboxContent, document.body);
}
