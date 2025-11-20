// components/heroes/HeroesFilters.tsx
"use client";

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
    { key: "total", label: "По сумме" },
    { key: "count", label: "По количеству" },
    { key: "date", label: "По дате" },
  ];

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Поиск */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Поиск по имени..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-5 py-3 rounded-2xl border text-base bg-[#004643]/60 border-[#abd1c6]/40 text-[#fffffe] placeholder:text-[#abd1c6]/60 focus:outline-none focus:border-[#f9bc60] focus:ring-1 focus:ring-[#f9bc60]"
          />
        </div>

        {/* Сортировка */}
        <div className="flex flex-wrap gap-2 md:gap-3">
          {sortOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => onSortChange(option.key as typeof sortBy)}
              className={`px-4 py-2 rounded-full text-sm md:text-base transition-colors border ${
                sortBy === option.key
                  ? "bg-[#f9bc60] text-[#001e1d] border-[#f9bc60]"
                  : "bg-[#001e1d]/40 text-[#abd1c6] border-[#abd1c6]/40 hover:border-[#f9bc60]/60"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
