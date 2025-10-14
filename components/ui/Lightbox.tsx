// components/ui/Lightbox.tsx
"use client";
import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  images: string[];
  startIndex?: number;
  onClose: () => void;
};

export default function Lightbox({ images, startIndex = 0, onClose }: Props) {
  const [idx, setIdx] = useState(startIndex);

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[999] bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          aria-label="Close"
          className="absolute top-2 right-2 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Prev */}
        {images.length > 1 && (
          <button
            aria-label="Prev"
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
            onClick={prev}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next */}
        {images.length > 1 && (
          <button
            aria-label="Next"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
            onClick={next}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[idx]}
          alt=""
          className="w-full h-full object-contain select-none"
          draggable={false}
        />

        {/* Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 text-center text-white/80 text-sm">
            {idx + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
}
