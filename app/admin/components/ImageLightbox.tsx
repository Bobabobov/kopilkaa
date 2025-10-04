// app/admin/components/ImageLightbox.tsx
import { useEffect } from "react";

interface ImageLightboxProps {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export default function ImageLightbox({
  isOpen,
  images,
  currentIndex,
  onClose,
  onIndexChange
}: ImageLightboxProps) {
  useEffect(() => {
    if (!isOpen) return;
    
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onIndexChange((currentIndex - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") onIndexChange((currentIndex + 1) % images.length);
    };
    
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, currentIndex, images.length, onClose, onIndexChange]);

  if (!isOpen) return null;

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
          aria-label="Close"
          className="absolute top-2 right-2 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
          onClick={onClose}
        >
          ×
        </button>
        
        {images.length > 1 && (
          <button
            aria-label="Prev"
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
            onClick={() => onIndexChange((currentIndex - 1 + images.length) % images.length)}
          >
            ‹
          </button>
        )}
        
        {images.length > 1 && (
          <button
            aria-label="Next"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
            onClick={() => onIndexChange((currentIndex + 1) % images.length)}
          >
            ›
          </button>
        )}
        
        <img
          src={images[currentIndex]}
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

























