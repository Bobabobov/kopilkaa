// app/stories/page.tsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Card = {
  id: string;
  title: string;
  summary: string;
  createdAt: string;
  images: { url: string; sort: number }[];
};

export default function StoriesPage() {
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState(q);
  useEffect(() => { const t = setTimeout(() => setDebounced(q), 300); return () => clearTimeout(t); }, [q]);

  const [items, setItems] = useState<Card[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = async (p = 1) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), limit: "12" });
    if (debounced) params.set("q", debounced);
    const r = await fetch(`/api/stories?${params}`, { cache: "no-store" });
    const d = await r.json();
    setItems(d.items); setPage(d.page); setPages(d.pages);
    setLoading(false);
  };

  useEffect(() => { load(1); }, [debounced]);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4 }}
      className="mx-auto max-w-6xl grid gap-4 force-wrap overflow-x-hidden"
    >
      <h1 className="text-2xl font-semibold">Истории</h1>

      <div className="card p-4 flex items-center gap-2">
        <input className="input flex-1" placeholder="Поиск по историям" value={q} onChange={(e)=>setQ(e.target.value)} />
      </div>

      {loading && <div className="card p-6">Загрузка…</div>}
      {!loading && items.length === 0 && <div className="card p-6">Ничего не найдено</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(it => (
          <a key={it.id} href={`/stories/${it.id}`} className="card p-0 overflow-hidden hover:shadow-lg transition">
            {it.images[0] && (
              <img src={it.images[0].url} alt="" className="w-full h-40 object-cover" />
            )}
            <div className="p-4 grid gap-2">
              <div className="text-lg font-medium clamp-2 break-all text-anywhere">{it.title}</div>
              <div className="text-sm opacity-70 clamp-2 break-all text-anywhere">{it.summary}</div>
              <div className="text-xs opacity-60">{new Date(it.createdAt).toLocaleDateString()}</div>
            </div>
          </a>
        ))}
      </div>

      {pages > 1 && (
        <div className="flex items-center gap-2 justify-center">
          <button className="btn-ghost border rounded-xl px-3 py-2" disabled={page<=1} onClick={()=>load(page-1)}>← Назад</button>
          <div className="text-sm opacity-70">Стр. {page} / {pages}</div>
          <button className="btn-ghost border rounded-xl px-3 py-2" disabled={page>=pages} onClick={()=>load(page+1)}>Вперёд →</button>
        </div>
      )}
    </motion.div>
  );
}
