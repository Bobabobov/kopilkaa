"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface PhotoUploadProps {
  photos: { file: File; url: string }[];
  onPhotosChange: (photos: { file: File; url: string }[]) => void;
  maxPhotos: number;
  delay?: number;
}

export default function PhotoUpload({
  photos,
  onPhotosChange,
  maxPhotos,
  delay = 0.5,
}: PhotoUploadProps) {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const mappedFiles = files.map((f) => ({
      file: f,
      url: URL.createObjectURL(f),
    }));
    const newPhotos = [...photos, ...mappedFiles].slice(0, maxPhotos);
    onPhotosChange(newPhotos);
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const mappedFiles = files.map((f) => ({
      file: f,
      url: URL.createObjectURL(f),
    }));
    const newPhotos = [...photos, ...mappedFiles].slice(0, maxPhotos);
    onPhotosChange(newPhotos);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className="relative overflow-hidden rounded-2xl border-2 border-dashed border-[#abd1c6]/30 p-6 bg-gradient-to-br from-[#004643]/40 to-[#001e1d]/20 hover:border-[#f9bc60]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#f9bc60]/20"
    >
      {/* Декоративные элементы */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#f9bc60]/10 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-[#e16162]/10 rounded-full blur-xl"></div>
      
      <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 bg-gradient-to-br from-[#f9bc60] to-[#e8a545] rounded-xl flex items-center justify-center shadow-lg shadow-[#f9bc60]/30"
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2
            }}
          >
            <LucideIcons.Image className="text-[#001e1d]" size="sm" />
          </motion.div>
          <div>
            <span className="text-sm font-bold text-[#fffffe] block">
              Фотографии
            </span>
            <span className="text-xs text-[#abd1c6]">
              {photos.length} / {maxPhotos} загружено
            </span>
          </div>
        </div>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="photo-upload"
        />
        <motion.label
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          htmlFor="photo-upload"
          className="relative px-5 py-2.5 bg-gradient-to-r from-[#f9bc60] to-[#e8a545] hover:from-[#e8a545] hover:to-[#f9bc60] text-[#001e1d] text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-[#f9bc60]/40 overflow-hidden group"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          ></motion.div>
          <span className="relative z-10 flex items-center gap-2">
            <LucideIcons.Upload size="sm" />
            Выбрать файлы
          </span>
        </motion.label>
      </div>

      {photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="aspect-square rounded-xl overflow-hidden border-2 border-[#abd1c6]/30 bg-[#001e1d]/20 group-hover:border-[#f9bc60]/50 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:shadow-[#f9bc60]/20">
                <img
                  src={photo.url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-white text-xs font-medium bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
                    Фото {index + 1}
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.15, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removePhoto(index)}
                className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-br from-[#e16162] to-[#d14d4e] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:shadow-[#e16162]/40 transition-all duration-300 opacity-0 group-hover:opacity-100"
              >
                <LucideIcons.Trash size="xs" />
              </motion.button>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatDelay: 1
            }}
            className="inline-block mb-4"
          >
            <LucideIcons.Image size="xl" className="text-[#abd1c6]/50" />
          </motion.div>
          <p className="text-[#abd1c6] text-sm font-medium mb-2">
            Перетащите фотографии сюда
          </p>
          <p className="text-[#abd1c6]/70 text-xs">
            или нажмите "Выбрать файлы"
          </p>
        </motion.div>
      )}
      </div>
    </motion.div>
  );
}
