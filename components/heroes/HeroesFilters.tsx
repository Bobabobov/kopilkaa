// components/heroes/HeroesFilters.tsx
"use client";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface HeroesFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortBy: "total" | "count" | "date";
  onSortChange: (sort: "total" | "count" | "date") => void;
}

export default function HeroesFilters({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
}: HeroesFiltersProps) {
  const sortOptions = [
    { key: "total", label: "По объёму поддержки" },
    { key: "count", label: "По активности" },
    { key: "date", label: "По дате участия" },
  ];

  return (
    <div className="mb-6 sm:mb-8">
      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-6">
          {/* Поиск */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a1b2]">
                <LucideIcons.Search size="sm" />
              </div>
              <input
                type="text"
                placeholder="Поиск по имени..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-11 pr-12 py-2.5 sm:py-3 rounded-2xl border text-sm sm:text-base bg-[#001e1d]/35 border-white/10 text-[#fffffe] placeholder:text-[#94a1b2] focus:outline-none focus:border-[#f9bc60] focus:ring-2 focus:ring-[#f9bc60]/30"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-[#c7d4d0] transition"
                  aria-label="Очистить поиск"
                  title="Очистить"
                >
                  <LucideIcons.X size="sm" />
                </button>
              )}
            </div>
          </div>

          {/* Сортировка */}
          <div className="flex flex-wrap gap-2 sm:gap-2 md:gap-3">
            {sortOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => onSortChange(option.key as typeof sortBy)}
                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm md:text-base transition-all border whitespace-nowrap ${
                  sortBy === option.key
                    ? "bg-[#f9bc60] text-[#001e1d] border-[#f9bc60]"
                    : "bg-[#001e1d]/30 text-[#c7d4d0] border-white/10 hover:border-white/20 hover:bg-white/5"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
