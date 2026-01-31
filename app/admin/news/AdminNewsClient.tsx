// app/admin/news/AdminNewsClient.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AdminHeader } from "@/app/admin/_components/AdminHeader";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import { AdminNewsForm } from "./_components/AdminNewsForm";
import { AdminNewsList } from "./_components/AdminNewsList";
import type { MediaDraft, AdminNewsItem, NewsBadge } from "./_components/types";

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

          <AdminNewsForm
            title={title}
            setTitle={setTitle}
            badge={badge}
            setBadge={setBadge}
            content={content}
            setContent={setContent}
            media={media}
            onPickFiles={onPickFiles}
            removeMedia={removeMedia}
            onSubmit={onSubmit}
            uploading={uploading}
            submitting={submitting}
            getTextLength={getTextLength}
          />

          <AdminNewsList
            items={items}
            loading={loading}
            error={error}
            onRefresh={fetchItems}
            onDelete={deletePost}
          />
        </div>
      </div>
    </div>
  );
}
