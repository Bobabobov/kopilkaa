"use client";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface EmptyStateProps {
  search: string;
  filter: "ALL" | "PENDING" | "APPROVED" | "REJECTED";
}

export function EmptyState({ search, filter }: EmptyStateProps) {
  const hasFilters = search || filter !== "ALL";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-gradient-to-br from-[#004643] via-[#003533] to-[#001e1d] backdrop-blur-2xl rounded-3xl p-10 sm:p-12 text-center border border-[#abd1c6]/25 shadow-2xl"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-8 -right-6 w-32 h-32 rounded-full bg-[#f9bc60]/10 blur-3xl" />
        <div className="absolute -bottom-12 -left-10 w-36 h-36 rounded-full bg-[#abd1c6]/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.2,
          type: "spring",
          stiffness: 200,
        }}
        className="relative z-10 w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#f9bc60] to-[#e8a545] flex items-center justify-center shadow-[0_20px_60px_rgba(249,188,96,0.25)]"
      >
        <LucideIcons.FileText size="xl" className="text-[#001e1d]" />
      </motion.div>

      <h3 className="relative z-10 text-2xl font-bold text-[#fffffe] mb-4">
        {hasFilters ? "Заявки не найдены" : "Пока нет заявок"}
      </h3>

      <p className="relative z-10 text-[#abd1c6] mb-6 max-w-lg mx-auto leading-relaxed">
        {hasFilters
          ? "Попробуйте изменить фильтры или поисковый запрос"
          : "Станьте первым, кто поделится своей историей помощи!"}
      </p>

      {!hasFilters && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative z-10"
        >
          <a
            href="/applications"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#f9bc60] to-[#e8a545] hover:from-[#e8a545] hover:to-[#f9bc60] text-[#001e1d] font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-[#f9bc60]/40 border border-[#f9bc60]/40"
          >
            <LucideIcons.Plus size="md" />
            Создать заявку
          </a>
        </motion.div>
      )}
    </motion.div>
  );
}






