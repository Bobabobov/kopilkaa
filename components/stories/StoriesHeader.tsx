"use client";

import { LucideIcons } from "@/components/ui/LucideIcons";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface StoriesHeaderProps {
  query: string;
  onQueryChange: (query: string) => void;
}

export function StoriesHeader({ query, onQueryChange }: StoriesHeaderProps) {
  return (
    <header className="pt-0 sm:pt-2 pb-6 sm:pb-8" role="banner" aria-label="Заголовок раздела историй">
      <div className="relative mx-auto max-w-4xl px-4 mb-6 sm:mb-8">
        <Card variant="darkGlass" padding="lg" className="relative py-8 sm:py-10 px-6 sm:px-10">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#f9bc60]/5 via-transparent to-[#abd1c6]/5 pointer-events-none" aria-hidden />
          <div className="relative text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl bg-[#004643]/40 border border-white/10 p-1" aria-hidden>
                <img src="/kopibook.png" alt="" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#fffffe] leading-tight tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
                  Истории платформы
                </h1>
                <span
                  className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-lg"
                  style={{ background: "rgba(249, 188, 96, 0.15)", color: "#f9bc60" }}
                >
                  <LucideIcons.BookOpen className="w-3 h-3" />
                  Истории поддержки
                </span>
              </div>
            </div>
            <p className="mx-auto max-w-2xl text-base sm:text-lg leading-relaxed text-[#abd1c6]">
              Истории пользователей, получивших{" "}
              <span className="text-[#f9bc60] font-semibold">финансовую поддержку</span> через платформу.
            </p>
          </div>
        </Card>
      </div>

      <div className="container mx-auto px-4 mt-6 max-w-lg">
        <div className="mb-6 max-w-[120px] mx-auto h-px bg-white/10" aria-hidden />
        <Card variant="darkGlass" padding="none" className="overflow-hidden">
          <CardContent className="p-2 sm:p-3">
            <label htmlFor="stories-search" className="sr-only">Поиск историй</label>
            <div className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none text-[#abd1c6]/70" aria-hidden>
                <LucideIcons.Search size="sm" className={cn("transition-colors", query && "text-[#f9bc60]")} />
              </span>
              <input
                id="stories-search"
                type="search"
                role="searchbox"
                aria-label="Поиск историй"
                aria-describedby={query ? "stories-search-clear-hint" : "stories-search-hint"}
                autoComplete="off"
                className={cn(
                  "w-full pl-10 pr-10 py-2.5 rounded-xl border bg-[#001e1d]/50 text-[#fffffe] placeholder:text-[#abd1c6]/50 text-sm transition-colors",
                  "border-[#abd1c6]/25 focus:border-[#f9bc60]/50 focus:ring-2 focus:ring-[#f9bc60]/20 outline-none",
                )}
                placeholder="Поиск по названию или описанию..."
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape" && query) onQueryChange("");
                }}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => onQueryChange("")}
                  id="stories-search-clear-hint"
                  aria-label="Очистить поиск"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-[#abd1c6]/80 hover:text-[#e16162] rounded-lg hover:bg-white/10 transition-colors"
                >
                  <LucideIcons.Close size="sm" />
                </button>
              )}
            </div>
          </CardContent>
        </Card>
        {!query && (
          <p id="stories-search-hint" className="mt-2 text-center text-xs text-[#abd1c6]/70">
            Начните вводить — поиск по названию и описанию
          </p>
        )}
      </div>
    </header>
  );
}
