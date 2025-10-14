// components/stories/StoryLightbox.tsx
"use client";
import { LucideIcons } from "@/components/ui/LucideIcons";

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
  if (!isOpen || images.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-6xl w-full h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Кнопка закрытия */}
        <button
          className="absolute top-4 right-4 p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm z-10 transition-colors"
          onClick={onClose}
        >
          <LucideIcons.Close size="lg" />
        </button>

        {/* Кнопки навигации */}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm z-10 transition-colors"
              onClick={onPrevious}
            >
              <LucideIcons.ChevronLeft size="lg" />
            </button>

            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm z-10 transition-colors"
              onClick={onNext}
            >
              <LucideIcons.ChevronRight size="lg" />
            </button>
          </>
        )}

        {/* Изображение */}
        <img
          src={images[currentIndex].url}
          alt={`Фото ${currentIndex + 1}`}
          className="w-full h-full object-contain rounded-xl"
          draggable={false}
        />

        {/* Счетчик изображений */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl text-white text-sm">
              <LucideIcons.Image size="sm" />
              {currentIndex + 1} из {images.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
