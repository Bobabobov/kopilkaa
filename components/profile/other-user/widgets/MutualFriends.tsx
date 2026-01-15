// components/profile/other-user/widgets/MutualFriends.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import OtherUserFriendsModal from "../OtherUserFriendsModal";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { HeroBadge } from "@/components/ui/HeroBadge";
import type { HeroBadge as HeroBadgeType } from "@/lib/heroBadges";

type UserLite = {
  id: string;
  name?: string | null;
  email: string | null;
  avatar?: string | null;
  lastSeen?: string | null;
  heroBadge?: HeroBadgeType | null;
};

interface MutualFriendsProps {
  userId: string;
}

export default function MutualFriends({ userId }: MutualFriendsProps) {
  const [users, setUsers] = useState<UserLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Функция для определения статуса пользователя
  const getUserStatus = (lastSeen: string | null) => {
    if (!lastSeen) return { status: "offline" as const, text: "Никогда не был в сети" };
    
    const date = new Date(lastSeen);
    const now = new Date();
    
    // Проверяем валидность даты
    if (isNaN(date.getTime())) {
      return { status: "offline" as const, text: "Никогда не был в сети" };
    }
    
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    
    // Если разница отрицательная (дата в будущем) или пользователь был активен в последние 5 минут - считаем онлайн
    if (diffInMinutes < 0 || diffInMinutes < 5) {
      return { status: "online" as const, text: "Онлайн" };
    }
    
    // Иначе показываем время последнего входа
    const diffInHours = Math.floor(diffInMinutes / 60);
    
    if (diffInHours < 1) {
      return { status: "offline" as const, text: `${diffInMinutes}м назад` };
    }
    if (diffInHours < 24) {
      return { status: "offline" as const, text: `${diffInHours}ч назад` };
    }
    if (diffInHours < 48) {
      return { status: "offline" as const, text: "Вчера" };
    }
    return { status: "offline" as const, text: date.toLocaleDateString("ru-RU") };
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/users/${userId}/friends`);
        if (res.ok) {
          const data = await res.json();
          setUsers(data.friends || []);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-white/3 backdrop-blur-xl shadow-lg p-4 sm:p-5 min-h-[200px]"
      >
        <div className="animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl" />
              <div className="space-y-2">
                <div className="h-4 bg-white/10 rounded w-24" />
                <div className="h-3 bg-white/5 rounded w-16" />
              </div>
            </div>
            <div className="w-10 h-6 bg-white/10 rounded-full" />
          </div>
          <div className="space-y-2.5">
            <div className="h-14 bg-white/5 rounded-xl" />
            <div className="h-14 bg-white/5 rounded-xl" />
          </div>
        </div>
      </motion.div>
    );
  }

  if (users.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-white/3 backdrop-blur-xl shadow-lg"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#f9bc60]/10 blur-3xl rounded-full" />
        </div>
        <div className="relative z-10 p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f9bc60]/20 to-[#f9bc60]/10 border-2 border-[#f9bc60]/40 flex items-center justify-center">
              <LucideIcons.Users className="w-5 h-5 text-[#f9bc60]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Друзья</h3>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
              <LucideIcons.Users className="w-8 h-8 text-white/40" />
            </div>
            <p className="text-sm font-medium text-white/80 mb-1">Пока нет друзей</p>
            <p className="text-xs text-white/60">У пользователя пока нет друзей</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-white/3 backdrop-blur-xl shadow-lg"
    >
      {/* Подсветки */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#f9bc60]/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-[#abd1c6]/10 blur-2xl rounded-full" />
      </div>

      <div className="relative z-10 p-4 sm:p-5 flex flex-col">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f9bc60]/20 to-[#f9bc60]/10 border-2 border-[#f9bc60]/40 flex items-center justify-center shadow-lg">
              <LucideIcons.Users className="w-5 h-5 text-[#f9bc60]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Друзья</h3>
              <p className="text-xs text-white/60 mt-0.5">
                {users.length === 1 ? "1 друг" : `${users.length} друзей`}
              </p>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-[#f9bc60]/15 border border-[#f9bc60]/30">
            <span className="text-sm font-bold text-[#f9bc60]">{users.length}</span>
          </div>
        </motion.div>

        {/* Friends List */}
        <div className="space-y-2.5 flex-1">
          {users.slice(0, 3).map((u, index) => {
            const status = getUserStatus(u.lastSeen || null);
            const isOnline = status.status === "online";
            
            return (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.05 }}
              >
                <Link
                  href={`/profile/${u.id}`}
                  prefetch={false}
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#f9bc60]/40 transition-all duration-200 hover:shadow-lg hover:shadow-[#f9bc60]/10"
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-white/20 group-hover:border-[#f9bc60]/50 transition-colors shadow-md">
                      <img
                        src={u.avatar || "/default-avatar.png"}
                        alt={u.name || "Пользователь"}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = "/default-avatar.png";
                        }}
                      />
                    </div>
                    {isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#10B981] rounded-full border-2 border-[#001e1d] shadow-lg" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="truncate text-sm font-semibold text-white group-hover:text-[#f9bc60] transition-colors">
                        {u.name || (u.email ? u.email.split("@")[0] : "Пользователь")}
                      </p>
                      {u.heroBadge && (
                        <HeroBadge badge={u.heroBadge} size="xs" />
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-white/60">
                      {isOnline ? (
                        <>
                          <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full" />
                          <span>Онлайн</span>
                        </>
                      ) : (
                        <>
                          <LucideIcons.Calendar className="w-3 h-3" />
                          <span>Был(а): {status.text}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  <LucideIcons.ChevronRight className="w-4 h-4 text-white/40 group-hover:text-[#f9bc60] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Show All Button */}
        {users.length > 3 && (
          <motion.button
            type="button"
            onClick={() => setIsModalOpen(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#f9bc60]/40 text-sm font-medium text-white/80 hover:text-[#f9bc60] transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>Показать всех</span>
            <span className="text-xs text-white/60">({users.length})</span>
            <LucideIcons.ArrowRight className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      <OtherUserFriendsModal
        userId={userId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </motion.div>
  );
}


