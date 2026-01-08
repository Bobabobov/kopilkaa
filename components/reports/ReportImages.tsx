// Компонент для отображения изображений баг-репорта
"use client";

import { motion } from "framer-motion";

interface ReportImagesProps {
  images: { url: string; sort: number }[];
  onImageClick: (url: string) => void;
}

export default function ReportImages({
  images,
  onImageClick,
}: ReportImagesProps) {
  if (images.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#fffffe]">Скриншоты</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((img, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            onClick={() => onImageClick(img.url)}
            className="aspect-square rounded-lg overflow-hidden border border-[#abd1c6]/20 bg-[#001e1d]/20 cursor-pointer hover:border-[#f9bc60]/50 transition-all"
          >
            <img
              src={img.url}
              alt={`Screenshot ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}


