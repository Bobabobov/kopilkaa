// app/admin/ads/components/ad-requests/AdRequestsStats.tsx
"use client";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import type { Stats } from "./types";

interface AdRequestsStatsProps {
  stats: Stats;
}

export default function AdRequestsStats({ stats }: AdRequestsStatsProps) {
  const statCards = [
    { label: "Всего заявок", value: stats.total, color: "gray", icon: LucideIcons.FileText },
    { label: "Новые", value: stats.new, color: "blue", icon: LucideIcons.Mail },
    { label: "В обработке", value: stats.processing, color: "yellow", icon: LucideIcons.Clock },
    { label: "Одобрено", value: stats.approved, color: "green", icon: LucideIcons.CheckCircle },
    { label: "Отклонено", value: stats.rejected, color: "red", icon: LucideIcons.XCircle },
  ];

  const colorClasses = {
    gray: "border-[#abd1c6]/30 bg-[#001e1d] text-[#fffffe]",
    blue: "border-blue-500/50 bg-blue-500/5 text-blue-300",
    yellow: "border-yellow-500/50 bg-yellow-500/5 text-yellow-300",
    green: "border-green-500/50 bg-green-500/5 text-green-300",
    red: "border-red-500/50 bg-red-500/5 text-red-300",
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl border backdrop-blur-sm hover:shadow-lg transition-all duration-200 ${colorClasses[stat.color as keyof typeof colorClasses]}`}
          >
            <div className="flex items-center justify-between mb-2">
              <Icon size="sm" className="opacity-70" />
              <div className="text-2xl font-bold">{stat.value}</div>
            </div>
            <div className="text-xs text-[#abd1c6]/70 uppercase tracking-wide">
              {stat.label}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

