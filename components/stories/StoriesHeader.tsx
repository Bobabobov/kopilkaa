"use client";

import { LucideIcons } from "@/components/ui/LucideIcons";

interface StoriesHeaderProps {
  query: string;
  onQueryChange: (query: string) => void;
}

export function StoriesHeader({ query, onQueryChange }: StoriesHeaderProps) {
  return (
    <header className="pt-0 sm:pt-1 pb-6" role="banner" aria-label="Заголовок раздела историй">
      {/* Заголовок */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" aria-hidden>
            <img
              src="/kopibook.png"
              alt=""
              className="w-full h-full object-contain"
            />
          </div>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold"
            style={{ color: "#fffffe" }}
          >
            Истории платформы
          </h1>
        </div>

        <div className="mt-4 mx-auto max-w-3xl px-4 text-center">
          <p className="text-base sm:text-lg leading-relaxed text-[#dceee6]">
            Здесь публикуются истории пользователей, по которым платформа
            приняла решение о{" "}
            <span className="bg-gradient-to-r from-[#f9bc60] via-[#ffe0a3] to-[#f9bc60] bg-clip-text text-transparent font-semibold drop-shadow-[0_1px_6px_rgba(249,188,96,0.35)]">
              финансовой поддержке
            </span>
            .
          </p>
          <p className="mt-2 text-sm sm:text-base text-[#abd1c6]">
            Каждая история — это{" "}
            <span className="text-[#f9bc60] font-semibold tracking-wide">
              пример того, как работает «Копилка»
            </span>
            .
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#f9bc60]/70 to-transparent" />
            <span className="text-xs uppercase tracking-[0.18em] text-[#f9bc60]/80">
              Истории поддержки
            </span>
            <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#f9bc60]/70 to-transparent" />
          </div>
        </div>
      </div>

      {/* Поиск */}
      <div className="container mx-auto px-4">
        <div className="relative group max-w-md mx-auto">
          <label htmlFor="stories-search" className="sr-only">
            Поиск историй
          </label>
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none" aria-hidden>
            <LucideIcons.Search
              size="sm"
              className={`transition-colors duration-300 ${
                query ? "text-[#f9bc60]" : "text-[#abd1c6]/70"
              }`}
            />
          </div>

          <input
            id="stories-search"
            type="search"
            role="searchbox"
            aria-label="Поиск историй"
            aria-describedby={query ? "stories-search-clear-hint" : undefined}
            autoComplete="off"
            className="w-full pl-10 pr-10 py-3 backdrop-blur-xl border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f9bc60]/50 focus:border-[#f9bc60]/50 transition-all duration-300 text-[#fffffe] placeholder-[#abd1c6]/60 text-sm shadow-lg group-hover:shadow-[#f9bc60]/10 focus:shadow-[#f9bc60]/20"
            style={{
              backgroundColor: "rgba(0, 30, 29, 0.85)",
              borderColor: "rgba(171, 209, 198, 0.35)",
            }}
            placeholder="Поиск историй..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape" && query) {
                onQueryChange("");
              }
            }}
          />

          {query && (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              id="stories-search-clear-hint"
              aria-label="Очистить поиск"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 text-[#abd1c6]/80 hover:text-[#e16162] transition-all duration-200 rounded-full hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f9bc60]/50"
            >
              <LucideIcons.Close size="sm" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
