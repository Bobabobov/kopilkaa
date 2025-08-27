// app/profile/applications/page.tsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { statusRu, statusColor } from "@/lib/status";

type AppItem = {
  id: string;
  title: string;
  summary: string;
  story: string;
  payment: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminComment: string | null;
  createdAt: string;
  images: { url: string; sort: number }[];
};

export default function MyApplicationsPage() {
  const [items, setItems] = useState<AppItem[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const load = async (p = 1) => {
    setLoading(true); setErr(null);
    try {
      const r = await fetch(`/api/applications/mine?page=${p}&limit=10`, { cache: "no-store" });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || "ОшибоЧка загрузки");
      setItems(d.items);
      setPage(d.page);
      setPages(d.pages);
    } catch (e: any) {
      setErr(e.message || "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1); }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-3xl grid gap-4"
    >
      <h1 className="text-2xl font-semibold">Мои заявки</h1>

      {loading && <div className="card p-6">Загрузка…</div>}
      {err && <div className="card p-6 text-red-600 dark:text-red-400">{err}</div>}
      {!loading && !err && items.length === 0 && (
        <div className="card p-6">Пока нет заявок. <a className="underline" href="/applications">Подать первую</a></div>
      )}

      {items.map((it) => {
        const isOpen = !!expanded[it.id];
        const storyShort = it.story.length > 260 ? it.story.slice(0, 260) + "…" : it.story;
        return (
          <div key={it.id} className="card p-6 grid gap-3">
            {/* ВАЖНО: min-w-0 на строке + flex-1 basis-0 на тексте, чтобы он сжимался и переносился */}
            <div className="flex flex-wrap items-center gap-3 justify-between min-w-0">
              <div className="text-lg font-medium min-w-0 flex-1 basis-0">
                <span className="block clamp-2 text-anywhere break-all">{it.title}</span>
              </div>
              <div className={`px-2 py-1 rounded-xl text-xs shrink-0 ${statusColor(it.status)}`}>
                {statusRu[it.status]}
              </div>
            </div>

            <div className="opacity-70 clamp-2 text-anywhere break-all">{it.summary}</div>

            <div className="text-sm text-anywhere break-all">
              {isOpen ? it.story : storyShort}{" "}
              {it.story.length > 260 && (
                <button
                  className="underline opacity-80"
                  onClick={() => setExpanded((s) => ({ ...s, [it.id]: !isOpen }))}
                >
                  {isOpen ? "Свернуть" : "Показать полностью"}
                </button>
              )}
            </div>

            {it.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {it.images.map((img, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={img.url}
                    alt=""
                    className="w-full h-32 object-cover rounded-xl border border-black/10 dark:border-white/10"
                  />
                ))}
              </div>
            )}

            <div className="text-xs opacity-60">
              Отправлено: {new Date(it.createdAt).toLocaleString()}
            </div>

            {it.adminComment && (
              <div className="text-sm rounded-xl bg-black/5 dark:bg-white/10 px-3 py-2 text-anywhere break-all">
                <span className="opacity-70">Комментарий админа: </span>{it.adminComment}
              </div>
            )}
          </div>
        );
      })}

      {pages > 1 && (
        <div className="flex items-center gap-2 justify-center">
          <button
            className="btn-ghost border border-black/10 dark:border-white/10 rounded-xl px-3 py-2"
            disabled={page <= 1}
            onClick={() => load(page - 1)}
          >
            ← Назад
          </button>
          <div className="text-sm opacity-70">Стр. {page} / {pages}</div>
          <button
            className="btn-ghost border border-black/10 dark:border-white/10 rounded-xl px-3 py-2"
            disabled={page >= pages}
            onClick={() => load(page + 1)}
          >
            Вперёд →
          </button>
        </div>
      )}
    </motion.div>
  );
}
