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

export default function ProfileDonations() {
  const [data, setData] = useState<DonationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch("/api/profile/donations", {
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
  }, []);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(amount);
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
              <LucideIcons.Heart className="text-[#f9bc60]" size="sm" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-[#fffffe] truncate">Мои пожертвования</h3>
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-5 md:p-6 text-center py-8 sm:py-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#abd1c6]/10 rounded-3xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <LucideIcons.Heart className="text-[#abd1c6]" size="xl" />
          </div>
          <p className="text-sm sm:text-base text-[#abd1c6] font-medium mb-1">Пока нет пожертвований</p>
          <p className="text-xs sm:text-sm text-[#abd1c6]/60 px-4">
            Ваша поддержка помогает другим людям
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 overflow-hidden"
    >
      {/* Заголовок */}
      <div className="p-4 sm:p-5 md:p-6 border-b border-[#abd1c6]/10">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#f9bc60]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <LucideIcons.Heart className="text-[#f9bc60]" size="sm" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-[#fffffe] truncate">Мои пожертвования</h3>
              <p className="text-[10px] sm:text-xs text-[#abd1c6] mt-0.5">
                Всего: {formatAmount(data.stats.totalDonated)}
              </p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-lg sm:text-xl font-bold text-[#f9bc60]">
              {data.stats.donationsCount}
            </div>
            <div className="text-[10px] sm:text-xs text-[#abd1c6]">пожертвований</div>
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className="p-4 xs:p-4 sm:p-5 md:p-6 border-b border-[#abd1c6]/10 bg-[#001e1d]/20">
        <div className="grid grid-cols-2 gap-2.5 xs:gap-3 sm:gap-4">
          <div className="text-center p-2.5 xs:p-3 sm:p-4 bg-[#001e1d]/30 rounded-lg border border-[#abd1c6]/10">
            <div className="text-lg xs:text-xl sm:text-2xl font-bold text-[#f9bc60] mb-0.5 xs:mb-1">
              {formatAmount(data.stats.totalDonated)}
            </div>
            <div className="text-[9px] xs:text-[10px] sm:text-xs text-[#abd1c6] leading-tight">Всего пожертвовано</div>
          </div>
          <div className="text-center p-2.5 xs:p-3 sm:p-4 bg-[#001e1d]/30 rounded-lg border border-[#abd1c6]/10">
            <div className="text-lg xs:text-xl sm:text-2xl font-bold text-[#abd1c6] mb-0.5 xs:mb-1">
              {data.stats.donationsCount}
            </div>
            <div className="text-[9px] xs:text-[10px] sm:text-xs text-[#abd1c6] leading-tight">Количество</div>
          </div>
        </div>
      </div>

      {/* Список пожертвований */}
      {data.donations.length > 0 && (
        <div className="p-4 xs:p-4 sm:p-5 md:p-6 space-y-2 xs:space-y-2.5 sm:space-y-3">
          {data.donations.slice(0, 3).map((donation, index) => (
            <motion.div
              key={donation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-2.5 xs:p-3 sm:p-4 bg-[#001e1d]/30 rounded-lg border border-[#abd1c6]/10 hover:border-[#f9bc60]/30 transition-colors"
            >
              <div className="flex items-center gap-2 xs:gap-3 min-w-0 flex-1">
                <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-[#f9bc60]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <LucideIcons.Heart className="text-[#f9bc60]" size="sm" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs xs:text-sm sm:text-base font-semibold text-[#fffffe]">
                    {formatAmount(donation.amount)}
                  </div>
                  {donation.comment && (
                    <div className="text-[10px] xs:text-xs sm:text-sm text-[#abd1c6] truncate mt-0.5">
                      {donation.comment}
                    </div>
                  )}
                  <div className="text-[9px] xs:text-[10px] sm:text-xs text-[#abd1c6]/60 mt-0.5 xs:mt-1">
                    {formatDate(donation.createdAt)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

