"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface PhotoUploadProps {
  photos: { file: File; url: string }[];
  onPhotosChange: (photos: { file: File; url: string }[]) => void;
  maxPhotos: number;
  delay?: number;
  error?: string;
}

export default function PhotoUpload({
  photos,
  onPhotosChange,
  maxPhotos,
  delay = 0.5,
  error,
}: PhotoUploadProps) {
  const prevUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    const prev = prevUrlsRef.current;
    const next = photos.map((p) => p.url);
    const removed = prev.filter((u) => !next.includes(u));
    removed.forEach((u) => {
      try {
        URL.revokeObjectURL(u);
      } catch {
        // ignore
      }
    });
    prevUrlsRef.current = next;
  }, [photos]);

  useEffect(() => {
    return () => {
      prevUrlsRef.current.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch {
          // ignore
        }
      });
      prevUrlsRef.current = [];
    };
  }, []);

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
    const target = photos[index];
    if (target?.url) {
      try {
        URL.revokeObjectURL(target.url);
      } catch {
        // ignore
      }
    }
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
      className={`rounded-2xl border-2 border-dashed p-6 bg-transparent transition-colors duration-300 relative ${
        error
          ? "border-[#e16162]/60 bg-[#e16162]/8"
          : "border-slate-300 dark:border-slate-600 hover:border-emerald-400 dark:hover:border-emerald-500"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <LucideIcons.Image size="sm" className="text-emerald-500" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Фотографии * <span className="text-gray-500">(до {maxPhotos})</span>
          </span>
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
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          htmlFor="photo-upload"
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-medium rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
        >
          <LucideIcons.Upload size="sm" className="inline mr-2" />
          Выбрать файлы
        </motion.label>
      </div>

      {photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative group"
            >
              <div className="aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600 bg-transparent">
                <img
                  src={photo.url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>

              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removePhoto(index)}
                  className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors duration-200"
                >
                  <LucideIcons.Trash size="xs" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <LucideIcons.Image size="lg" className="text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Перетащите фотографии сюда или нажмите "Выбрать файлы"
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
            Нужно добавить хотя бы одно фото
          </p>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 text-[#e16162] text-sm mt-2">
          <LucideIcons.Alert size="sm" />
          <span>{error}</span>
        </div>
      )}
    </motion.div>
  );
}
