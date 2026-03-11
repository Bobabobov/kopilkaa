import type { ApplicationStatus } from "@/types/admin";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface AdminFiltersSectionProps {
  q: string;
  status: "ALL" | ApplicationStatus;
  minAmount: string;
  maxAmount: string;
  sortBy: "date" | "amount" | "status";
  sortOrder: "asc" | "desc";
  onSearchChange: (query: string) => void;
  onStatusChange: (status: "ALL" | ApplicationStatus) => void;
  onMinAmountChange: (amount: string) => void;
  onMaxAmountChange: (amount: string) => void;
  onSortByChange: (sortBy: "date" | "amount" | "status") => void;
  onSortOrderChange: (order: "asc" | "desc") => void;
}

export function AdminFiltersSection({
  q,
  status,
  minAmount,
  maxAmount,
  sortBy,
  sortOrder,
  onSearchChange,
  onStatusChange,
  onMinAmountChange,
  onMaxAmountChange,
  onSortByChange,
  onSortOrderChange,
}: AdminFiltersSectionProps) {
  return (
    <motion.div
      key="filters"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="lg:col-span-1 sm:col-span-2">
          <label className="block text-xs font-black text-[#abd1c6] mb-2">
            Поиск
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#abd1c6]">
              <LucideIcons.Search size="sm" />
            </div>
            <input
              value={q}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Заголовок/описание…"
              className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#001e1d]/60 border border-[#abd1c6]/25 focus:ring-2 focus:ring-[#f9bc60] focus:border-[#f9bc60] transition-all text-[#fffffe] placeholder:text-[#abd1c6]/60 text-sm min-h-[44px]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-[#abd1c6] mb-2">
            Статус
          </label>
          <select
            value={status}
            onChange={(e) =>
              onStatusChange(e.target.value as "ALL" | ApplicationStatus)
            }
            className="w-full px-3 py-3 rounded-xl bg-[#001e1d]/60 border border-[#abd1c6]/25 focus:ring-2 focus:ring-[#f9bc60] focus:border-[#f9bc60] transition-all text-[#fffffe] text-sm min-h-[44px]"
          >
            <option value="ALL" className="bg-[#001e1d]">
              Все
            </option>
            <option value="PENDING" className="bg-[#001e1d]">
              В обработке
            </option>
            <option value="APPROVED" className="bg-[#001e1d]">
              Одобрено
            </option>
            <option value="REJECTED" className="bg-[#001e1d]">
              Отказано
            </option>
            <option value="CONTEST" className="bg-[#001e1d]">
              Конкурс
            </option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-black text-[#abd1c6] mb-2">
              Сумма от
            </label>
            <input
              type="number"
              value={minAmount}
              onChange={(e) => onMinAmountChange(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-3 rounded-xl bg-[#001e1d]/60 border border-[#abd1c6]/25 focus:ring-2 focus:ring-[#f9bc60] focus:border-[#f9bc60] transition-all text-[#fffffe] placeholder:text-[#abd1c6]/60 text-sm min-h-[44px]"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-[#abd1c6] mb-2">
              Сумма до
            </label>
            <input
              type="number"
              value={maxAmount}
              onChange={(e) => onMaxAmountChange(e.target.value)}
              placeholder="∞"
              className="w-full px-3 py-3 rounded-xl bg-[#001e1d]/60 border border-[#abd1c6]/25 focus:ring-2 focus:ring-[#f9bc60] focus:border-[#f9bc60] transition-all text-[#fffffe] placeholder:text-[#abd1c6]/60 text-sm min-h-[44px]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-[#abd1c6] mb-2">
            Сортировка
          </label>
          <select
            value={sortBy}
            onChange={(e) =>
              onSortByChange(e.target.value as "date" | "amount" | "status")
            }
            className="w-full px-3 py-3 rounded-xl bg-[#001e1d]/60 border border-[#abd1c6]/25 focus:ring-2 focus:ring-[#f9bc60] focus:border-[#f9bc60] transition-all text-[#fffffe] text-sm min-h-[44px]"
          >
            <option value="date" className="bg-[#001e1d]">
              По дате
            </option>
            <option value="amount" className="bg-[#001e1d]">
              По сумме
            </option>
            <option value="status" className="bg-[#001e1d]">
              По статусу
            </option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-black text-[#abd1c6] mb-2">
            Порядок
          </label>
          <select
            value={sortOrder}
            onChange={(e) => onSortOrderChange(e.target.value as "asc" | "desc")}
            className="w-full px-3 py-3 rounded-xl bg-[#001e1d]/60 border border-[#abd1c6]/25 focus:ring-2 focus:ring-[#f9bc60] focus:border-[#f9bc60] transition-all text-[#fffffe] text-sm min-h-[44px]"
          >
            <option value="desc" className="bg-[#001e1d]">
              По убыванию
            </option>
            <option value="asc" className="bg-[#001e1d]">
              По возрастанию
            </option>
          </select>
        </div>
      </div>
    </motion.div>
  );
}

