// components/feed/FeedFilters.tsx
"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

export type FilterType = "all" | "unread" | "like" | "achievement" | "friend_request" | "application_status";

interface FeedFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  unreadCount: number;
}

const filters: { type: FilterType; label: string; icon: keyof typeof LucideIcons }[] = [
  { type: "all", label: "Все", icon: "List" },
  { type: "unread", label: "Непрочитанные", icon: "Bell" },
  { type: "like", label: "Лайки", icon: "Heart" },
  { type: "achievement", label: "Достижения", icon: "Star" },
  { type: "friend_request", label: "Друзья", icon: "UserPlus" },
  { type: "application_status", label: "Заявки", icon: "FileText" },
];

export default function FeedFilters({ activeFilter, onFilterChange, unreadCount }: FeedFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="mb-8 sm:mb-10"
    >
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-center">
        {filters.map((filter) => {
          const Icon = LucideIcons[filter.icon];
          const isActive = activeFilter === filter.type;
          const showBadge = filter.type === "unread" && unreadCount > 0;

          return (
            <motion.button
              key={filter.type}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onFilterChange(filter.type)}
              className={`
                relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-gradient-to-r from-[#f9bc60]/30 to-[#e16162]/30 border-2 border-[#f9bc60]/50 text-[#f9bc60] shadow-lg shadow-[#f9bc60]/20'
                  : 'bg-[#001e1d]/60 border border-[#abd1c6]/20 text-[#abd1c6] hover:bg-[#001e1d]/80 hover:border-[#abd1c6]/40'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{filter.label}</span>
              {showBadge && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#f9bc60] text-[#001e1d] text-[10px] font-bold flex items-center justify-center border-2 border-[#001e1d]"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}


