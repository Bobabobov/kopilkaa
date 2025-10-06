"use client";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface FiltersAndSearchProps {
  search: string;
  setSearch: (search: string) => void;
  filter: "ALL" | "PENDING" | "APPROVED" | "REJECTED";
  setFilter: (filter: "ALL" | "PENDING" | "APPROVED" | "REJECTED") => void;
  sortBy: "newest" | "oldest";
  setSortBy: (sortBy: "newest" | "oldest") => void;
}

export function FiltersAndSearch({
  search,
  setSearch,
  filter,
  setFilter,
  sortBy,
  setSortBy,
}: FiltersAndSearchProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 shadow-md"
      style={{
        backgroundColor: "rgba(171, 209, 198, 0.1)",
        border: "1px solid rgba(171, 209, 198, 0.3)",
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
        {/* Search */}
        <div className="relative sm:col-span-2 lg:col-span-1">
          <LucideIcons.Search
            size="sm"
            className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-[#abd1c6]"
          />
          <input
            type="text"
            placeholder="Поиск по заявкам..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 sm:pl-9 pr-3 py-2 sm:py-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 text-sm"
            style={{
              backgroundColor: "rgba(171, 209, 198, 0.1)",
              border: "1px solid rgba(171, 209, 198, 0.3)",
              color: "#fffffe",
            }}
          />
        </div>

        {/* Filter */}
        <div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="w-full px-2 sm:px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 text-xs sm:text-sm"
            style={{
              backgroundColor: "rgba(171, 209, 198, 0.1)",
              border: "1px solid rgba(171, 209, 198, 0.3)",
              color: "#fffffe",
            }}
          >
            <option value="ALL">Все заявки</option>
            <option value="PENDING">На рассмотрении</option>
            <option value="APPROVED">Одобрено</option>
            <option value="REJECTED">Отклонено</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-2 sm:px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 text-xs sm:text-sm"
            style={{
              backgroundColor: "rgba(171, 209, 198, 0.1)",
              border: "1px solid rgba(171, 209, 198, 0.3)",
              color: "#fffffe",
            }}
          >
            <option value="newest">Сначала новые</option>
            <option value="oldest">Сначала старые</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
}
