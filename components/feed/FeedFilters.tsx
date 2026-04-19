// components/feed/FeedFilters.tsx
"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type FilterType =
  | "all"
  | "unread"
  | "like"
  | "friend_request"
  | "application_status"
  | "withdrawal_status";

interface FeedFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  unreadCount: number;
}

const filters: {
  type: FilterType;
  label: string;
  icon: keyof typeof LucideIcons;
}[] = [
  { type: "all", label: "Все", icon: "List" },
  { type: "unread", label: "Непрочитанные", icon: "Bell" },
  { type: "like", label: "Лайки", icon: "Heart" },
  { type: "friend_request", label: "Друзья", icon: "UserPlus" },
  { type: "application_status", label: "Заявки", icon: "FileText" },
  { type: "withdrawal_status", label: "Выплаты", icon: "Coins" },
];

export default function FeedFilters({
  activeFilter,
  onFilterChange,
  unreadCount,
}: FeedFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.35 }}
      className="mb-6 sm:mb-8"
    >
      <Tabs
        value={activeFilter}
        onValueChange={(v) => onFilterChange(v as FilterType)}
        className="w-full"
      >
        <TabsList className="w-full flex flex-wrap h-auto gap-1 p-1.5 bg-[#004643]/50 border border-[#abd1c6]/20 rounded-xl">
          {filters.map((filter) => {
            const Icon = LucideIcons[filter.icon];
            const isActive = activeFilter === filter.type;
            const showBadge = filter.type === "unread" && unreadCount > 0;

            return (
              <TabsTrigger
                key={filter.type}
                value={filter.type}
                className={cn(
                  "flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium data-[state=active]:bg-[#f9bc60]/20 data-[state=active]:text-[#f9bc60] data-[state=active]:border-[#f9bc60]/40 data-[state=active]:border",
                  !isActive && "border border-transparent",
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">{filter.label}</span>
                {showBadge && (
                  <Badge
                    variant="default"
                    className="ml-0.5 h-5 min-w-[20px] px-1.5 text-[10px] font-bold border-0"
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </motion.div>
  );
}
