// components/friends/FriendCard.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { getAvatarFrame } from '@/lib/header-customization';

type User = {
  id: string;
  name?: string | null;
  email: string;
  avatar?: string | null;
  avatarFrame?: string | null;
  headerTheme?: string | null;
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

interface FriendCardProps {
  friendship: Friendship;
  otherUser: User;
  onRemove: (friendshipId: string) => void;
}

export default function FriendCard({ friendship, otherUser, onRemove }: FriendCardProps) {
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
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-lime-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-lime-500/10 to-emerald-500/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
      
      <div className="relative z-10 p-6">
        {/* Header with avatar and info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative group/avatar">
            <Link 
              href={`/profile/${otherUser.id}`}
              className="block w-16 h-16 rounded-lg overflow-hidden shadow-xl group-hover/avatar:scale-110 transition-all duration-300"
            >
              {(() => {
                const frame = getAvatarFrame(otherUser.avatarFrame || 'none');
                const frameKey = otherUser.avatarFrame || 'none';
                
                if (frame.type === 'image') {
                  // Рамка-картинка
                  return (
                    <div className="w-full h-full rounded-2xl overflow-hidden relative">
                      {/* Рамка как фон */}
                      <div
                        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat rounded-2xl"
                        style={{ backgroundImage: `url(${(frame as any).imageUrl || '/default-avatar.png'})` }}
                      />
                      {/* Аватар поверх рамки */}
                      <div className="absolute inset-1 rounded-xl overflow-hidden">
                        {otherUser.avatar ? (
                          <img
                            src={otherUser.avatar}
                            alt={otherUser.name || "Пользователь"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 via-green-500 to-lime-600 text-white font-bold text-lg">
                            {otherUser.name ? otherUser.name[0].toUpperCase() : otherUser.email[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                } else {
                  // CSS рамка (only 'none' remains now)
                  return (
                    <div className={`w-full h-full rounded-2xl flex items-center justify-center text-white font-bold text-xl ${frame.className} ${
                      otherUser.avatar ? 'bg-gray-100 dark:bg-gray-700' : 'bg-gradient-to-br from-emerald-500 via-green-500 to-lime-600'
                    }`}>
                      {otherUser.avatar ? (
                        <img
                          src={otherUser.avatar}
                          alt={otherUser.name || "Пользователь"}
                          className={`w-full h-full object-cover rounded-2xl ${frameKey === 'rainbow' ? 'rounded-2xl' : ''}`}
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center rounded-2xl ${frameKey === 'rainbow' ? 'rounded-2xl' : ''}`}>
                          {otherUser.name ? otherUser.name[0].toUpperCase() : otherUser.email[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                  );
                }
              })()}
            </Link>
          </div>
          
          <div className="flex-1 min-w-0">
            <Link 
              href={`/profile/${otherUser.id}`}
              className="block hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {otherUser.name || "Пользователь"}
                </h3>
                {(() => {
                  const status = getUserStatus(otherUser.lastSeen || null);
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
                Друг с {new Date(friendship.createdAt).toLocaleDateString('ru-RU')}
              </p>
            </Link>
          </div>
          
          {/* Status badge */}
          <div className="flex flex-col items-end gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Подтвержден
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-lime-100 dark:bg-lime-900/20 text-lime-700 dark:text-lime-300">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Друг
            </span>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-3">
          <Link
            href={`/profile/${otherUser.id}`}
            className="flex-1 px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl transition-all duration-300 hover:scale-105 font-medium backdrop-blur-sm border border-emerald-500/20 hover:border-emerald-500/40 text-center"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Профиль
            </span>
          </Link>
          <button
            onClick={() => onRemove(friendship.id)}
            className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl transition-all duration-300 hover:scale-105 font-medium backdrop-blur-sm border border-red-500/20 hover:border-red-500/40"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Удалить
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
