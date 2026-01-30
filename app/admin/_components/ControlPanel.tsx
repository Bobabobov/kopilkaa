// app/admin/components/ControlPanel.tsx
import { motion } from "framer-motion";
import { ApplicationStatus } from "../types";

interface ControlPanelProps {
  searchQuery: string;
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
  onReset: () => void;
}

export default function ControlPanel({
  searchQuery,
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
  onReset,
}: ControlPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative overflow-hidden bg-gradient-to-br from-[#001e1d] via-[#004643]/90 to-[#001e1d] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-[#abd1c6]/20 mb-6 sm:mb-8"
    >
      <div className="relative z-10">
        {/* Заголовок */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-[#fffffe] flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#f9bc60] to-[#e8a545] rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-[#001e1d]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            Панель управления
          </h3>

          <button
            onClick={onReset}
            className="group px-4 sm:px-6 py-2 sm:py-3 bg-[#001e1d]/60 hover:bg-[#001e1d]/80 text-[#abd1c6] hover:text-[#fffffe] font-bold rounded-lg sm:rounded-xl transition-all duration-300 border border-[#abd1c6]/20 hover:border-[#f9bc60]/40 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Сбросить
            </span>
          </button>
        </div>

        {/* Основные фильтры */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {/* Поиск */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-xs sm:text-sm font-bold text-[#abd1c6] mb-2 sm:mb-3">
              Поиск заявок
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#abd1c6]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-[#001e1d]/60 border border-[#abd1c6]/30 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#f9bc60] focus:border-[#f9bc60] transition-all duration-300 text-[#fffffe] placeholder:text-[#abd1c6]/60 text-sm sm:text-base"
                placeholder="Поиск по заголовку, описанию..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          {/* Статус */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-[#abd1c6] mb-2 sm:mb-3">
              Статус
            </label>
            <select
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#001e1d]/60 border border-[#abd1c6]/30 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#f9bc60] focus:border-[#f9bc60] transition-all duration-300 text-[#fffffe] text-sm sm:text-base"
              value={status}
              onChange={(e) =>
                onStatusChange(e.target.value as "ALL" | ApplicationStatus)
              }
            >
              <option value="ALL" className="bg-[#001e1d]">
                Все статусы
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

          {/* Сумма от */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-[#abd1c6] mb-2 sm:mb-3">
              Сумма от
            </label>
            <div className="relative">
              <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-[#f9bc60] font-bold text-sm sm:text-base">
                ₽
              </span>
              <input
                type="number"
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-[#001e1d]/60 border border-[#abd1c6]/30 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#f9bc60] focus:border-[#f9bc60] transition-all duration-300 text-[#fffffe] placeholder:text-[#abd1c6]/60 text-sm sm:text-base"
                placeholder="0"
                value={minAmount}
                onChange={(e) => onMinAmountChange(e.target.value)}
              />
            </div>
          </div>

          {/* Сумма до */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-[#abd1c6] mb-2 sm:mb-3">
              Сумма до
            </label>
            <div className="relative">
              <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-[#f9bc60] font-bold text-sm sm:text-base">
                ₽
              </span>
              <input
                type="number"
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-[#001e1d]/60 border border-[#abd1c6]/30 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#f9bc60] focus:border-[#f9bc60] transition-all duration-300 text-[#fffffe] placeholder:text-[#abd1c6]/60 text-sm sm:text-base"
                placeholder="∞"
                value={maxAmount}
                onChange={(e) => onMaxAmountChange(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Сортировка */}
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs sm:text-sm font-bold text-[#abd1c6] mb-2 sm:mb-3">
              Сортировка
            </label>
            <select
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#001e1d]/60 border border-[#abd1c6]/30 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#f9bc60] focus:border-[#f9bc60] transition-all duration-300 text-[#fffffe] text-sm sm:text-base"
              value={sortBy}
              onChange={(e) =>
                onSortByChange(e.target.value as "date" | "amount" | "status")
              }
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

          <div className="flex-1 w-full">
            <label className="block text-xs sm:text-sm font-bold text-[#abd1c6] mb-2 sm:mb-3">
              Порядок
            </label>
            <select
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#001e1d]/60 border border-[#abd1c6]/30 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#f9bc60] focus:border-[#f9bc60] transition-all duration-300 text-[#fffffe] text-sm sm:text-base"
              value={sortOrder}
              onChange={(e) =>
                onSortOrderChange(e.target.value as "asc" | "desc")
              }
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
      </div>
    </motion.div>
  );
}
