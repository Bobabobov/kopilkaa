"use client";

import { LucideIcons } from "@/components/ui/LucideIcons";

interface AdminFiltersSectionProps {
  q: string;
  minAmount: string;
  maxAmount: string;
  sortBy: "date" | "amount" | "status";
  sortOrder: "asc" | "desc";
  onSearchChange: (query: string) => void;
  onMinAmountChange: (amount: string) => void;
  onMaxAmountChange: (amount: string) => void;
  onSortByChange: (sortBy: "date" | "amount" | "status") => void;
  onSortOrderChange: (order: "asc" | "desc") => void;
}

const SORT_OPTIONS = [
  { sortBy: "date" as const, sortOrder: "desc" as const, label: "Сначала новые" },
  { sortBy: "date" as const, sortOrder: "asc" as const, label: "Сначала старые" },
  {
    sortBy: "amount" as const,
    sortOrder: "desc" as const,
    label: "Сумма: от большей",
  },
  {
    sortBy: "amount" as const,
    sortOrder: "asc" as const,
    label: "Сумма: от меньшей",
  },
  {
    sortBy: "status" as const,
    sortOrder: "asc" as const,
    label: "По статусу (А→Я)",
  },
  {
    sortBy: "status" as const,
    sortOrder: "desc" as const,
    label: "По статусу (Я→А)",
  },
];

const fieldClass =
  "w-full rounded-xl border border-[#abd1c6]/25 bg-[#003b3a]/70 px-3 py-2.5 text-sm text-[#fffffe] placeholder:text-[#94a1b2] outline-none focus:border-[#f9bc60] min-h-[44px]";

const labelClass = "block text-xs font-bold text-[#abd1c6] mb-1.5";

export function AdminFiltersSection({
  q,
  minAmount,
  maxAmount,
  sortBy,
  sortOrder,
  onSearchChange,
  onMinAmountChange,
  onMaxAmountChange,
  onSortByChange,
  onSortOrderChange,
}: AdminFiltersSectionProps) {
  const sortValue = `${sortBy}-${sortOrder}`;

  const handleSortChange = (value: string) => {
    const option = SORT_OPTIONS.find(
      (o) => `${o.sortBy}-${o.sortOrder}` === value,
    );
    if (!option) return;
    onSortByChange(option.sortBy);
    onSortOrderChange(option.sortOrder);
  };

  return (
    <div className="pt-5 border-t border-[#abd1c6]/15">
      <div className="flex items-center gap-2 mb-3">
        <LucideIcons.Search size="sm" className="text-[#f9bc60]" />
        <h3 className="text-sm font-bold text-[#fffffe]">Поиск и сортировка</h3>
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex-1 min-w-0">
          <label htmlFor="admin-search" className={labelClass}>
            Поиск по истории, нику, почте и тексту заявки
          </label>
          <div className="relative">
            <LucideIcons.Search
              size="sm"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a1b2]"
            />
            <input
              id="admin-search"
              value={q}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="История, ник, имя, email, заголовок, реквизиты…"
              className={`${fieldClass} pl-10`}
            />
          </div>
        </div>

        <div className="w-full lg:w-56 flex-shrink-0">
          <label htmlFor="admin-sort" className={labelClass}>
            Порядок списка
          </label>
          <select
            id="admin-sort"
            value={sortValue}
            onChange={(e) => handleSortChange(e.target.value)}
            className={fieldClass}
          >
            {SORT_OPTIONS.map((option) => (
              <option
                key={`${option.sortBy}-${option.sortOrder}`}
                value={`${option.sortBy}-${option.sortOrder}`}
                className="bg-[#001e1d]"
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-2">
          <label htmlFor="admin-min-amount" className={labelClass}>
            Сумма от, ₽
          </label>
          <input
            id="admin-min-amount"
            type="number"
            value={minAmount}
            onChange={(e) => onMinAmountChange(e.target.value)}
            placeholder="Без ограничения"
            className={fieldClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="admin-max-amount" className={labelClass}>
            Сумма до, ₽
          </label>
          <input
            id="admin-max-amount"
            type="number"
            value={maxAmount}
            onChange={(e) => onMaxAmountChange(e.target.value)}
            placeholder="Без ограничения"
            className={fieldClass}
          />
        </div>
      </div>
    </div>
  );
}
