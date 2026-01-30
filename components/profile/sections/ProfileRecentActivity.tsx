"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { useRecentActivity } from "../hooks/useRecentActivity";
import { formatTimeAgo } from "@/lib/time";
import { RecentActivityItem } from "./RecentActivityItem";

export default function ProfileRecentActivity() {
  const { activities, loading } = useRecentActivity();

  if (loading) {
    return (
      <div className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6 min-h-[300px]">
        <div className="animate-pulse space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#abd1c6]/20 rounded-lg"></div>
            <div className="h-6 bg-[#abd1c6]/20 rounded w-1/4"></div>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
            <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
            <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
            <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 overflow-hidden">
        <div className="p-4 sm:p-5 md:p-6 border-b border-[#abd1c6]/10">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#abd1c6]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <LucideIcons.Activity className="text-[#abd1c6]" size="sm" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-[#fffffe] truncate">
                Недавняя активность
              </h3>
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-5 md:p-6 text-center py-8 sm:py-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#abd1c6]/10 rounded-3xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <LucideIcons.Activity className="text-[#abd1c6]" size="xl" />
          </div>
          <p className="text-sm sm:text-base text-[#abd1c6] font-medium mb-1">
            Нет активности
          </p>
          <p className="text-xs sm:text-sm text-[#abd1c6]/60 px-4">
            Ваши действия будут отображаться здесь
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 overflow-hidden relative"
    >
      {/* Декоративные элементы */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#abd1c6]/10 to-transparent rounded-full blur-2xl"></div>

      <div className="relative z-10">
        {/* Заголовок */}
        <div className="p-4 sm:p-5 md:p-6 border-b border-[#abd1c6]/10">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#abd1c6]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <LucideIcons.Activity className="text-[#abd1c6]" size="sm" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-[#fffffe] truncate">
                Недавняя активность
              </h3>
              <p className="text-[10px] sm:text-xs text-[#abd1c6] mt-0.5">
                Последние {activities.length} действий
              </p>
            </div>
          </div>
        </div>

        {/* Список активности */}
        <div className="p-4 xs:p-4 sm:p-5 md:p-6 space-y-2 xs:space-y-2.5 sm:space-y-3">
          {activities.map((activity, index) => (
            <RecentActivityItem
              key={activity.id}
              activity={{ ...activity, date: formatTimeAgo(activity.date) }}
              index={index}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
