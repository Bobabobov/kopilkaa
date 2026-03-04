"use client";

import { LucideIcons } from "@/components/ui/LucideIcons";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export type NewsSort = "new" | "top";

export function NewsControlsBar({
  query,
  onQueryChange,
  sort,
  onSortChange,
  onRefresh,
  refreshing,
  resultCount,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  sort: NewsSort;
  onSortChange: (v: NewsSort) => void;
  onRefresh: () => void;
  refreshing: boolean;
  /** Показывать «Найдено: N» когда есть результаты */
  resultCount?: number;
}) {
  return (
    <Card variant="darkGlass" padding="none" className="overflow-hidden">
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="flex-1 min-w-0">
            <label className="sr-only" htmlFor="news-search">
              Поиск по новостям
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#abd1c6]/60 pointer-events-none">
                <LucideIcons.Search size="sm" />
              </span>
              <input
                id="news-search"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Поиск по новостям…"
                className={cn(
                  "w-full pl-10 pr-3 py-2.5 rounded-xl border bg-[#001e1d]/40 text-[#fffffe] placeholder:text-[#abd1c6]/50 outline-none transition-colors",
                  "border-[#abd1c6]/20 focus:border-[#f9bc60]/50 focus:ring-2 focus:ring-[#f9bc60]/20",
                )}
                aria-label="Поиск по новостям"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Tabs value={sort} onValueChange={(v) => onSortChange(v as NewsSort)}>
              <TabsList className="h-auto p-1 rounded-xl bg-[#001e1d]/40 border border-[#abd1c6]/20">
                <TabsTrigger
                  value="new"
                  className="gap-2 px-3 py-2 rounded-lg text-sm font-semibold data-[state=active]:bg-[#f9bc60]/20 data-[state=active]:text-[#f9bc60] data-[state=active]:border data-[state=active]:border-[#f9bc60]/40"
                  aria-label="Сортировка: новые"
                >
                  <LucideIcons.Clock size="sm" />
                  Новые
                </TabsTrigger>
                <TabsTrigger
                  value="top"
                  className="gap-2 px-3 py-2 rounded-lg text-sm font-semibold data-[state=active]:bg-[#f9bc60]/20 data-[state=active]:text-[#f9bc60] data-[state=active]:border data-[state=active]:border-[#f9bc60]/40"
                  aria-label="Сортировка: популярные"
                >
                  <LucideIcons.TrendingUp size="sm" />
                  Топ
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <button
              type="button"
              onClick={onRefresh}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-[#abd1c6]/20 bg-[#001e1d]/40 hover:bg-[#001e1d]/60 text-[#abd1c6] font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-wait"
              aria-label="Обновить"
              title="Обновить"
            >
              <LucideIcons.RefreshCw size="sm" className={refreshing ? "animate-spin" : ""} />
              <span className="hidden sm:inline">{refreshing ? "…" : "Обновить"}</span>
            </button>
          </div>
        </div>
        {resultCount !== undefined && (
          <div className="px-3 pb-2 sm:px-4 sm:pb-3 pt-0">
            <p className="text-xs text-[#abd1c6]/70">
              Найдено: <span className="font-semibold text-[#abd1c6]">{resultCount}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
