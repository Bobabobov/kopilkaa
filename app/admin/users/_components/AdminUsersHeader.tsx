"use client";

import { motion } from "framer-motion";

interface AdminUsersHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  usersCount: number;
  hasMore: boolean;
}

export function AdminUsersHeader({
  searchQuery,
  onSearchChange,
  usersCount,
  hasMore,
}: AdminUsersHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#fffffe] mb-2">
            👥 Все пользователи
          </h2>
          <p className="text-[#abd1c6] text-sm sm:text-base">
            Загружено: {usersCount} {hasMore && "(ещё загружается...)"}
          </p>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Поиск по имени или email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 bg-[#001e1d] border border-[#abd1c6]/20 rounded-xl text-[#fffffe] placeholder-[#abd1c6]/50 focus:outline-none focus:border-[#f9bc60] focus:ring-2 focus:ring-[#f9bc60]/20"
          />
        </div>
      </div>
    </motion.div>
  );
}
