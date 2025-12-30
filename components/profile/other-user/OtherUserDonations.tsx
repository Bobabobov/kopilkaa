"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface Donation {
  id: string;
  amount: number;
  comment?: string | null;
  createdAt: string;
}

interface DonationsStats {
  totalDonated: number;
  donationsCount: number;
  recentDonated: number;
  recentCount: number;
}

interface DonationsData {
  donations: Donation[];
  stats: DonationsStats;
}

interface OtherUserDonationsProps {
  userId: string;
}

export default function OtherUserDonations({ userId }: OtherUserDonationsProps) {
  const [data, setData] = useState<DonationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatServiceLabel = (comment?: string | null) => {
    if (!comment) return null;
    const v = comment.trim();
    if (!v) return null;
    if (v === "heroes_placement") return "Размещение в «Героях»";
    return v;
  };

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/donations`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching donations:", error);
        setError(error instanceof Error ? error.message : "Failed to load donations");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [userId]);

  const formatAmount = (amount: number) => {
    const n = new Intl.NumberFormat("ru-RU", {
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace(/\u00A0/g, " ");
    return `${n} ₽`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Сегодня";
    if (diffDays === 1) return "Вчера";
    if (diffDays < 7) return `${diffDays} дн. назад`;
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
    });
  };

  if (loading) {
    return (
      <div className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6 min-h-[280px]">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#abd1c6]/20 rounded-lg"></div>
              <div className="h-6 bg-[#abd1c6]/20 rounded w-32"></div>
            </div>
            <div className="h-6 bg-[#abd1c6]/20 rounded w-16"></div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 p-4 bg-[#001e1d]/20 rounded-xl">
            <div className="h-20 bg-[#abd1c6]/10 rounded-lg"></div>
            <div className="h-20 bg-[#abd1c6]/10 rounded-lg"></div>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
            <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
            <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6">
        <div className="text-center py-8">
          <LucideIcons.AlertTriangle className="text-red-400 mx-auto mb-2" size="lg" />
          <p className="text-sm text-[#abd1c6]">{error}</p>
        </div>
      </div>
    );
  }

  if (!data || data.stats.donationsCount === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 overflow-hidden"
      >
        <div className="p-4 sm:p-5 md:p-6 border-b border-[#abd1c6]/10">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#f9bc60]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <LucideIcons.CreditCard className="text-[#f9bc60]" size="sm" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-[#fffffe] truncate">Оплаты</h3>
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-5 md:p-6 text-center py-8 sm:py-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#abd1c6]/10 rounded-3xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <LucideIcons.CreditCard className="text-[#abd1c6]" size="xl" />
          </div>
          <p className="text-sm sm:text-base text-[#abd1c6] font-medium mb-1">Пока нет оплат</p>
          <p className="text-xs sm:text-sm text-[#abd1c6]/60 px-4">
            Пользователь ещё не оплачивал размещение профиля в «Героях»
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 overflow-hidden"
    >
      {/* Улучшенный заголовок */}
      <div className="p-4 sm:p-5 md:p-6 border-b border-[#abd1c6]/10 bg-gradient-to-r from-[#001e1d]/30 to-transparent">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <motion.div 
              className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#f9bc60] to-[#e8a545] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#f9bc60]/30"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 2
              }}
            >
                <LucideIcons.CreditCard className="text-[#001e1d]" size="sm" />
            </motion.div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-[#fffffe] truncate bg-gradient-to-r from-[#fffffe] to-[#f9bc60] bg-clip-text text-transparent">
                Оплаты
              </h3>
              <p className="text-[10px] sm:text-xs text-[#abd1c6] mt-0.5 font-medium">
                Всего: <span className="text-[#f9bc60] font-bold">{formatAmount(data.stats.totalDonated)}</span>
              </p>
            </div>
          </div>
          <motion.div 
            className="text-right flex-shrink-0"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-[#f9bc60] to-[#e8a545] bg-clip-text text-transparent">
              {data.stats.donationsCount}
            </div>
            <div className="text-[10px] sm:text-xs text-[#abd1c6] font-medium">платежей</div>
          </motion.div>
        </div>
      </div>

      {/* Улучшенная статистика */}
      <div className="p-4 sm:p-5 md:p-6 border-b border-[#abd1c6]/10 bg-gradient-to-br from-[#001e1d]/30 to-[#001e1d]/10">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <motion.div 
            className="text-center p-4 sm:p-5 bg-gradient-to-br from-[#001e1d]/40 to-[#001e1d]/20 rounded-xl border border-[#f9bc60]/20 shadow-lg hover:shadow-xl hover:shadow-[#f9bc60]/20 transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <div
              className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-br from-[#f9bc60] to-[#e8a545] bg-clip-text text-transparent mb-2 truncate max-w-full tabular-nums"
              title={formatAmount(data.stats.totalDonated)}
            >
              {formatAmount(data.stats.totalDonated)}
            </div>
            <div className="text-[10px] sm:text-xs text-[#abd1c6] font-medium">Всего оплачено</div>
          </motion.div>
          <motion.div 
            className="text-center p-4 sm:p-5 bg-gradient-to-br from-[#001e1d]/40 to-[#001e1d]/20 rounded-xl border border-[#abd1c6]/20 shadow-lg hover:shadow-xl transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-2xl sm:text-3xl font-bold text-[#abd1c6] mb-2">
              {data.stats.donationsCount}
            </div>
            <div className="text-[10px] sm:text-xs text-[#abd1c6] font-medium">Количество</div>
          </motion.div>
        </div>
      </div>

      {/* Список платежей */}
      {data.donations.length > 0 && (
        <div className="p-4 sm:p-5 md:p-6 space-y-2 sm:space-y-3">
          {data.donations.slice(0, 3).map((donation, index) => (
            <motion.div
              key={donation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-[#001e1d]/40 to-[#001e1d]/20 rounded-xl border border-[#abd1c6]/20 hover:border-[#f9bc60]/50 transition-all hover:shadow-lg hover:shadow-[#f9bc60]/20"
              whileHover={{ scale: 1.02, x: 5 }}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <motion.div 
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#f9bc60]/30 to-[#e8a545]/20 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                >
                  <LucideIcons.CreditCard className="text-[#f9bc60]" size="sm" />
                </motion.div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm sm:text-base font-semibold text-[#fffffe]">
                    {formatAmount(donation.amount)}
                  </div>
                  {formatServiceLabel(donation.comment) && (
                    <div className="text-xs sm:text-sm text-[#abd1c6] truncate mt-0.5">
                      {formatServiceLabel(donation.comment)}
                    </div>
                  )}
                  <div className="text-[10px] sm:text-xs text-[#abd1c6]/60 mt-1">
                    {formatDate(donation.createdAt)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

