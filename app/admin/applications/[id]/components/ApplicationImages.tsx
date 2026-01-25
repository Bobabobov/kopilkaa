// app/admin/applications/[id]/components/ApplicationImages.tsx
"use client";
import { motion } from "framer-motion";

interface ApplicationImagesProps {
  images: { url: string; sort: number }[];
  onImageClick: (index: number) => void;
}

export default function ApplicationImages({
  images,
  onImageClick,
}: ApplicationImagesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="mb-6"
    >
      <h3
        className="flex items-center gap-2 text-lg sm:text-xl font-semibold mb-4"
        style={{ color: "#fffffe" }}
      >
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        Фотографии ({images.length})
      </h3>

      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {images.map((img, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-xl cursor-zoom-in aspect-square"
              onClick={() => onImageClick(i)}
            >
              <img
                src={img.url}
                alt={`Фото ${i + 1}`}
                className="w-full h-full object-cover rounded-xl border border-[#abd1c6]/20 group-hover:border-[#f9bc60] group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12" style={{ color: "#abd1c6" }}>
          <svg
            className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-base sm:text-lg font-medium">
            Фотографии не прикреплены
          </p>
          <p className="text-sm">Автор не добавил изображения к заявке</p>
        </div>
      )}
    </motion.div>
  );
}
