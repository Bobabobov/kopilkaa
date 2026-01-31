"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import RichTextEditor from "@/components/applications/RichTextEditor";

type MediaDraft = {
  file: File;
  previewUrl: string;
  kind: "IMAGE" | "VIDEO";
};

type NewsBadge = "UPDATE" | "PLANS" | "THOUGHTS" | "IMPORTANT" | null;

interface AdminNewsFormProps {
  title: string;
  setTitle: (value: string) => void;
  badge: NewsBadge;
  setBadge: (value: NewsBadge) => void;
  content: string;
  setContent: (value: string) => void;
  media: MediaDraft[];
  onPickFiles: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeMedia: (idx: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  uploading: boolean;
  submitting: boolean;
  getTextLength: (html: string) => number;
}

export function AdminNewsForm({
  title,
  setTitle,
  badge,
  setBadge,
  content,
  setContent,
  media,
  onPickFiles,
  removeMedia,
  onSubmit,
  uploading,
  submitting,
  getTextLength,
}: AdminNewsFormProps) {
  const contentTextLength = useMemo(
    () => getTextLength(content),
    [content, getTextLength],
  );

  const canSubmit = useMemo(
    () =>
      contentTextLength > 0 &&
      contentTextLength <= 5000 &&
      !submitting &&
      !uploading,
    [contentTextLength, submitting, uploading],
  );

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border border-[#abd1c6]/25 bg-gradient-to-br from-[#004643]/55 to-[#001e1d]/45 p-5 sm:p-6 shadow-xl"
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#f9bc60]/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-[#abd1c6]/10 rounded-full blur-3xl" />

      <div className="relative z-10 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-white/80 mb-1">
              Заголовок (необязательно)
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Большое обновление профиля"
              className="w-full rounded-2xl border border-white/10 bg-[#001e1d]/40 px-4 py-3 text-sm text-[#fffffe] placeholder:text-white/40 outline-none focus:border-[#f9bc60]/50"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-white/80 mb-1">
              Бейдж (необязательно)
            </label>
            <select
              value={badge || ""}
              onChange={(e) => setBadge((e.target.value as NewsBadge) || null)}
              className="w-full rounded-2xl border border-white/10 bg-[#001e1d]/40 px-4 py-3 text-sm text-[#fffffe] outline-none focus:border-[#f9bc60]/50"
            >
              <option value="">Без бейджа</option>
              <option value="UPDATE">Обновление</option>
              <option value="PLANS">Планы</option>
              <option value="THOUGHTS">Мысли</option>
              <option value="IMPORTANT">Важно</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-white/80 mb-1">
            Медиа (фото/видео)
          </label>
          <input
            type="file"
            accept="image/*,video/mp4,video/webm"
            multiple
            onChange={onPickFiles}
            className="w-full rounded-2xl border border-white/10 bg-[#001e1d]/40 px-4 py-3 text-sm text-white/80 file:mr-4 file:rounded-xl file:border-0 file:bg-[#f9bc60] file:px-4 file:py-2 file:text-sm file:font-bold file:text-[#001e1d]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-white/80 mb-1">
            Текст новости
          </label>
          <p className="text-xs text-[#abd1c6]/70 mb-3">
            Подробное описание новости (максимум 5000 символов). Используйте
            кнопки для форматирования текста.
          </p>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Пишите текст новости. Можно использовать форматирование: жирный, курсив, списки, выравнивание..."
            minLength={1}
            maxLength={5000}
            rows={8}
            allowPaste={true}
          />
        </div>

        {media.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-[#001e1d]/25 p-3">
            <div className="text-xs font-bold text-white/75 mb-2">
              Предпросмотр
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {media.map((m, idx) => (
                <div
                  key={`${m.previewUrl}-${idx}`}
                  className="relative group overflow-hidden rounded-2xl border border-white/10 bg-black/20"
                >
                  {m.kind === "VIDEO" ? (
                    <video
                      src={m.previewUrl}
                      className="w-full h-28 object-cover"
                    />
                  ) : (
                    <img
                      src={m.previewUrl}
                      alt=""
                      className="w-full h-28 object-cover"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removeMedia(idx)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-xl bg-black/60 border border-white/10 text-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    aria-label="Удалить"
                    title="Удалить"
                  >
                    <LucideIcons.Trash2 size="sm" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!canSubmit}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-black transition border ${
              canSubmit
                ? "bg-[#f9bc60] hover:bg-[#e8a545] text-[#001e1d] border-[#f9bc60]/40"
                : "bg-white/10 text-white/50 border-white/10 cursor-not-allowed"
            }`}
          >
            <LucideIcons.Rocket size="sm" />
            {submitting || uploading ? "Публикуем..." : "Опубликовать"}
          </button>

          <div className="text-xs text-white/60">
            {uploading
              ? "Загрузка медиа..."
              : submitting
                ? "Сохранение..."
                : " "}
          </div>
        </div>
      </div>
    </motion.form>
  );
}
