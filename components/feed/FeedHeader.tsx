// components/feed/FeedHeader.tsx
"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface FeedHeaderProps {
  unreadCount: number;
  totalCount: number;
  onMarkAllAsRead: () => void;
  hasUnread: boolean;
}

export default function FeedHeader({ 
  unreadCount, 
  totalCount, 
  onMarkAllAsRead,
  hasUnread 
}: FeedHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-center space-y-6 mb-12 sm:mb-16 lg:mb-20"
    >
      {/* Иконка */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
        className="inline-flex items-center justify-center w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80"
      >
        <img 
          src="/kopikol.png" 
          alt="Лента" 
          className="w-full h-full object-contain"
        />
      </motion.div>

      {/* Заголовок */}
      <div className="space-y-3 sm:space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold bg-gradient-to-r from-[#fffffe] via-[#abd1c6] to-[#f9bc60] bg-clip-text text-transparent leading-tight"
        >
          Лента
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <p className="text-base sm:text-lg lg:text-xl text-[#abd1c6]/80 max-w-2xl font-light">
            Все важные события и обновления в одном месте
          </p>
          {hasUnread && (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              onClick={onMarkAllAsRead}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#f9bc60]/20 to-[#e16162]/20 border border-[#f9bc60]/30 text-sm font-medium text-[#f9bc60] hover:from-[#f9bc60]/30 hover:to-[#e16162]/30 hover:border-[#f9bc60]/50 transition-all duration-200"
            >
              <LucideIcons.CheckCircle className="w-4 h-4" />
              Пометить все как прочитанные
            </motion.button>
          )}
        </motion.div>
        {(unreadCount > 0 || totalCount > 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="flex items-center justify-center gap-4 text-sm text-[#abd1c6]/70"
          >
            {unreadCount > 0 && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f9bc60]/20 border border-[#f9bc60]/30">
                <div className="w-2 h-2 rounded-full bg-[#f9bc60]" />
                {unreadCount} непрочитанных
              </span>
            )}
            <span className="text-[#abd1c6]/50">
              Всего: {totalCount}
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}


