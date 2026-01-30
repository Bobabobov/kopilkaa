"use client";

import { LucideIcons } from "@/components/ui/LucideIcons";

interface StoriesHeaderProps {
  query: string;
  onQueryChange: (query: string) => void;
}

export function StoriesHeader({ query, onQueryChange }: StoriesHeaderProps) {
  return (
    <div className="pt-0 sm:pt-1 pb-6">
      {/* Заголовок */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
            <img
              src="/kopibook.png"
              alt="Истории"
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
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <LucideIcons.Search
              size="sm"
              className={`transition-colors duration-300 ${
                query ? "text-yellow-500" : "text-gray-400"
              }`}
            />
          </div>

          <input
            className="w-full pl-10 pr-10 py-3 backdrop-blur-xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all duration-300 text-white placeholder-gray-300 text-sm shadow-lg group-hover:shadow-yellow-500/10 focus:shadow-yellow-500/20"
            style={{
              backgroundColor: "rgba(0, 30, 29, 0.8)",
              borderColor: "rgba(171, 209, 198, 0.3)",
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
              onClick={() => onQueryChange("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 transition-all duration-200 rounded-full hover:bg-red-50 hover:scale-110"
              title="Очистить поиск"
            >
              <LucideIcons.Close size="sm" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
