"use client";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface StatsCardsProps {
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const statItems = [
    { label: "Всего", value: stats.total, icon: "FileText", color: "blue" },
    { label: "На рассмотрении", value: stats.pending, icon: "Clock", color: "orange" },
    { label: "Одобрено", value: stats.approved, icon: "CheckCircle", color: "green" },
    { label: "Отклонено", value: stats.rejected, icon: "XCircle", color: "red" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6"
    >
      {statItems.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
          className="rounded-lg p-4 text-center transition-all duration-200 hover:bg-opacity-20"
          style={{ 
            backgroundColor: 'rgba(171, 209, 198, 0.1)',
            border: '1px solid rgba(171, 209, 198, 0.2)'
          }}
        >
          {/* Простая иконка */}
          <div className="w-8 h-8 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f9bc60' }}>
            {stat.icon === "FileText" && <LucideIcons.FileText size="sm" className="text-[#001e1d]" />}
            {stat.icon === "Clock" && <LucideIcons.Clock size="sm" className="text-[#001e1d]" />}
            {stat.icon === "CheckCircle" && <LucideIcons.CheckCircle size="sm" className="text-[#001e1d]" />}
            {stat.icon === "XCircle" && <LucideIcons.XCircle size="sm" className="text-[#001e1d]" />}
          </div>
          
          {/* Число */}
          <div className="text-xl font-semibold mb-1" style={{ color: '#fffffe' }}>
            {stat.value}
          </div>
          
          {/* Подпись */}
          <div className="text-xs" style={{ color: '#abd1c6' }}>
            {stat.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
















