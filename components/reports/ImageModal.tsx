// Модальное окно для просмотра изображения
"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface ImageModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

export default function ImageModal({ imageUrl, onClose }: ImageModalProps) {
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative max-w-5xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-[#f9bc60] transition-colors"
        >
          <LucideIcons.X size="lg" />
        </button>
        <img
          src={imageUrl}
          alt="Screenshot"
          className="max-w-full max-h-[90vh] object-contain rounded-lg"
        />
      </motion.div>
    </div>
  );
}
