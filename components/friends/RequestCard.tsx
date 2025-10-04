// components/friends/RequestCard.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type User = {
  id: string;
  name?: string | null;
  email: string;
  avatar?: string | null;
  hideEmail?: boolean;
  createdAt: string;
  lastSeen?: string | null;
};

type Friendship = {
  id: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "BLOCKED";
  requesterId: string;
  receiverId: string;
  requester: User;
  receiver: User;
  createdAt: string;
};

interface RequestCardProps {
  friendship: Friendship;
  type: 'received' | 'sent';
  onAccept?: (friendshipId: string) => void;
  onDecline?: (friendshipId: string) => void;
}

export default function RequestCard({ friendship, type, onAccept, onDecline }: RequestCardProps) {
  const user = type === 'received' ? friendship.requester : friendship.receiver;
  const gradientClass = type === 'received' 
    ? 'from-green-500 via-teal-500 to-emerald-600'
    : 'from-lime-500 via-green-500 to-emerald-500';

  // Определяем статус пользователя
  const getUserStatus = (lastSeen: string | null) => {
    if (!lastSeen) return { status: "offline", text: "Никогда не был в сети" };
    
    const date = new Date(lastSeen);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    // Если пользователь был активен в последние 5 минут - считаем онлайн
    if (diffInMinutes <= 5) {
      return { status: "online", text: "Онлайн" };
    }
    
    // Иначе показываем время последнего входа
    const diffInHours = Math.floor(diffInMinutes / 60);
    
    if (diffInHours < 1) return { status: "offline", text: `${diffInMinutes}м назад` };
    if (diffInHours < 24) return { status: "offline", text: `${diffInHours}ч назад` };
    if (diffInHours < 48) return { status: "offline", text: "Вчера" };
    return { status: "offline", text: date.toLocaleDateString('ru-RU') };
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-200/30 dark:border-slate-700/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent dark:from-black/20 dark:via-black/10 dark:to-transparent backdrop-blur-xl hover:scale-[1.02] transition-all duration-500 shadow-lg hover:shadow-2xl"
    >
      {/* Animated background gradient */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
        type === 'received' 
          ? 'bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5'
          : 'bg-gradient-to-br from-lime-500/5 via-transparent to-green-500/5'
      }`}></div>
      
      {/* Decorative elements */}
      <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700 ${
        type === 'received' 
          ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10'
          : 'bg-gradient-to-br from-lime-500/10 to-green-500/10'
      }`}></div>
      
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative group/avatar">
            <Link 
              href={`/profile/${user.id}`}
              className={`block w-14 h-14 rounded-lg overflow-hidden shadow-xl group-hover/avatar:scale-110 transition-all duration-300`}
            >
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name || "Пользователь"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white font-bold text-lg`}>
                  {user.name ? user.name[0].toUpperCase() : (!user.hideEmail ? user.email[0].toUpperCase() : 'П')}
                </div>
              )}
            </Link>
          </div>
          
          <div className="flex-1 min-w-0">
            <Link 
              href={`/profile/${user.id}`}
              className="block hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {user.name || "Пользователь"}
                </h3>
                {(() => {
                  const status = getUserStatus(user.lastSeen || null);
                  return (
                    <div className={`w-2 h-2 rounded-full ${
                      status.status === "online" 
                        ? "bg-green-400 animate-pulse" 
                        : "bg-gray-400"
                    }`} title={status.status === "online" ? "Онлайн" : `Последний вход: ${status.text}`}></div>
                  );
                })()}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {type === 'received' 
                  ? `Отправил заявку ${new Date(friendship.createdAt).toLocaleDateString('ru-RU')}`
                  : `Заявка отправлена ${new Date(friendship.createdAt).toLocaleDateString('ru-RU')}`
                }
              </p>
            </Link>
          </div>
          
          {type === 'sent' && (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-300">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ожидает ответа
              </span>
            </div>
          )}
        </div>
        
        {type === 'received' && onAccept && onDecline && (
          <div className="flex gap-2">
            <button
              onClick={() => onAccept(friendship.id)}
              className="flex-1 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg transition-all duration-200 text-sm font-medium border border-emerald-200 dark:border-emerald-700/30 hover:border-emerald-300 dark:hover:border-emerald-600/50"
            >
              <span className="flex items-center justify-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Принять
              </span>
            </button>
            <button
              onClick={() => onDecline(friendship.id)}
              className="flex-1 px-3 py-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400 rounded-lg transition-all duration-200 text-sm font-medium border border-gray-200 dark:border-gray-600/30 hover:border-gray-300 dark:hover:border-gray-500/50"
            >
              <span className="flex items-center justify-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Отклонить
              </span>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
