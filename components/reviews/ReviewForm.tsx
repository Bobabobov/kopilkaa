"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import type { ReviewItem } from "@/hooks/reviews/useReviews";

type Props = {
  canReview: boolean;
  approvedApplications: number;
  viewerReview: ReviewItem | null;
  submitting?: boolean;
  onSubmit: (
    content: string,
    files: File[],
    existingUrls: string[],
  ) => Promise<void> | void;
};

export function ReviewForm({
  canReview,
  approvedApplications,
  viewerReview,
  submitting = false,
  onSubmit,
}: Props) {
  const [content, setContent] = useState(viewerReview?.content ?? "");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingUrls, setExistingUrls] = useState<string[]>(
    viewerReview?.images?.map((i) => i.url) ?? [],
  );
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast, ToastComponent } = useBeautifulToast();

  const remaining = useMemo(
    () => Math.max(0, 1200 - content.length),
    [content.length],
  );

  const processFiles = (fileList: File[]) => {
    const selected = Array.from(fileList).filter((file) =>
      file.type.startsWith("image/"),
    );
    const currentTotal = existingUrls.length + files.length;
    const availableSlots = Math.max(0, 5 - currentTotal);
    const toAdd = selected.slice(0, availableSlots);

    if (toAdd.length < selected.length) {
      showToast(
        "warning",
        "Лимит фото",
        `Можно добавить только ${availableSlots} фото`,
      );
    }

    if (toAdd.length === 0) {
      if (selected.length > 0) {
        showToast("error", "Ошибка", "Выберите изображения");
      }
      return;
    }

    const newFiles = [...files, ...toAdd];
    setFiles(newFiles);
    const mapped = newFiles.map((f) => URL.createObjectURL(f));
    setPreviews(mapped);
  };

  const handleSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    processFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (canReview && totalImages < 5) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!canReview || totalImages >= 5) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleAreaClick = () => {
    if (!canReview || totalImages >= 5) return;
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveExisting = (idx: number) => {
    setExistingUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canReview) {
      showToast(
        "error",
        "Недоступно",
        "Отзывы могут оставить только пользователи с одобренной заявкой",
      );
      return;
    }
    await onSubmit(content, files, existingUrls);
  };

  useEffect(() => {
    setContent(viewerReview?.content ?? "");
    setExistingUrls(viewerReview?.images.map((i) => i.url) ?? []);
    setFiles([]);
    setPreviews([]);
  }, [viewerReview]);

  const totalImages = existingUrls.length + previews.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative max-w-6xl mx-auto"
    >
      {/* Фон с эффектами */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#001e1d]/80 via-[#001e1d]/70 to-[#0b2f2c]/70 backdrop-blur-xl border border-[#abd1c6]/20 shadow-[0_25px_60px_-20px_rgba(0,0,0,0.9)]" />
      <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#f9bc60]/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#abd1c6]/10 blur-3xl rounded-full" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 space-y-6 p-6 sm:p-8"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f9bc60]/20 to-[#f9bc60]/10 border-2 border-[#f9bc60]/40 flex items-center justify-center text-[#f9bc60] shadow-lg flex-shrink-0">
            <LucideIcons.MessageCircle size="sm" />
          </div>
          <div className="flex-1 space-y-2 min-w-0">
            <p className="text-xs uppercase tracking-[0.1em] text-[#94a1b2] font-semibold">
              Отзывы сообщества
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-[#fffffe] leading-tight">
              Поделитесь опытом участия
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-sm text-[#abd1c6]">
              <span>Один отзыв на аккаунт</span>
              <span className="text-[#94a1b2]">•</span>
              <span>Фото — до 5 штук</span>
              {approvedApplications > 0 && (
                <>
                  <span className="text-[#94a1b2]">•</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f9bc60]/15 border border-[#f9bc60]/30 text-[#f9bc60] font-semibold">
                    <LucideIcons.CheckCircle size="xs" />
                    Одобрено заявок: {approvedApplications}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {!canReview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border-2 border-[#e16162]/50 bg-gradient-to-r from-[#e16162]/20 to-[#e16162]/10 px-5 py-4 flex items-start gap-3"
          >
            <LucideIcons.AlertCircle className="w-5 h-5 text-[#e16162] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-[#fffffe] mb-1">
                Отзыв недоступен
              </p>
              <p className="text-sm text-[#ffd6cc]">
                Отзыв можно оставить после одобрения заявки.
              </p>
            </div>
          </motion.div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-[#abd1c6]">
              Текст отзыва
            </label>
            <div className="flex items-center gap-2">
              {viewerReview && (
                <span className="text-xs text-[#f9bc60] font-medium px-2 py-1 rounded-full bg-[#f9bc60]/10 border border-[#f9bc60]/20">
                  Редактирование
                </span>
              )}
              <div
                className={cn(
                  "text-xs font-medium px-2.5 py-1 rounded-full transition-colors",
                  remaining < 100
                    ? "text-[#e16162] bg-[#e16162]/10 border border-[#e16162]/20"
                    : remaining < 300
                      ? "text-[#f9bc60] bg-[#f9bc60]/10 border border-[#f9bc60]/20"
                      : "text-[#94a1b2] bg-white/5 border border-white/10",
                )}
              >
                {content.length} / 1200
              </div>
            </div>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={1200}
            rows={7}
            placeholder="Расскажите, как проходило оформление, взаимодействие с командой и что понравилось/что улучшить..."
            disabled={!canReview}
            className={cn(
              "w-full rounded-2xl border-2 px-5 py-4 text-[#fffffe] placeholder:text-[#94a1b2]/60",
              "focus:outline-none transition-all resize-none shadow-inner",
              "bg-[#001e1d]/60 backdrop-blur-sm",
              canReview
                ? "border-[#abd1c6]/40 focus:border-[#f9bc60] focus:ring-2 focus:ring-[#f9bc60]/20"
                : "border-[#abd1c6]/20 cursor-not-allowed opacity-60",
            )}
          />
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleAreaClick}
          className={cn(
            "space-y-3 rounded-xl border-2 border-dashed bg-gradient-to-br from-[#001e1d]/50 to-[#0b2f2c]/40 p-3 sm:p-4 transition-all relative overflow-hidden group",
            isDragging
              ? "border-[#f9bc60] bg-gradient-to-br from-[#f9bc60]/20 to-[#f9bc60]/10 scale-[1.02]"
              : "border-[#f9bc60]/30 hover:border-[#f9bc60]/50 hover:bg-gradient-to-br hover:from-[#001e1d]/60 hover:to-[#0b2f2c]/50",
            canReview && totalImages < 5 ? "cursor-pointer" : "cursor-default",
            !canReview && "opacity-60 cursor-not-allowed",
          )}
        >
          {/* Подсветка */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#f9bc60]/5 via-transparent to-transparent pointer-events-none group-hover:from-[#f9bc60]/10 transition-colors" />

          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f9bc60]/20 to-[#f9bc60]/10 border border-[#f9bc60]/40 flex items-center justify-center shadow-md">
                  <LucideIcons.Image className="w-4 h-4 text-[#f9bc60]" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#fffffe] block">
                    Прикрепить фотографии
                  </label>
                  <p className="text-xs text-[#abd1c6]/70">
                    {totalImages > 0 ? `${totalImages} из 5` : "До 5 фото"}
                  </p>
                </div>
              </div>
              {canReview && totalImages < 5 && (
                <label
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#f9bc60] to-[#e68b2e] hover:from-[#f9bc60] hover:to-[#f9bc60] px-3 py-1.5 text-xs font-semibold text-[#001e1d] border border-[#f9bc60] cursor-pointer hover:shadow-lg hover:shadow-[#f9bc60]/40 transition-all hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
                >
                  <LucideIcons.Plus size="xs" className="text-[#001e1d]" />
                  <span>Добавить</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleSelectFiles}
                    disabled={totalImages >= 5}
                  />
                </label>
              )}
            </div>

            <AnimatePresence mode="wait">
              {totalImages > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2"
                >
                  {existingUrls.map((url, idx) => (
                    <motion.div
                      key={`existing-${url}-${idx}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="relative overflow-hidden rounded-lg border-2 border-[#f9bc60]/40 bg-[#001e1d]/80 group hover:border-[#f9bc60] transition-all shadow-md"
                    >
                      <img
                        src={url}
                        alt={`Фото ${idx + 1}`}
                        className="w-full h-24 sm:h-28 object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <button
                        type="button"
                        onClick={() => handleRemoveExisting(idx)}
                        className="absolute top-1.5 right-1.5 inline-flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white p-1.5 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
                        aria-label="Удалить фото"
                      >
                        <LucideIcons.X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                  {previews.map((url, idx) => (
                    <motion.div
                      key={`new-${url}-${idx}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="relative overflow-hidden rounded-lg border-2 border-[#f9bc60]/40 bg-[#001e1d]/80 group hover:border-[#f9bc60] transition-all shadow-md"
                    >
                      <img
                        src={url}
                        alt={`Фото ${existingUrls.length + idx + 1}`}
                        className="w-full h-24 sm:h-28 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        className="absolute top-1.5 right-1.5 inline-flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white p-1.5 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
                        aria-label="Удалить фото"
                      >
                        <LucideIcons.X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className={cn(
                    "flex flex-col items-center justify-center py-6 px-4 text-center border-2 border-dashed rounded-lg bg-[#001e1d]/30 transition-all",
                    isDragging
                      ? "border-[#f9bc60] bg-[#f9bc60]/10"
                      : "border-[#f9bc60]/20",
                    canReview &&
                      totalImages < 5 &&
                      "hover:border-[#f9bc60]/40 hover:bg-[#001e1d]/40",
                  )}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f9bc60]/20 to-[#f9bc60]/10 border border-[#f9bc60]/40 flex items-center justify-center mb-2 shadow-md">
                    <LucideIcons.Image className="w-6 h-6 text-[#f9bc60]" />
                  </div>
                  <p className="text-xs font-medium text-[#abd1c6] mb-0.5">
                    {isDragging
                      ? "Отпустите для загрузки"
                      : "Фотографии не добавлены"}
                  </p>
                  <p className="text-[10px] text-[#94a1b2]">
                    {isDragging ? "" : "Перетащите файлы или кликните здесь"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t border-[#abd1c6]/10">
          <p className="text-xs text-[#94a1b2] leading-relaxed">
            <LucideIcons.Info className="w-3.5 h-3.5 inline mr-1.5 text-[#abd1c6]" />
            Отзывы видят все. Уважайте правила сообщества, не публикуйте
            персональные данные.
          </p>
          <button
            type="submit"
            disabled={!canReview || submitting || !content.trim()}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all shadow-lg",
              canReview && content.trim()
                ? "bg-gradient-to-r from-[#f9bc60] via-[#e68b2e] to-[#e16162] text-[#001e1d] hover:shadow-xl hover:shadow-[#f9bc60]/40 hover:-translate-y-0.5 active:translate-y-0"
                : "bg-[#001e1d]/40 text-[#5b7068] cursor-not-allowed border border-[#abd1c6]/20",
            )}
          >
            {submitting ? (
              <>
                <LucideIcons.Loader2 className="h-4 w-4 animate-spin" />
                <span>Сохранение...</span>
              </>
            ) : (
              <>
                {viewerReview ? (
                  <>
                    <LucideIcons.Save size="sm" />
                    <span>Обновить отзыв</span>
                  </>
                ) : (
                  <>
                    <LucideIcons.Send size="sm" />
                    <span>Оставить отзыв</span>
                  </>
                )}
              </>
            )}
          </button>
        </div>
      </form>

      <ToastComponent />
    </motion.div>
  );
}

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
