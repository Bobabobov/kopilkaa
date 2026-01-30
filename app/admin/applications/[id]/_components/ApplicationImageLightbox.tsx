// app/admin/applications/[id]/components/ApplicationImageLightbox.tsx
"use client";

interface ApplicationImageLightboxProps {
  isOpen: boolean;
  images: { url: string; sort: number }[];
  currentIndex: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export default function ApplicationImageLightbox({
  isOpen,
  images,
  currentIndex,
  onClose,
  onPrevious,
  onNext,
}: ApplicationImageLightboxProps) {
  if (!isOpen || images.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
          onClick={onClose}
        >
          ✕
        </button>
        {images.length > 1 && (
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
            onClick={onPrevious}
          >
            ‹
          </button>
        )}
        {images.length > 1 && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
            onClick={onNext}
          >
            ›
          </button>
        )}
        <img
          src={images[currentIndex]?.url}
          alt=""
          className="w-full h-full object-contain select-none"
          draggable={false}
        />
        {images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 text-center text-white/80 text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
}
