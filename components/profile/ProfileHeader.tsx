"use client";

import { motion } from "framer-motion";
import { useOnlineStatus } from '@/lib/useOnlineStatus';

import { getHeaderTheme } from '@/lib/header-customization';

interface User {
  id: string;
  email: string;
  name?: string | null;
  createdAt: string;
  headerTheme?: string | null;
  lastSeen?: string | null;
}

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const theme = getHeaderTheme(user.headerTheme || 'default');
  useOnlineStatus(); // Автоматически обновляем статус
  
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
    let lastSeenText = "";
    
    if (diffInHours < 1) return { status: "offline", text: `${diffInMinutes}м назад` };
    if (diffInHours < 24) return { status: "offline", text: `${diffInHours}ч назад` };
    if (diffInHours < 48) return { status: "offline", text: "Вчера" };
    return { status: "offline", text: date.toLocaleDateString('ru-RU') };
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden backdrop-blur-xl border-b border-white/20 dark:border-gray-700/20 ${
        theme.background === 'gradient'
          ? `bg-gradient-to-br ${(theme as any).gradient}`
          : 'bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800'
      }`}
      style={theme.background === 'image' ? {
        backgroundImage: `url(${(theme as any).image})`,
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      } : {}}
    >
      {/* Enhanced background overlay */}
      {theme.background === 'image' ? (
        <div className="absolute inset-0 bg-black/20"></div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/30"></div>
      )}
      
      {/* Enhanced decorative elements with animations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-lime-400/20 to-emerald-500/20 rounded-full blur-2xl"
          animate={{ 
            scale: [1.1, 1, 1.1],
            opacity: [0.4, 0.2, 0.4]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-green-400/10 to-emerald-500/10 rounded-full blur-3xl"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
            {/* Main user info */}
            <div className="flex-1">
              <motion.h1 
                className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 ${theme.textColor} drop-shadow-lg`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Мой профиль
              </motion.h1>
              
              <motion.p 
                className={`text-lg sm:text-xl ${theme.textColor} opacity-90 mb-4`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Добро пожаловать, <span className={`font-semibold ${theme.accentColor} drop-shadow-md`}>{user.name || "Пользователь"}</span>!
              </motion.p>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                <motion.div 
                  className={`flex items-center gap-2 text-sm ${theme.textColor} opacity-80`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span>Участник с {new Date(user.createdAt).toLocaleDateString('ru-RU')}</span>
                </motion.div>
                
                <motion.div 
                  className={`flex items-center gap-2 text-sm ${theme.textColor} opacity-80`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {(() => {
                    const status = getUserStatus(user.lastSeen || null);
                    return (
                      <>
                        <div className={`w-2 h-2 rounded-full ${
                          status.status === "online" 
                            ? "bg-green-400 animate-pulse" 
                            : "bg-gray-400"
                        }`}></div>
                        <span>
                          {status.status === "online" 
                            ? status.text 
                            : `Последний вход: ${status.text}`
                          }
                        </span>
                      </>
                    );
                  })()}
                </motion.div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
}





