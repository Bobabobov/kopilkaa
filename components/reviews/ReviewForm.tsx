"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { Card } from "@/components/ui/Card";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { ReviewItem } from "@/hooks/reviews/useReviews";
import {
  REVIEW_MAX_IMAGES,
  REVIEW_MAX_TEXT_LENGTH,
  REVIEW_MIN_IMAGES,
  REVIEW_MIN_TEXT_LENGTH,
} from "@/lib/reviews/constants";
import { cn } from "@/lib/utils";

type Props = {
  canReview: boolean;
  approvedApplications: number;
  pendingReviewApplication: { id: string; title: string } | null;
  viewerReview: ReviewItem | null;
  submitting?: boolean;
  onSubmit: (
    content: string,
    files: File[],
    existingUrls: string[],
  ) => Promise<void> | void;
};

function RequirementChip({
  done,
  label,
}: {
  done: boolean;
  label: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium lg:text-sm",
        done
          ? "border-[#abd1c6]/35 bg-[#abd1c6]/10 text-[#abd1c6]"
          : "border-white/10 bg-white/[0.03] text-[#94a1b2]",
      )}
    >
      {done ? (
        <LucideIcons.CheckCircle className="h-3.5 w-3.5 shrink-0" />
      ) : (
        <LucideIcons.Circle className="h-3.5 w-3.5 shrink-0" />
      )}
      {label}
    </span>
  );
}

function ReviewCharMeter({ length }: { length: number }) {
  const min = REVIEW_MIN_TEXT_LENGTH;
  const max = REVIEW_MAX_TEXT_LENGTH;
  const fillPercent = Math.min(100, (length / max) * 100);
  const minMarkerPercent = (min / max) * 100;
  const charsLeft = Math.max(0, min - length);
  const isOk = length >= min;
  const isNearLimit = length > max * 0.85;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-xs lg:text-sm">
        <span
          className={cn(
            "font-medium",
            !isOk
              ? "text-[#f9bc60]"
              : isNearLimit
                ? "text-[#e16162]"
                : "text-[#abd1c6]",
          )}
        >
          {!isOk
            ? `Ещё ${charsLeft} ${charsLeft === 1 ? "символ" : charsLeft < 5 ? "символа" : "символов"} до минимума`
            : "Минимум достигнут"}
        </span>
        <span
          className={cn(
            "tabular-nums",
            isNearLimit ? "text-[#e16162]" : "text-[#94a1b2]",
          )}
        >
          <span className={cn(isOk && "font-semibold text-[#fffffe]")}>
            {length}
          </span>
          <span className="text-[#667a73]"> / {max}</span>
          {!isOk ? (
            <span className="ml-1.5 text-[#667a73]">(мин. {min})</span>
          ) : null}
        </span>
      </div>

      <div className="relative h-1.5 overflow-hidden rounded-full bg-black/30">
        <div
          className="pointer-events-none absolute inset-y-0 w-px bg-[#f9bc60]/70"
          style={{ left: `${minMarkerPercent}%` }}
          aria-hidden
        />
        <motion.div
          className={cn(
            "h-full rounded-full",
            !isOk
              ? "bg-[#f9bc60]/80"
              : isNearLimit
                ? "bg-[#e16162]"
                : "bg-[#abd1c6]",
          )}
          initial={false}
          animate={{ width: `${fillPercent}%` }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export function ReviewForm({
  canReview,
  approvedApplications,
  pendingReviewApplication,
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
  const { showToast } = useBeautifulToast();

  const trimmedLength = content.trim().length;

  const processFiles = (fileList: File[]) => {
    const selected = Array.from(fileList).filter((file) =>
      file.type.startsWith("image/"),
    );
    const currentTotal = existingUrls.length + files.length;
    const availableSlots = Math.max(0, REVIEW_MAX_IMAGES - currentTotal);
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
    setPreviews(newFiles.map((f) => URL.createObjectURL(f)));
  };

  const handleSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    processFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (canReview && totalImages < REVIEW_MAX_IMAGES) {
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

    if (!canReview || totalImages >= REVIEW_MAX_IMAGES) return;
    processFiles(Array.from(e.dataTransfer.files));
  };

  const handleAreaClick = () => {
    if (!canReview || totalImages >= REVIEW_MAX_IMAGES) return;
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
        "Отзывы могут оставить только пользователи с одобренной историей",
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
  const textOk =
    trimmedLength >= REVIEW_MIN_TEXT_LENGTH &&
    trimmedLength <= REVIEW_MAX_TEXT_LENGTH;
  const photosOk = totalImages >= REVIEW_MIN_IMAGES;
  const formFilled = canReview && textOk && photosOk && !submitting;

  const title = useMemo(
    () =>
      pendingReviewApplication
        ? "Оставьте отзыв о полученном гонораре"
        : "Поделитесь опытом участия",
    [pendingReviewApplication],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto w-full max-w-6xl"
    >
      <Card
        variant="darkGlass"
        padding="none"
        className="relative overflow-hidden border-[#f9bc60]/20"
      >
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#f9bc60]/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-[#abd1c6]/8 blur-3xl" />
        </div>

        <form onSubmit={handleSubmit} className="relative z-10">
          <div
            className="border-b border-white/[0.06] px-5 py-6 sm:px-8 sm:py-7"
            style={{
              background:
                "linear-gradient(180deg, rgba(249,188,96,0.08) 0%, transparent 100%)",
            }}
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#f9bc60]/35 bg-[#f9bc60]/15 text-[#f9bc60] shadow-[0_8px_24px_rgba(249,188,96,0.15)] lg:h-14 lg:w-14">
                  <LucideIcons.MessageCircle className="h-6 w-6 lg:h-7 lg:w-7" />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#94a1b2] lg:text-xs">
                    Отзывы сообщества
                  </p>
                  <h2 className="text-xl font-bold leading-tight text-[#fffffe] sm:text-2xl lg:text-[1.75rem]">
                    {title}
                  </h2>
                  <p className="max-w-2xl text-sm leading-relaxed text-[#abd1c6] lg:text-base">
                    Расскажите, как прошла модерация и на что потратили гонорар.
                    Приложите фото чека, товара или результата.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 lg:max-w-sm lg:justify-end">
                <RequirementChip
                  done={textOk}
                  label={`${REVIEW_MIN_TEXT_LENGTH}–${REVIEW_MAX_TEXT_LENGTH} символов`}
                />
                <RequirementChip
                  done={photosOk}
                  label={`${REVIEW_MIN_IMAGES}–${REVIEW_MAX_IMAGES} фото`}
                />
              </div>
            </div>

            {pendingReviewApplication ? (
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#abd1c6]/25 bg-[#001e1d]/50 px-4 py-3 lg:mt-6">
                <LucideIcons.FileText className="h-5 w-5 shrink-0 text-[#f9bc60]" />
                <p className="min-w-0 text-sm text-[#abd1c6] lg:text-base">
                  <span className="text-[#94a1b2]">История: </span>
                  <span className="font-medium text-[#fffffe]">
                    {pendingReviewApplication.title}
                  </span>
                </p>
              </div>
            ) : null}

            {approvedApplications > 0 ? (
              <p className="mt-4 text-sm text-[#94a1b2]">
                Одобрено материалов:{" "}
                <span className="font-semibold text-[#f9bc60]">
                  {approvedApplications}
                </span>
              </p>
            ) : null}

            {!canReview ? (
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#e16162]/30 bg-[#e16162]/10 px-4 py-3.5">
                <LucideIcons.AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#e16162]" />
                <div>
                  <p className="text-sm font-semibold text-[#fffffe] lg:text-base">
                    Отзыв недоступен
                  </p>
                  <p className="mt-0.5 text-sm text-[#ffd6cc]">
                    Отзыв можно оставить после одобрения истории.
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="grid gap-0 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-6 lg:p-8">
            <div className="space-y-4 border-b border-white/[0.06] p-5 sm:p-6 lg:border-b-0 lg:border-r lg:p-0 lg:pr-6">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="review-content"
                  className="text-sm font-semibold text-[#fffffe] lg:text-base"
                >
                  Текст отзыва
                </label>
                {viewerReview ? (
                  <span className="rounded-full border border-[#f9bc60]/25 bg-[#f9bc60]/10 px-2.5 py-1 text-[11px] font-medium text-[#f9bc60]">
                    Редактирование
                  </span>
                ) : null}
              </div>

              <textarea
                id="review-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={REVIEW_MAX_TEXT_LENGTH}
                rows={5}
                placeholder="Например: историю одобрили за два дня, купил на гонорар зимнюю куртку — делюсь фото и впечатлениями от платформы…"
                disabled={!canReview}
                className={cn(
                  "w-full resize-none rounded-2xl border px-4 py-3.5 text-sm leading-relaxed text-[#fffffe] placeholder:text-[#94a1b2]/55 lg:min-h-[280px] lg:px-5 lg:py-4 lg:text-base",
                  "bg-[#001e1d]/60 transition-colors focus:outline-none focus:ring-2 focus:ring-[#f9bc60]/25",
                  canReview
                    ? "border-[#abd1c6]/25 focus:border-[#f9bc60]/45"
                    : "cursor-not-allowed border-[#abd1c6]/15 opacity-60",
                )}
              />

              <ReviewCharMeter length={trimmedLength} />
            </div>

            <div className="p-5 sm:p-6 lg:p-0">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleAreaClick}
              className={cn(
                "flex h-full min-h-[220px] flex-col rounded-2xl border border-dashed p-4 transition-colors lg:min-h-[360px] lg:p-5",
                isDragging
                  ? "border-[#f9bc60] bg-[#f9bc60]/8"
                  : "border-[#abd1c6]/25 bg-[#001e1d]/30 hover:border-[#abd1c6]/40",
                canReview && totalImages < REVIEW_MAX_IMAGES
                  ? "cursor-pointer"
                  : "cursor-default",
                !canReview && "opacity-60",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#fffffe] lg:text-base">
                    Фотографии
                  </p>
                  <p className="mt-1 text-xs text-[#94a1b2] lg:text-sm">
                    {totalImages > 0
                      ? `Загружено ${totalImages} из ${REVIEW_MAX_IMAGES}`
                      : `Минимум ${REVIEW_MIN_IMAGES} фото — чек, товар или результат`}
                  </p>
                </div>
                {canReview && totalImages < REVIEW_MAX_IMAGES ? (
                  <label
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-[#f9bc60]/40 bg-[#f9bc60] px-3.5 py-2 text-xs font-semibold text-[#001e1d] transition-colors hover:bg-[#e8a545] lg:text-sm"
                  >
                    <LucideIcons.Plus className="h-3.5 w-3.5" />
                    Добавить
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleSelectFiles}
                    />
                  </label>
                ) : null}
              </div>

              <AnimatePresence mode="wait">
                {totalImages > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 flex-1 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3"
                  >
                    {existingUrls.map((url, idx) => (
                      <div
                        key={`existing-${url}-${idx}`}
                        className="group relative overflow-hidden rounded-lg border border-[#abd1c6]/20 bg-[#001e1d]/80"
                      >
                        <img
                          src={url}
                          alt={`Фото ${idx + 1}`}
                          className="h-28 w-full object-cover sm:h-32 lg:h-36"
                          loading="lazy"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveExisting(idx);
                          }}
                          className="absolute right-1.5 top-1.5 rounded-full bg-black/70 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                          aria-label="Удалить фото"
                        >
                          <LucideIcons.X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {previews.map((url, idx) => (
                      <div
                        key={`new-${url}-${idx}`}
                        className="group relative overflow-hidden rounded-lg border border-[#abd1c6]/20 bg-[#001e1d]/80"
                      >
                        <img
                          src={url}
                          alt={`Фото ${existingUrls.length + idx + 1}`}
                          className="h-28 w-full object-cover sm:h-32 lg:h-36"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile(idx);
                          }}
                          className="absolute right-1.5 top-1.5 rounded-full bg-black/70 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                          aria-label="Удалить фото"
                        >
                          <LucideIcons.X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-[#abd1c6]/15 bg-black/15 px-4 py-10 text-center lg:py-16"
                  >
                    <LucideIcons.Image className="mb-3 h-10 w-10 text-[#abd1c6]/50 lg:h-12 lg:w-12" />
                    <p className="text-sm text-[#abd1c6] lg:text-base">
                      {isDragging
                        ? "Отпустите файлы для загрузки"
                        : "Перетащите фото сюда или нажмите «Добавить»"}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            </div>
          </div>

          <div className="border-t border-white/[0.06] p-5 sm:p-6 lg:px-8 lg:py-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex cursor-help items-center gap-1.5 text-xs text-[#94a1b2] lg:text-sm">
                    <LucideIcons.Info className="h-3.5 w-3.5 text-[#abd1c6]" />
                    Правила отзывов
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  Отзывы видят все. Не публикуйте персональные данные. Без фото
                  доказательства отзыв не засчитывается для следующей истории.
                </TooltipContent>
              </Tooltip>

              <button
                type="submit"
                disabled={!formFilled}
                className={cn(
                  "inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold transition-all lg:min-h-[48px] lg:w-auto lg:min-w-[220px] lg:text-base",
                  formFilled
                    ? "bg-[#f9bc60] text-[#001e1d] hover:bg-[#e8a545]"
                    : "cursor-not-allowed border border-[#abd1c6]/15 bg-[#001e1d]/40 text-[#5b7068]",
                )}
              >
                {submitting ? (
                  <>
                    <LucideIcons.Loader2 className="h-4 w-4 animate-spin" />
                    Сохранение...
                  </>
                ) : viewerReview ? (
                  <>
                    <LucideIcons.Save className="h-4 w-4" />
                    Обновить отзыв
                  </>
                ) : (
                  <>
                    <LucideIcons.Send className="h-4 w-4" />
                    Оставить отзыв
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
