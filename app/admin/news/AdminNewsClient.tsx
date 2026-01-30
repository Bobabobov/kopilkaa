// app/admin/news/AdminNewsClient.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminHeader } from "@/app/admin/_components/AdminHeader";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import RichTextEditor from "@/components/applications/RichTextEditor";

type MediaDraft = {
  file: File;
  previewUrl: string;
  kind: "IMAGE" | "VIDEO";
};

type AdminNewsItem = {
  id: string;
  title: string | null;
  badge: NewsBadge;
  content: string;
  createdAt: string;
  likesCount: number;
  dislikesCount: number;
  media: { id: string; url: string; type: "IMAGE" | "VIDEO"; sort: number }[];
};

type NewsBadge = "UPDATE" | "PLANS" | "THOUGHTS" | "IMPORTANT" | null;

export default function AdminNewsClient() {
  const [title, setTitle] = useState("");
  const [badge, setBadge] = useState<NewsBadge>(null);
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<MediaDraft[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [items, setItems] = useState<AdminNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast, ToastComponent } = useBeautifulToast();

  // Важно: некоторые реализации toast-хуков возвращают новую функцию showToast на каждый рендер.
  // Если использовать её в deps useCallback/useEffect — можно получить бесконечный цикл запросов.
  const showToastRef = useRef(showToast);
  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/admin/news", { cache: "no-store" });
      const d = await r.json().catch(() => null);
      if (!r.ok) throw new Error(d?.error || "Ошибка загрузки");
      setItems(d.items || []);
    } catch (e: any) {
      setError(e?.message || "Ошибка загрузки");
      showToastRef.current?.(
        "error",
        "Ошибка",
        e?.message || "Ошибка загрузки",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const mapped: MediaDraft[] = files.map((f) => ({
      file: f,
      previewUrl: URL.createObjectURL(f),
      kind: f.type.startsWith("video/") ? "VIDEO" : "IMAGE",
    }));

    setMedia((prev) => [...prev, ...mapped].slice(0, 10));
    e.currentTarget.value = "";
  };

  const removeMedia = (idx: number) => {
    setMedia((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      return next;
    });
  };

  // Функция для подсчета текста без HTML тегов (как в RichTextEditor)
  const getTextLength = useCallback((html: string): number => {
    if (!html) return 0;
    const div = document.createElement("div");
    div.innerHTML = html;
    return (div.textContent || div.innerText || "").replace(/\s/g, "").length;
  }, []);

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

  const uploadMedia = async (): Promise<
    { url: string; type: "IMAGE" | "VIDEO"; sort: number }[]
  > => {
    if (!media.length) return [];
    setUploading(true);
    try {
      const fd = new FormData();
      media.forEach((m) => fd.append("files", m.file));
      const r = await fetch("/api/uploads", { method: "POST", body: fd });
      const d = await r.json().catch(() => null);
      if (!r.ok) throw new Error(d?.error || "Ошибка загрузки");
      const urls = (d.files as { url: string }[]).map((f) => f.url);
      return urls.map((url, idx) => ({
        url,
        type: media[idx]?.kind || "IMAGE",
        sort: idx,
      }));
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contentTextLength === 0) {
      showToast("error", "Ошибка", "Введите текст новости");
      return;
    }
    if (contentTextLength > 5000) {
      showToast(
        "error",
        "Ошибка",
        "Слишком длинный текст (макс. 5000 символов)",
      );
      return;
    }
    if (title.trim().length > 120) {
      showToast("error", "Ошибка", "Слишком длинный заголовок (макс. 120)");
      return;
    }

    setSubmitting(true);
    try {
      const uploaded = await uploadMedia();
      const r = await fetch("/api/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || null,
          badge: badge,
          content: content, // HTML контент от RichTextEditor
          media: uploaded,
        }),
      });
      const d = await r.json().catch(() => null);
      if (!r.ok) throw new Error(d?.error || "Ошибка создания новости");
      showToast("success", "Готово", "Новость опубликована");
      setTitle("");
      setBadge(null);
      setContent("");
      setMedia([]);
      await fetchItems();
    } catch (err: any) {
      showToast(
        "error",
        "Ошибка",
        err?.message || "Не удалось создать новость",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm("Удалить новость?")) return;
    try {
      const r = await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
      const d = await r.json().catch(() => null);
      if (!r.ok) throw new Error(d?.error || "Ошибка удаления");
      showToast("success", "Удалено", "Новость удалена");
      await fetchItems();
    } catch (e: any) {
      showToast("error", "Ошибка", e?.message || "Ошибка удаления");
    }
  };

  return (
    <div className="min-h-screen relative">
      <ToastComponent />
      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-24 pb-10">
          <AdminHeader />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mb-6"
          >
            <h2 className="text-xl sm:text-2xl font-black text-[#fffffe]">
              📰 Новости проекта
            </h2>
            <p className="mt-1 text-sm text-[#abd1c6]">
              Только админ может публиковать новости. Пользователи смогут
              ставить лайки/дизлайки.
            </p>
          </motion.div>

          {/* Create form */}
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
                    onChange={(e) =>
                      setBadge((e.target.value as NewsBadge) || null)
                    }
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
                  Подробное описание новости (максимум 5000 символов).
                  Используйте кнопки для форматирования текста.
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

          {/* List */}
          <div className="mt-8">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="text-lg font-black text-[#fffffe]">
                Последние новости
              </h3>
              <button
                onClick={fetchItems}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/85 text-sm font-semibold"
              >
                <LucideIcons.RefreshCw size="sm" />
                Обновить
              </button>
            </div>

            {error && !loading && (
              <div className="mb-3 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-white/85">
                <span className="font-bold text-white">Ошибка:</span> {error}
              </div>
            )}

            {loading ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 animate-pulse">
                <div className="h-5 bg-white/10 rounded w-52 mb-3" />
                <div className="h-4 bg-white/10 rounded w-full mb-2" />
                <div className="h-4 bg-white/10 rounded w-5/6" />
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-[#abd1c6]">
                Пока новостей нет
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {items.map((it) => (
                    <motion.div
                      key={it.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="rounded-3xl border border-[#abd1c6]/20 bg-[#001e1d]/30 p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="text-[#fffffe] font-black text-base sm:text-lg truncate">
                            {it.title || "Без заголовка"}
                          </div>
                          <div
                            className="mt-1 text-sm text-white/75 line-clamp-2 prose prose-sm prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: it.content }}
                          />
                          <div className="mt-2 text-xs text-white/55 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1">
                              <LucideIcons.ThumbsUp size="xs" /> {it.likesCount}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <LucideIcons.ThumbsDown size="xs" />{" "}
                              {it.dislikesCount}
                            </span>
                            <span className="text-[#f9bc60]">•</span>
                            <span>медиа: {it.media?.length || 0}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => deletePost(it.id)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-red-400/20 bg-red-500/10 hover:bg-red-500/15 text-red-200 text-sm font-bold"
                        >
                          <LucideIcons.Trash2 size="sm" />
                          Удалить
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
