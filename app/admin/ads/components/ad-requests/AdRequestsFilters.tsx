// app/admin/ads/components/ad-requests/AdRequestsFilters.tsx
"use client";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface AdRequestsFiltersProps {
  filterStatus: string;
  onFilterChange: (status: string) => void;
}

export default function AdRequestsFilters({
  filterStatus,
  onFilterChange,
}: AdRequestsFiltersProps) {
  const filters = [
    { value: "all", label: "Все", icon: LucideIcons.List },
    { value: "new", label: "Новые", icon: LucideIcons.Mail, color: "blue" },
    {
      value: "processing",
      label: "В обработке",
      icon: LucideIcons.Clock,
      color: "yellow",
    },
    {
      value: "approved",
      label: "Одобренные",
      icon: LucideIcons.CheckCircle,
      color: "green",
    },
    {
      value: "rejected",
      label: "Отклонённые",
      icon: LucideIcons.XCircle,
      color: "red",
    },
  ];

  const getButtonClasses = (filterValue: string, filterColor?: string) => {
    const isActive = filterStatus === filterValue;
    const baseClasses =
      "px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2";

    if (isActive) {
      const activeClasses = {
        all: "bg-[#f9bc60] text-[#001e1d] shadow-lg shadow-[#f9bc60]/20",
        blue: "bg-blue-500 text-white shadow-lg shadow-blue-500/20",
        yellow: "bg-yellow-500 text-white shadow-lg shadow-yellow-500/20",
        green: "bg-green-500 text-white shadow-lg shadow-green-500/20",
        red: "bg-red-500 text-white shadow-lg shadow-red-500/20",
      };
      return `${baseClasses} ${activeClasses[filterColor as keyof typeof activeClasses] || activeClasses.all}`;
    }

    return `${baseClasses} bg-[#001e1d] text-[#abd1c6] border border-[#abd1c6]/20 hover:border-[#abd1c6]/40 hover:bg-[#002724]`;
  };

  return (
    <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-[#001e1d]/40 to-[#002724]/40 border border-[#abd1c6]/10">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const Icon = filter.icon;
          return (
            <motion.button
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={getButtonClasses(filter.value, filter.color)}
            >
              <Icon size="sm" />
              {filter.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
