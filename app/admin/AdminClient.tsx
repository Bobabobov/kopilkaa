/* eslint-disable @next/next/no-img-element */
// app/admin/AdminClient.tsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { statusRu, statusColor } from "@/lib/status";

type Item = {
  id: string;
  title: string;
  summary: string;
  story: string;
  payment: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminComment: string | null;
  createdAt: string;
  user: { email: string; id: string };
  images: { url: string; sort: number }[];
};

function Badge({ s }: { s: Item["status"] }) {
  return <span className={`px-2 py-1 rounded-xl text-xs ${statusColor(s)}`}>{statusRu[s]}</span>;
}

export default function AdminClient() {
  // фильтры/поиск
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");

  // список
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // модалка статуса
  const [modal, setModal] = useState<{ id: string; status: Item["status"]; comment: string }>({
    id: "", status: "PENDING", comment: "",
  });

  // счётчики
  const [stats, setStats] = useState<{ pending: number; approved: number; rejected: number; total: number }>({
    pending: 0, approved: 0, rejected: 0, total: 0,
  });

  // лайтбокс
  const [lbOpen, setLbOpen] = useState(false);
  const [lbImages, setLbImages] = useState<string[]>([]);
  const [lbIndex, setLbIndex] = useState(0);
  useEffect(() => {
    if (!lbOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLbOpen(false);
      if (e.key === "ArrowLeft") setLbIndex(i => (i - 1 + lbImages.length) % lbImages.length);
      if (e.key === "ArrowRight") setLbIndex(i => (i + 1) % lbImages.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lbOpen, lbImages.length]);

  // debounce поиска
  const [debouncedQ, setDebouncedQ] = useState(q);
  useEffect(() => { const t = setTimeout(() => setDebouncedQ(q), 300); return () => clearTimeout(t); }, [q]);

  async function loadStats() {
    try {
      const r = await fetch("/api/admin/applications/stats", { cache: "no-store" });
      if (!r.ok) return;
      const s = await r.json();
      setStats(s);
    } catch {}
  }

  const load = async (p = 1) => {
    setLoading(true); setErr(null);
    try {
      const params = new URLSearchParams({ page: String(p), limit: "10" });
      if (debouncedQ) params.set("q", debouncedQ);
      if (status !== "ALL") params.set("status", status);
      const r = await fetch(`/api/admin/applications?${params}`, { cache: "no-store" });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || "Ошибка загрузки");
      setItems(d.items); setPage(d.page); setPages(d.pages);
    } catch (e: any) { setErr(e.message || "Ошибка"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(1); loadStats(); }, [debouncedQ, status]);

  // 🔴 SSE-подписка: живые обновления из /api/admin/stream
  useEffect(() => {
    const es = new EventSource("/api/admin/stream");

    const onUpdate = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        setItems(arr => arr.map(x =>
          x.id === data.id
            ? { ...x, status: data.status as Item["status"], adminComment: data.adminComment ?? x.adminComment }
            : x
        ));
        loadStats();
      } catch {}
    };
    const onStatsDirty = () => { loadStats(); };

    es.addEventListener("application:update", onUpdate);
    es.addEventListener("stats:dirty", onStatsDirty);
    // не закрываем на error — пусть EventSource сам реконнектится
    return () => es.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // быстрые действия
  async function quickUpdate(id: string, newStatus: Item["status"], comment?: string) {
    const r = await fetch(`/api/admin/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus, adminComment: comment ?? "" }),
    });
    const d = await r.json();
    if (!r.ok) { alert(d?.error || "Ошибка обновления"); return; }

    // локально обновим запись (до прихода SSE)
    setItems(arr => arr.map(x => x.id === id ? d.item : x));

    // и счётчики
    setStats(s => {
      const prev = items.find(x => x.id === id)?.status;
      if (!prev || prev === newStatus) return s;
      const u = { ...s };
      if (prev === "PENDING") u.pending--; if (prev === "APPROVED") u.approved--; if (prev === "REJECTED") u.rejected--;
      if (newStatus === "PENDING") u.pending++; if (newStatus === "APPROVED") u.approved++; if (newStatus === "REJECTED") u.rejected++;
      return u;
    });
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="mx-auto max-w-6xl grid gap-4 force-wrap overflow-x-hidden"
    >
      <h1 className="text-2xl font-semibold">Админка — модерация заявок</h1>

      {/* Счётчики */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card p-4 text-center"><div className="text-xs opacity-60">Всего</div><div className="text-2xl font-semibold">{stats.total}</div></div>
        <div className="card p-4 text-center"><div className="text-xs opacity-60">В обработке</div><div className="text-2xl font-semibold">{stats.pending}</div></div>
        <div className="card p-4 text-center"><div className="text-xs opacity-60">Одобрено</div><div className="text-2xl font-semibold">{stats.approved}</div></div>
        <div className="card p-4 text-center"><div className="text-xs opacity-60">Отказано</div><div className="text-2xl font-semibold">{stats.rejected}</div></div>
      </div>

      {/* Панель управления */}
      <div className="card p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <input className="input" placeholder="Поиск: заголовок, кратко, история, реквизиты, email"
               value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="flex items-center gap-2">
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value as any)}>
            <option value="ALL">Все статусы</option>
            <option value="PENDING">В обработке</option>
            <option value="APPROVED">Одобрено</option>
            <option value="REJECTED">Отказано</option>
          </select>
          <button onClick={() => { setQ(""); setStatus("ALL"); load(1); loadStats(); }}
                  className="btn-ghost border border-black/10 dark:border-white/10 rounded-xl px-3 py-2">
            Сбросить
          </button>
        </div>
      </div>

      {/* Список */}
      {loading && <div className="card p-6">Загрузка…</div>}
      {err && <div className="card p-6 text-red-600 dark:text-red-400">{err}</div>}
      {!loading && !err && items.length === 0 && <div className="card p-6">Ничего не найдено</div>}

      <div className="grid gap-4">
        {items.map((it) => {
          const preview = it.story.length > 260 ? it.story.slice(0, 260) + "…" : it.story;
          return (
            <div key={it.id} className="card p-6 grid gap-3 max-w-full overflow-x-hidden force-wrap">
              {/* Шапка */}
              <div className="flex flex-wrap items-start justify-between gap-3 min-w-0">
                <div className="min-w-0 flex-1 basis-0">
                  <div className="text-lg font-medium clamp-2 break-all text-anywhere max-w-full">{it.title}</div>
                  <div className="text-xs opacity-60 break-all text-anywhere">Автор: {it.user.email}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge s={it.status} />
                  <button
                    className="btn-ghost border border-black/10 dark:border-white/10 rounded-xl px-3 py-2"
                    onClick={() => setModal({ id: it.id, status: it.status, comment: it.adminComment || "" })}
                  >
                    Изменить статус
                  </button>
                  {/* Быстрые действия */}
                  <button className="rounded-xl px-3 py-2 border border-green-600/40 text-green-700 dark:text-green-300"
                          onClick={() => quickUpdate(it.id, "APPROVED", it.adminComment || "")}>
                    Одобрить
                  </button>
                  <button className="rounded-xl px-3 py-2 border border-red-600/40 text-red-700 dark:text-red-300"
                          onClick={() => quickUpdate(it.id, "REJECTED", it.adminComment || "")}>
                    Отказать
                  </button>
                </div>
              </div>

              {/* Кратко */}
              <div className="opacity-70 clamp-2 break-all text-anywhere max-w-full">{it.summary}</div>

              {/* История — <details> */}
              <details className="toggle text-sm">
                <summary className="underline cursor-pointer select-none inline-block opacity-80">
                  <span className="label-closed">Показать полностью</span>
                  <span className="label-open">Свернуть</span>
                </summary>
                <div className="closed-only whitespace-pre-line break-all text-anywhere max-w-full overflow-x-hidden mt-1">
                  {preview}
                </div>
                <div className="open-only whitespace-pre-line break-all text-anywhere max-w-full overflow-x-hidden mt-2">
                  {it.story}
                </div>
              </details>

              {/* Картинки + лайтбокс */}
              {it.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {it.images.map((img, i) => (
                    <img
                      key={i}
                      src={img.url}
                      alt=""
                      className="w-full h-28 object-cover rounded-xl border border-black/10 dark:border-white/10 cursor-zoom-in"
                      onClick={() => { setLbImages(it.images.map(x => x.url)); setLbIndex(i); setLbOpen(true); }}
                    />
                  ))}
                </div>
              )}

              <div className="text-xs opacity-60">Отправлено: {new Date(it.createdAt).toLocaleString()}</div>

              {it.adminComment && (
                <div className="text-sm rounded-xl bg-black/5 dark:bg-white/10 px-3 py-2 break-all text-anywhere">
                  <span className="opacity-70">Комментарий модератора: </span>{it.adminComment}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Пагинация */}
      {pages > 1 && (
        <div className="flex items-center gap-2 justify-center">
          <button className="btn-ghost border border-black/10 dark:border-white/10 rounded-xl px-3 py-2"
                  disabled={page <= 1}
                  onClick={() => { const p = page - 1; setPage(p); load(p); }}>
            ← Назад
          </button>
          <div className="text-sm opacity-70">Стр. {page} / {pages}</div>
          <button className="btn-ghost border border-black/10 dark:border-white/10 rounded-xl px-3 py-2"
                  disabled={page >= pages}
                  onClick={() => { const p = page + 1; setPage(p); load(p); }}>
            Вперёд →
          </button>
        </div>
      )}

      {/* Модалка смены статуса */}
      {modal.id && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="card p-6 w-full max-w-md force-wrap">
            <h2 className="text-lg font-semibold mb-3">Сменить статус</h2>
            <div className="grid gap-3">
              <select className="input" value={modal.status}
                      onChange={(e) => setModal((m) => ({ ...m, status: e.target.value as Item["status"] }))}>
                <option value="PENDING">В обработке</option>
                <option value="APPROVED">Одобрено</option>
                <option value="REJECTED">Отказано</option>
              </select>
              <div>
                <label className="label">Комментарий администратора</label>
                <textarea className="input min-h-[100px]" value={modal.comment}
                          onChange={(e) => setModal((m) => ({ ...m, comment: e.target.value }))}
                          placeholder="Причина решения / уточнения для автора" />
              </div>
              <div className="flex items-center gap-2 justify-end">
                <button className="btn-ghost border border-black/10 dark:border-white/10 rounded-xl px-3 py-2"
                        onClick={() => setModal({ id: "", status: "PENDING", comment: "" })}>
                  Отмена
                </button>
                <button
                  className="btn-primary"
                  onClick={async () => {
                    const r = await fetch(`/api/admin/applications/${modal.id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ status: modal.status, adminComment: modal.comment }),
                    });
                    const d = await r.json();
                    if (r.ok) {
                      setModal({ id: "", status: "PENDING", comment: "" });
                      setItems((arr) => arr.map((x) => (x.id === d.item.id ? d.item : x)));
                      loadStats();
                    } else {
                      alert(d?.error || "Ошибка обновления");
                    }
                  }}
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
            {lbImages.length > 1 && (
              <button aria-label="Prev"
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                      onClick={() => setLbIndex(i => (i - 1 + lbImages.length) % lbImages.length)}>
                ‹
              </button>
            )}
            {lbImages.length > 1 && (
              <button aria-label="Next"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                      onClick={() => setLbIndex(i => (i + 1) % lbImages.length)}>
                ›
              </button>
            )}
            <img src={lbImages[lbIndex]} alt="" className="w-full h-full object-contain select-none" draggable={false} />
            {lbImages.length > 1 && (
              <div className="absolute bottom-2 left-0 right-0 text-center text-white/80 text-sm">
                {lbIndex + 1} / {lbImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
