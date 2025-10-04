"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface StoriesPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function StoriesPagination({ currentPage, totalPages, onPageChange }: StoriesPaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center gap-2 mt-12"
    >
      {/* Предыдущая страница */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-xl border border-white/20 rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
        style={{ borderColor: '#abd1c6/30' }}
      >
        <LucideIcons.ChevronLeft size="sm" />
        <span className="hidden sm:inline">Предыдущая</span>
      </button>

      {/* Номера страниц */}
      <div className="flex items-center gap-1">
        {getVisiblePages().map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <span className="px-3 py-2" style={{ color: '#2d5a4e' }}>...</span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={`px-3 py-2 rounded-xl font-medium transition-all duration-300 ${
                  currentPage === page
                    ? 'text-white shadow-lg'
                    : 'bg-white/90 backdrop-blur-xl border border-white/20 text-gray-700 hover:bg-gray-50 shadow-lg hover:shadow-xl'
                }`}
                style={currentPage === page ? {
                  background: 'linear-gradient(135deg, #f9bc60 0%, #e8a94a 100%)',
                  borderColor: '#f9bc60'
                } : {
                  borderColor: '#abd1c6/30'
                }}
              >
                {page}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Следующая страница */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-xl border border-white/20 rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
        style={{ borderColor: '#abd1c6/30' }}
      >
        <span className="hidden sm:inline">Следующая</span>
        <LucideIcons.ChevronRight size="sm" />
      </button>
    </motion.div>
  );
}








