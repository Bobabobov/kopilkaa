"use client";

import { LucideIcons } from "@/components/ui/LucideIcons";

export type NewsSort = "new" | "top";

export function NewsControlsBar({
  query,
  onQueryChange,
  sort,
  onSortChange,
  onRefresh,
  refreshing,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  sort: NewsSort;
  onSortChange: (v: NewsSort) => void;
  onRefresh: () => void;
  refreshing: boolean;
}) {
  return (
    <div className="rounded-3xl border border-[#abd1c6]/20 bg-[#001e1d]/35 p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="flex-1 min-w-0">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
              <LucideIcons.Search size="sm" />
            </span>
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Поиск по новостям…"
              className="w-full pl-10 pr-3 py-3 rounded-2xl border border-white/10 bg-[#001e1d]/35 text-[#fffffe] placeholder:text-white/40 outline-none focus:border-[#f9bc60]/45"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-2xl border border-white/10 bg-[#001e1d]/25 p-1">
            <button
              type="button"
              onClick={() => onSortChange("new")}
              className={`px-3 py-2 rounded-xl text-sm font-bold transition ${
                sort === "new"
                  ? "bg-[#f9bc60] text-[#001e1d]"
                  : "text-white/75 hover:text-[#fffffe] hover:bg-white/5"
              }`}
              aria-label="Сортировка: новые"
            >
              <span className="inline-flex items-center gap-2">
                <LucideIcons.Clock size="sm" />
                Новые
              </span>
            </button>
            <button
              type="button"
              onClick={() => onSortChange("top")}
              className={`px-3 py-2 rounded-xl text-sm font-bold transition ${
                sort === "top"
                  ? "bg-[#f9bc60] text-[#001e1d]"
                  : "text-white/75 hover:text-[#fffffe] hover:bg-white/5"
              }`}
              aria-label="Сортировка: популярные"
            >
              <span className="inline-flex items-center gap-2">
                <LucideIcons.TrendingUp size="sm" />
                Топ
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/85 font-bold transition ${
              refreshing ? "opacity-70 cursor-wait" : ""
            }`}
            aria-label="Обновить"
            title="Обновить"
          >
            <LucideIcons.RefreshCw size="sm" />
            <span className="hidden sm:inline">
              {refreshing ? "..." : "Обновить"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
