// app/applications/page.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { msToHuman } from "@/lib/time";

type LocalImage = { file: File; url: string };

const LIMITS = {
  titleMax: 40,
  summaryMax: 140,
  storyMin: 200,
  storyMax: 3000,
  paymentMin: 10,
  paymentMax: 200,
  maxPhotos: 5,
};

const DRAFT_KEY = "application_draft_v1";

export default function ApplicationsPage() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [story, setStory] = useState("");
  const [payment, setPayment] = useState("");
  const [photos, setPhotos] = useState<LocalImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [left, setLeft] = useState<number | null>(null); // для лимита 24ч
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Загрузка черновика
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        setTitle(d.title || "");
        setSummary(d.summary || "");
        setStory(d.story || "");
        setPayment(d.payment || "");
        // фото в черновик не кладём (безопасность/размер)
      }
    } catch {}
  }, []);

  // Сохранение черновика (без фото)
  useEffect(() => {
    const data = { title, summary, story, payment };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  }, [title, summary, story, payment]);

  const onPickFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    const rest = Math.max(0, LIMITS.maxPhotos - photos.length);
    const toAdd = arr.slice(0, rest);
    const mapped = toAdd.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    setPhotos((p) => [...p, ...mapped]);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onPickFiles(e.dataTransfer.files);
  };

  const removeAt = (i: number) => setPhotos((p) => p.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    setPhotos((p) => {
      const arr = [...p];
      const j = i + dir;
      if (j < 0 || j >= arr.length) return arr;
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
      return arr;
    });
  };

  const valid =
    title.length > 0 && title.length <= LIMITS.titleMax &&
    summary.length > 0 && summary.length <= LIMITS.summaryMax &&
    story.length >= LIMITS.storyMin && story.length <= LIMITS.storyMax &&
    payment.length >= LIMITS.paymentMin && payment.length <= LIMITS.paymentMax &&
    photos.length <= LIMITS.maxPhotos;

  const uploadAll = async (): Promise<string[]> => {
    if (!photos.length) return [];
    setUploading(true);
    try {
      const fd = new FormData();
      photos.forEach((p) => fd.append("files", p.file));
      const r = await fetch("/api/uploads", { method: "POST", body: fd });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || "Ошибка загрузки");
      return (d.files as { url: string }[]).map((f) => f.url);
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null); setErr(null);
    if (!valid) { setErr("Проверьте поля — есть ошибки/лимиты"); return; }

    try {
      setSubmitting(true);
      const urls = await uploadAll();
      const r = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, summary, story, payment, images: urls }),
      });
      const d = await r.json();
      if (r.status === 429 && d?.leftMs) {
        setLeft(d.leftMs);
        throw new Error("Лимит: 1 заявка в 24 часа");
      }
      if (!r.ok) throw new Error(d?.error || "Ошибка отправки");

      // Успех
      setMsg("Заявка отправлена! Мы уведомим после модерации.");
      localStorage.removeItem(DRAFT_KEY);
      setPhotos([]);
      setTitle(""); setSummary(""); setStory(""); setPayment("");
    } catch (e: any) {
      setErr(e.message || "Ошибка");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-3xl card p-6"
    >
      <h1 className="text-2xl font-semibold mb-4">Подачаfffff заявки</h1>

      <form className="grid gap-4" onSubmit={submit}>
        <div>
          <label className="label">Заголовок <span className="opacity-60">(≤ {LIMITS.titleMax})</span></label>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={LIMITS.titleMax} />
          <div className="help mt-1">{title.length} / {LIMITS.titleMax}</div>
        </div>

        <div>
          <label className="label">Кратко <span className="opacity-60">(≤ {LIMITS.summaryMax})</span></label>
          <input className="input" value={summary} onChange={(e) => setSummary(e.target.value)} maxLength={LIMITS.summaryMax} />
          <div className="help mt-1">{summary.length} / {LIMITS.summaryMax}</div>
        </div>

        <div>
          <label className="label">История <span className="opacity-60">({LIMITS.storyMin}–{LIMITS.storyMax})</span></label>
          <textarea
            className="input min-h-[160px]"
            value={story}
            onChange={(e) => setStory(e.target.value)}
            minLength={LIMITS.storyMin}
            maxLength={LIMITS.storyMax}
          />
          <div className="help mt-1">{story.length} / {LIMITS.storyMax}</div>
        </div>

        <div>
          <label className="label">Реквизиты <span className="opacity-60">({LIMITS.paymentMin}–{LIMITS.paymentMax})</span></label>
          <textarea
            className="input"
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
            minLength={LIMITS.paymentMin}
            maxLength={LIMITS.paymentMax}
          />
          <div className="help mt-1">{payment.length} / {LIMITS.paymentMax}</div>
        </div>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="rounded-2xl border border-dashed border-black/20 dark:border-white/20 p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="label">Фотографии (до {LIMITS.maxPhotos})</div>
            <button type="button" className="btn-ghost border border-black/10 dark:border-white/10 rounded-xl px-3 py-2"
              onClick={() => inputRef.current?.click()}>
              Выбрать файлы
            </button>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={(e) => onPickFiles(e.target.files)}
            />
          </div>

          <div className="help mb-3">Перетащите файлы сюда или нажмите «Выбрать файлы». Каждый ≤ 5 МБ.</div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {photos.map((p, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden border border-black/10 dark:border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={`photo-${i+1}`} className="w-full h-32 object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs flex justify-between">
                  <button type="button" className="px-2 py-1" onClick={() => move(i, -1)}>◀</button>
                  <span className="px-2 py-1">{i + 1}</span>
                  <button type="button" className="px-2 py-1" onClick={() => move(i, +1)}>▶</button>
                </div>
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="absolute top-1 right-1 bg-black/60 text-white text-xs rounded px-2 py-1"
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="btn-primary" disabled={!valid || uploading || submitting}>
            {submitting ? "Отправка..." : uploading ? "Загрузка фото..." : "Отправить заявку"}
          </button>
          <div className="help">
            Лимит: 1 заявка в 24 часа.
            {left !== null && <span> Повторная подача через ~ {msToHuman(left)}</span>}
          </div>
        </div>

        {msg && <div className="text-green-700 dark:text-green-400 text-sm">{msg}</div>}
        {err && <div className="error">{err}</div>}
      </form>
    </motion.div>
  );
}
