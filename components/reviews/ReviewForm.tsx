"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import type { ReviewItem } from "@/hooks/reviews/useReviews";

type Props = {
  canReview: boolean;
  approvedApplications: number;
  viewerReview: ReviewItem | null;
  submitting?: boolean;
  onSubmit: (content: string, files: File[], existingUrls: string[]) => Promise<void> | void;
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
  const [existingUrls, setExistingUrls] = useState<string[]>(viewerReview?.images.map((i) => i.url) ?? []);
  const { showToast, ToastComponent } = useBeautifulToast();

  const remaining = useMemo(() => Math.max(0, 1200 - content.length), [content.length]);

  const handleSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const total = [...files, ...selected].slice(0, 5);
    setFiles(total);
    const mapped = total.map((f) => URL.createObjectURL(f));
    setPreviews(mapped);
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
      showToast("error", "Недоступно", "Отзывы могут оставить только пользователи с одобренной заявкой");
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="relative max-w-6xl mx-auto"
    >
      <div className="absolute inset-0 rounded-3xl bg-[#001e1d]/70 backdrop-blur-md border border-[#abd1c6]/30 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.8)]" />
      <form onSubmit={handleSubmit} className="relative z-10 space-y-5 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#fef4e0]/80 border border-[#f9bc60]/40 flex items-center justify-center text-[#e68b2e] shadow-md">
            <LucideIcons.MessageCircle size="sm" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-xs uppercase tracking-[0.08em] text-[#94a1b2]">Отзывы сообщества</p>
            <h2 className="text-lg sm:text-xl font-semibold text-[#fffffe] leading-tight">
              Поделитесь опытом участия
            </h2>
            <p className="text-sm text-[#abd1c6]">
              Один отзыв на аккаунт. Фото — до 5 штук. Отзывы доступны только после одобрения заявки.
              {approvedApplications > 0 && (
                <span className="ml-1 text-[#f9bc60]">У вас одобрено заявок: {approvedApplications}</span>
              )}
            </p>
          </div>
        </div>

        {!canReview && (
          <div className="rounded-xl border border-[#e16162]/40 bg-[#e16162]/15 px-4 py-3 text-sm text-[#ffd6cc]">
            Отзыв можно оставить после одобрения заявки.
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#abd1c6]">Текст отзыва</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={1200}
            rows={6}
            placeholder="Расскажите, как проходило оформление, взаимодействие с командой и что понравилось/что улучшить"
            className="w-full rounded-2xl border border-[#abd1c6]/50 bg-[#001e1d]/70 px-4 py-3 text-[#fffffe] placeholder:text-[#94a1b2] focus:border-[#f9bc60] focus:outline-none transition-colors resize-none shadow-inner shadow-[#000]/30"
          />
          <div className="text-xs text-[#94a1b2] flex items-center justify-between">
            <span>До {remaining} символов</span>
            {viewerReview && <span className="text-[#f9bc60]">Вы можете обновить свой отзыв</span>}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-medium text-[#abd1c6]">Фото (до 5)</label>
            <label className="inline-flex items-center gap-2 rounded-full bg-[#001e1d]/50 px-3 py-1.5 text-xs font-semibold text-[#fffffe] border border-[#abd1c6]/50 cursor-pointer hover:border-[#f9bc60]/70 transition-colors">
              <LucideIcons.Image size="xs" className="text-[#f9bc60]" />
              Добавить
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleSelectFiles}
              />
            </label>
          </div>

          {(existingUrls.length > 0 || previews.length > 0) && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {existingUrls.map((url, idx) => (
                <div
                  key={`existing-${url}-${idx}`}
                  className="relative overflow-hidden rounded-xl border border-[#abd1c6]/40 bg-[#001e1d]/50 group"
                >
                  <img src={url} alt={`Фото ${idx + 1}`} className="w-full h-28 object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveExisting(idx)}
                    className="absolute top-1.5 right-1.5 inline-flex items-center justify-center rounded-full bg-black/60 text-white/90 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Удалить фото"
                  >
                    <LucideIcons.X size="xs" />
                  </button>
                </div>
              ))}
              {previews.map((url, idx) => (
                <div
                  key={`new-${url}-${idx}`}
                  className="relative overflow-hidden rounded-xl border border-[#abd1c6]/40 bg-[#001e1d]/50 group"
                >
                  <img src={url} alt={`Фото ${idx + 1}`} className="w-full h-28 object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(idx)}
                    className="absolute top-1.5 right-1.5 inline-flex items-center justify-center rounded-full bg-black/60 text-white/90 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Удалить фото"
                  >
                    <LucideIcons.X size="xs" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-[#94a1b2]">
            Отзывы видят все. Уважайте правила сообщества, не публикуйте персональные данные.
          </p>
          <button
            type="submit"
            disabled={!canReview || submitting}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all border border-transparent",
              canReview
                ? "bg-gradient-to-r from-[#f9bc60] to-[#e16162] text-[#001e1d]"
                : "bg-[#001e1d]/40 text-[#5b7068] cursor-not-allowed border border-[#abd1c6]/30",
            )}
          >
            {submitting && <LucideIcons.Loader2 className="h-4 w-4 animate-spin" />}
            {viewerReview ? "Обновить отзыв" : "Оставить отзыв"}
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
