"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

type AdminNewsItem = {
  id: string;
  title: string | null;
  badge: "UPDATE" | "PLANS" | "THOUGHTS" | "IMPORTANT" | null;
  content: string;
  createdAt: string;
  likesCount: number;
  dislikesCount: number;
  media: { id: string; url: string; type: "IMAGE" | "VIDEO"; sort: number }[];
};

interface AdminNewsListProps {
  items: AdminNewsItem[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onDelete: (id: string) => void;
}

export function AdminNewsList({
  items,
  loading,
  error,
  onRefresh,
  onDelete,
}: AdminNewsListProps) {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="text-lg font-black text-[#fffffe]">Последние новости</h3>
        <button
          onClick={onRefresh}
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
                        <LucideIcons.ThumbsDown size="xs" /> {it.dislikesCount}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <LucideIcons.Calendar size="xs" />{" "}
                        {new Date(it.createdAt).toLocaleDateString("ru-RU")}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onDelete(it.id)}
                    className="flex-shrink-0 w-9 h-9 rounded-xl border border-white/10 bg-white/5 hover:bg-red-500/20 hover:border-red-500/40 text-white/70 hover:text-red-400 flex items-center justify-center transition"
                    aria-label="Удалить"
                    title="Удалить"
                  >
                    <LucideIcons.Trash2 size="sm" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
