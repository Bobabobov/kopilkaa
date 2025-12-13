"use client";

import { motion } from "framer-motion";

interface AvatarGalleryProps {
  avatars: string[];
}

export function AvatarGallery({ avatars }: AvatarGalleryProps) {
  if (!avatars || avatars.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-2">
      {avatars.slice(0, 6).map((src, idx) => (
        <motion.div
          key={`${src}-${idx}`}
          className="w-9 h-9 rounded-full overflow-hidden border border-[#abd1c6]/30 bg-[#001e1d]/60"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.04 }}
          whileHover={{ scale: 1.1 }}
        >
          <img
            src={src}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => {
              // Скрываем изображение при ошибке загрузки
              e.currentTarget.style.display = "none";
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}




