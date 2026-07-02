"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { cn } from "@/lib/utils";
import {
  ACCEPTED_PHOTO_TYPES,
  UPLOAD_LIMITS,
  formatUploadMb,
  getApplicationPhotoUploadHint,
  hasAllowedPhotoType,
} from "@/hooks/applications/formState/constants";

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
  const dragCounterRef = useRef(0);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const reducedMotion = useReducedMotion();
  const displayError = error || localError;

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

  const addFiles = (incomingFiles: File[]) => {
    setLocalError(null);

    const remainingSlots = maxPhotos - photos.length;
    if (remainingSlots <= 0) {
      setLocalError(`Можно добавить не более ${maxPhotos} фото.`);
      return;
    }

    const selectedFiles = incomingFiles.slice(0, remainingSlots);
    if (incomingFiles.length > remainingSlots) {
      setLocalError(`Добавлено только ${remainingSlots} фото: лимит ${maxPhotos}.`);
    }

    const currentTotalBytes = photos.reduce((sum, item) => sum + item.file.size, 0);
    const acceptedFiles: File[] = [];
    let totalBytes = currentTotalBytes;

    for (const file of selectedFiles) {
      if (file.size === 0) {
        setLocalError("Файл пустой. Выберите другое фото.");
        continue;
      }

      if (file.size > UPLOAD_LIMITS.maxFileBytes) {
        setLocalError(
          `Файл "${file.name || "без названия"}" слишком большой. Максимум ${formatUploadMb(UPLOAD_LIMITS.maxFileBytes)} на фото.`,
        );
        continue;
      }

      if (!hasAllowedPhotoType(file)) {
        setLocalError(
          `Файл "${file.name || "без названия"}" не похож на фото. Подойдут JPG, PNG, WebP или HEIC. Если файл из Telegram, сохраните его в галерею и загрузите как фото.`,
        );
        continue;
      }

      if (totalBytes + file.size > UPLOAD_LIMITS.maxTotalBytes) {
        setLocalError(
          `Слишком большой общий размер фото. Максимум ${formatUploadMb(UPLOAD_LIMITS.maxTotalBytes)} на все фото вместе.`,
        );
        continue;
      }

      totalBytes += file.size;
      acceptedFiles.push(file);
    }

    if (!acceptedFiles.length) return;

    const mappedFiles = acceptedFiles.map((f) => ({
      file: f,
      url: URL.createObjectURL(f),
    }));
    onPhotosChange([...photos, ...mappedFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files || []));
    e.target.value = "";
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
    setLocalError(null);
    onPhotosChange(newPhotos);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounterRef.current = 0;
    setIsDraggingOver(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounterRef.current += 1;
    setIsDraggingOver(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounterRef.current = Math.max(0, dragCounterRef.current - 1);
    if (dragCounterRef.current === 0) {
      setIsDraggingOver(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    if (!isDraggingOver) setIsDraggingOver(true);
  };

  const dropZoneActive = isDraggingOver && !reducedMotion;
  const dragLiftY = isDraggingOver ? (reducedMotion ? 0 : -10) : 0;
  const dragScale = isDraggingOver ? (reducedMotion ? 1.008 : 1.03) : 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: dragLiftY,
        scale: dragScale,
      }}
      transition={
        isDraggingOver
          ? { type: "spring", stiffness: 380, damping: 24, mass: 0.85 }
          : { type: "spring", stiffness: 320, damping: 28, delay }
      }
      style={{ transformOrigin: "center center" }}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={cn(
        "rounded-2xl border-2 border-dashed p-4 sm:p-5 transition-colors duration-300 relative overflow-hidden",
        isDraggingOver && "z-20",
        isDark
          ? displayError
            ? "border-[#e16162]/60 bg-[#e16162]/8"
            : isDraggingOver
              ? "border-[#f9bc60] bg-[#f9bc60]/14 shadow-[0_0_0_1px_rgba(249,188,96,0.4),0_18px_48px_rgba(249,188,96,0.28),0_8px_24px_rgba(0,0,0,0.35)]"
              : "border-[#abd1c6]/35 bg-[#004643]/30 hover:border-[#f9bc60]/45"
          : displayError
            ? "border-[#e16162]/60 bg-[#e16162]/8"
            : isDraggingOver
              ? "border-amber-400 bg-amber-50/80 shadow-[0_18px_40px_rgba(245,158,11,0.22)] dark:border-amber-500 dark:bg-amber-950/30"
              : "border-slate-300 dark:border-slate-600 hover:border-emerald-400 dark:hover:border-emerald-500 bg-transparent",
      )}
    >
      {dropZoneActive && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl bg-[#f9bc60]/12"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.35, 0.65, 0.35] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {dropZoneActive && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-3 rounded-xl border border-[#f9bc60]/50"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: [0.98, 1.01, 0.98] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
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
          accept={ACCEPTED_PHOTO_TYPES}
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
                <div className="absolute inset-x-0 bottom-0 bg-black/55 px-2 py-1 text-[10px] text-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="block truncate">{photo.file.name}</span>
                </div>
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
        <div className="relative text-center py-6 sm:py-8 px-2">
          <motion.div
            className="mx-auto mb-2 w-fit"
            animate={
              dropZoneActive
                ? { scale: 1.16, y: -10 }
                : { scale: 1, y: 0 }
            }
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <LucideIcons.Image
              size="lg"
              className={cn(
                "mx-auto",
                isDraggingOver
                  ? isDark
                    ? "text-[#f9bc60]"
                    : "text-amber-500"
                  : isDark
                    ? "text-[#abd1c6]/50"
                    : "text-gray-400",
              )}
            />
          </motion.div>
          <motion.p
            className={cn(
              "text-sm",
              isDraggingOver
                ? isDark
                  ? "text-[#f9bc60] font-semibold"
                  : "text-amber-600 dark:text-amber-400 font-semibold"
                : isDark
                  ? "text-[#abd1c6]"
                  : "text-gray-500 dark:text-gray-400",
            )}
            animate={dropZoneActive ? { scale: [1, 1.02, 1] } : { scale: 1 }}
            transition={
              dropZoneActive
                ? { duration: 0.9, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.2 }
            }
          >
            {isDraggingOver
              ? "Отпустите, чтобы добавить фото"
              : "Перетащите сюда или нажмите «Добавить фото»"}
          </motion.p>
          {subtitle ? (
            <p
              className={`text-xs mt-2 ${isDark ? "text-[#94a1b2]" : "text-gray-500 dark:text-gray-400"}`}
            >
              {subtitle}
            </p>
          ) : (
            <p
              className={`text-xs mt-2 ${isDark ? "text-[#94a1b2]" : "text-gray-500 dark:text-gray-400"}`}
            >
              {getApplicationPhotoUploadHint(maxPhotos)}
            </p>
          )}
        </div>
      )}
      {displayError && (
        <div className="flex items-center gap-2 text-[#e16162] text-sm mt-2">
          <LucideIcons.Alert size="sm" />
          <span>{displayError}</span>
        </div>
      )}
    </motion.div>
  );
}
