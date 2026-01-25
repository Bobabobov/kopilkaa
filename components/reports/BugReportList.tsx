"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { BugReport } from "@/app/reports/page";
import BugReportCard from "./BugReportCard";

interface BugReportListProps {
  reports: BugReport[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isAdmin?: boolean;
  onStatusUpdate?: (reportId: string, newStatus: string) => void;
  onDeleteReport?: (reportId: string) => void;
}

export default function BugReportList({
  reports,
  loading,
  page,
  totalPages,
  onPageChange,
  isAdmin = false,
  onStatusUpdate,
  onDeleteReport,
}: BugReportListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-32 bg-[#004643]/30 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 rounded-2xl bg-gradient-to-br from-[#004643]/40 to-[#001e1d]/20 border border-[#abd1c6]/20"
      >
        <LucideIcons.AlertTriangle
          size="xl"
          className="text-[#abd1c6]/50 mx-auto mb-4"
        />
        <p className="text-[#abd1c6]">Пока нет баг-репортов</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report, index) => (
        <BugReportCard
          key={report.id}
          report={report}
          index={index}
          isAdmin={isAdmin}
          onStatusUpdate={onStatusUpdate}
          onDeleteReport={onDeleteReport}
        />
      ))}

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <motion.button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-[#001e1d]/40 border border-[#abd1c6]/20 rounded-lg text-[#abd1c6] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#f9bc60]/50 transition-colors"
          >
            <LucideIcons.ChevronLeft size="sm" />
          </motion.button>

          <span className="px-4 py-2 text-[#abd1c6]">
            Страница {page} из {totalPages}
          </span>

          <motion.button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-[#001e1d]/40 border border-[#abd1c6]/20 rounded-lg text-[#abd1c6] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#f9bc60]/50 transition-colors"
          >
            <LucideIcons.ChevronRight size="sm" />
          </motion.button>
        </div>
      )}
    </div>
  );
}
