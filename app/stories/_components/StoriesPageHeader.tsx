"use client";

import { LucideIcons } from "@/components/ui/LucideIcons";
import { cn } from "@/lib/utils";
import {
  storiesGlassInput,
  storiesGlassPanel,
  storiesGlassShine,
} from "./stories-ui/glassStyles";
import { SectionFeedbackCta } from "@/components/feedback/SectionFeedbackCta";

interface StoriesPageHeaderProps {
  query: string;
  onQueryChange: (query: string) => void;
}

export function StoriesPageHeader({
  query,
  onQueryChange,
}: StoriesPageHeaderProps) {
  return (
    <header
      className="relative z-10 pt-4 pb-6 sm:pt-6 sm:pb-8"
      role="banner"
      aria-label="Заголовок раздела историй"
    >
      <div className="container mx-auto max-w-6xl px-4">
        <div className={cn(storiesGlassPanel, "px-5 py-7 sm:px-8 sm:py-9")}>
          <div className={storiesGlassShine} />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4 sm:gap-5 min-w-0">
              <div
                className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-md p-2"
                aria-hidden
              >
                <img
                  src="/kopibook.png"
                  alt=""
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#f9bc60]/90 mb-1.5">
                  Раздел платформы
                </p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#fffffe] tracking-tight leading-tight">
                  Истории поддержки
                </h1>
                <p className="mt-2 text-sm sm:text-base text-[#abd1c6]/85 leading-relaxed max-w-xl">
                  Реальные истории наших авторов, получивших{" "}
                  <span className="font-semibold text-[#f9bc60]">
                    творческие гранты
                  </span>{" "}
                  от платформы «Копилка»
                </p>
              </div>
            </div>

            <div className="w-full lg:max-w-md shrink-0">
              <label htmlFor="stories-search" className="sr-only">
                Поиск историй
              </label>
              <div className="relative">
                <span
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none text-[#abd1c6]/60"
                  aria-hidden
                >
                  <LucideIcons.Search
                    size="sm"
                    className={cn("transition-colors", query && "text-[#f9bc60]")}
                  />
                </span>
                <input
                  id="stories-search"
                  type="search"
                  role="searchbox"
                  aria-label="Поиск историй"
                  aria-describedby={
                    query ? "stories-search-clear-hint" : "stories-search-hint"
                  }
                  autoComplete="off"
                  className={storiesGlassInput}
                  placeholder="Поиск по названию или описанию…"
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
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#abd1c6]/70 hover:text-[#f9bc60] rounded-lg hover:bg-white/[0.06] transition-colors"
                  >
                    <LucideIcons.Close size="sm" />
                  </button>
                )}
              </div>
              {!query && (
                <p
                  id="stories-search-hint"
                  className="mt-2 text-xs text-[#abd1c6]/55 text-center lg:text-left"
                >
                  Начните вводить — поиск по названию и описанию
                </p>
              )}
            </div>
          </div>

          <SectionFeedbackCta variant="stories" className="relative mt-6" />
        </div>
      </div>
    </header>
  );
}
