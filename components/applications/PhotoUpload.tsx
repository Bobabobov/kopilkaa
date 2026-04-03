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
  /** Уникальный id для input/label, чтобы несколько блоков не конфликтовали */
  inputId?: string;
  /** Тёмная тема под карточку заявки */
  variant?: "default" | "dark";
  /** Короткий заголовок блока */
  title?: string;
  /** Подзаголовок под кнопкой */
  subtitle?: string;
}

export default function PhotoUpload({
  photos,
  onPhotosChange,
  maxPhotos,
  delay = 0.5,
  error,
  inputId = "photo-upload",
  variant = "default",
  title,
  subtitle,
}: PhotoUploadProps) {
  const isDark = variant === "dark";
  const heading =
    title ??
    (isDark ? "Фотографии" : `Фотографии * (до ${maxPhotos})`);
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
      className={`rounded-2xl border-2 border-dashed p-4 sm:p-5 transition-colors duration-300 relative ${
        isDark
          ? error
            ? "border-[#e16162]/60 bg-[#e16162]/8"
            : "border-[#abd1c6]/35 bg-[#004643]/30 hover:border-[#f9bc60]/45"
          : error
            ? "border-[#e16162]/60 bg-[#e16162]/8"
            : "border-slate-300 dark:border-slate-600 hover:border-emerald-400 dark:hover:border-emerald-500 bg-transparent"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <LucideIcons.Image
            size="sm"
            className={isDark ? "text-[#f9bc60] shrink-0" : "text-emerald-500 shrink-0"}
          />
          <span
            className={`text-sm font-semibold truncate ${
              isDark ? "text-[#fffffe]" : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {heading}
            {!title && !isDark && (
              <span className="text-gray-500 font-normal"> (до {maxPhotos})</span>
            )}
            {isDark && title && (
              <span className="text-[#abd1c6] font-normal"> · до {maxPhotos}</span>
            )}
          </span>
        </div>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id={inputId}
        />
        <motion.label
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          htmlFor={inputId}
          className={`inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 text-sm font-semibold rounded-xl cursor-pointer transition-all shrink-0 ${
            isDark
              ? "text-[#001e1d] shadow-[0_6px_20px_rgba(249,188,96,0.2)]"
              : "bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 shadow-lg hover:shadow-xl"
          }`}
          style={
            isDark
              ? {
                  background:
                    "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
                }
              : undefined
          }
        >
          <LucideIcons.Upload size="sm" className="shrink-0" />
          Добавить фото
        </motion.label>
      </div>

      {photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {photos.map((photo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative group"
            >
              <div
                className={`aspect-square rounded-xl overflow-hidden bg-transparent ${
                  isDark
                    ? "border border-[#abd1c6]/25"
                    : "border border-slate-200 dark:border-slate-600"
                }`}
              >
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
        <div className="text-center py-6 sm:py-8 px-2">
          <LucideIcons.Image
            size="lg"
            className={`mx-auto mb-2 ${isDark ? "text-[#abd1c6]/50" : "text-gray-400"}`}
          />
          <p
            className={`text-sm ${isDark ? "text-[#abd1c6]" : "text-gray-500 dark:text-gray-400"}`}
          >
            Перетащите сюда или нажмите «Добавить фото»
          </p>
          {subtitle && (
            <p className={`text-xs mt-2 ${isDark ? "text-[#94a1b2]" : "text-gray-500 dark:text-gray-400"}`}>
              {subtitle}
            </p>
          )}
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
