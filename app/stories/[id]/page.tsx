// app/stories/[id]/page.tsx
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Item = {
  id: string;
  title: string;
  summary: string;
  story: string;
  createdAt: string;
  images: { url: string; sort: number }[];
};

export default function StoryPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [item, setItem] = useState<Item | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);

  useEffect(() => {
    fetch(`/api/stories/${id}`, { cache: "no-store" })
      .then(r => r.json())
      .then(d => { if (d?.item) setItem(d.item); else setErr("Не найдено"); })
      .catch(()=>setErr("Ошибка загрузки"));
  }, [id]);

  useEffect(() => {
    if (!lbOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLbOpen(false);
      if (e.key === "ArrowLeft") setLbIndex(i => (i - 1 + (item?.images.length||1)) % (item?.images.length||1));
      if (e.key === "ArrowRight") setLbIndex(i => (i + 1) % (item?.images.length||1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lbOpen, item?.images.length]);

  if (err) return <div className="card p-6 mx-auto max-w-3xl">{err}</div>;
  if (!item) return <div className="card p-6 mx-auto max-w-3xl">Загрузка…</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4 }}
      className="mx-auto max-w-3xl grid gap-4 force-wrap overflow-x-hidden"
    >
      <h1 className="text-2xl font-semibold break-all text-anywhere">{item.title}</h1>

      <div className="text-sm opacity-70 break-all text-anywhere">{item.summary}</div>

      {item.images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {item.images.map((img, i) => (
            <img key={i} src={img.url} alt=""
                 className="w-full h-40 object-cover rounded-xl border border-black/10 dark:border-white/10 cursor-zoom-in"
                 onClick={() => { setLbIndex(i); setLbOpen(true); }} />
          ))}
        </div>
      )}

      <div className="whitespace-pre-line break-all text-anywhere text-base leading-relaxed">
        {item.story}
      </div>

      <div className="text-xs opacity-60">Опубликовано: {new Date(item.createdAt).toLocaleString()}</div>

      {/* Лайтбокс */}
      {lbOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
             onClick={() => setLbOpen(false)}>
          <div className="relative max-w-5xl w-full h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <button aria-label="Close"
                    className="absolute top-2 right-2 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                    onClick={() => setLbOpen(false)}>
              ×
            </button>
            {item.images.length > 1 && (
              <button aria-label="Prev"
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                      onClick={() => setLbIndex(i => (i - 1 + item.images.length) % item.images.length)}>
                ‹
              </button>
            )}
            {item.images.length > 1 && (
              <button aria-label="Next"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                      onClick={() => setLbIndex(i => (i + 1) % item.images.length)}>
                ›
              </button>
            )}
            <img src={item.images[lbIndex].url} alt="" className="w-full h-full object-contain select-none" draggable={false} />
            {item.images.length > 1 && (
              <div className="absolute bottom-2 left-0 right-0 text-center text-white/80 text-sm">
                {lbIndex + 1} / {item.images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
