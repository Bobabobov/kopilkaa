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
      <div className="flex flex-col md:flex-row gap-6">
        {/* Поиск */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Поиск по имени..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-5 py-3 rounded-xl border text-base"
            style={{
              backgroundColor: "rgba(0, 70, 67, 0.6)",
              borderColor: "rgba(171, 209, 198, 0.3)",
              color: "#fffffe",
            }}
          />
        </div>

        {/* Сортировка */}
        <div className="flex gap-3">
          {sortOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => onSortChange(option.key as typeof sortBy)}
              className="px-4 py-3 rounded-xl text-base transition-colors"
              style={{
                backgroundColor: sortBy === option.key ? "#f9bc60" : "rgba(0, 70, 67, 0.6)",
                color: sortBy === option.key ? "#001e1d" : "#abd1c6",
                border: `1px solid ${sortBy === option.key ? "#f9bc60" : "rgba(171, 209, 198, 0.3)"}`,
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
