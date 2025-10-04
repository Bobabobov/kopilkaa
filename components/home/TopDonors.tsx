"use client";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

export default function TopDonors() {
  const donors = [
    { name: "Анна К.", amount: "12,500", position: 1, isTop: true },
    { name: "Михаил П.", amount: "8,200", position: 2, isTop: false },
    { name: "Елена С.", amount: "6,700", position: 3, isTop: false },
    { name: "Дмитрий Л.", amount: "5,100", position: 4, isTop: false },
    { name: "Ольга М.", amount: "4,800", position: 5, isTop: false }
  ];

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <LucideIcons.Star size="lg" className="text-yellow-400" />;
      case 2:
        return <LucideIcons.Award size="md" className="text-gray-300" />;
      case 3:
        return <LucideIcons.Medal size="md" className="text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-current">{position}</span>;
    }
  };

  const getRankBg = (position: number) => {
    switch (position) {
      case 1:
        return "bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-500 shadow-lg shadow-yellow-400/50 animate-pulse";
      case 2:
        return "bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 shadow-md shadow-gray-400/30";
      case 3:
        return "bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 shadow-md shadow-amber-500/30";
      default:
        return "bg-gradient-to-br from-green-100 via-green-200 to-emerald-200 dark:from-green-800 dark:via-green-700 dark:to-emerald-700 shadow-sm";
    }
  };

  const getRankBorder = (position: number) => {
    switch (position) {
      case 1:
        return "border-2 border-yellow-300 dark:border-yellow-600";
      case 2:
        return "border-2 border-gray-300 dark:border-gray-600";
      case 3:
        return "border-2 border-amber-300 dark:border-amber-600";
      default:
        return "border border-green-300 dark:border-green-600";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="xl:order-3 order-3"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="text-center mb-10 relative"
      >
        
        <div className="relative group" data-sal="slide-left" data-sal-delay="200">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#6B9071] to-[#375534] rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
          <div className="relative bg-gradient-to-r from-[#E3EED4]/80 to-[#AEC3B0]/80 dark:from-[#0F2A1D]/80 dark:to-[#375534]/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
            <div className="flex items-center justify-center gap-3 mb-3">
            <LucideIcons.Star size="lg" className="text-yellow-500 animate-pulse" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#0F2A1D] to-[#375534] bg-clip-text text-transparent">
              Топ-донатеры
            </h2>
            <LucideIcons.Star size="lg" className="text-yellow-500 animate-pulse" />
          </div>
          <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">
            🏆 Наши самые щедрые помощники 🏆
          </p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-4 max-w-sm mx-auto">
        {donors.map((donor, index) => (
          <motion.div
            key={donor.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            data-sal="slide-up"
            data-sal-delay={300 + index * 100}
            whileHover={{ 
              scale: 1.03, 
              y: -4,
              boxShadow: donor.isTop 
                ? "0 20px 40px rgba(245, 158, 11, 0.3)" 
                : "0 15px 30px rgba(0,0,0,0.15)"
            }}
            whileTap={{ scale: 0.97 }}
            className={`group relative overflow-hidden rounded-2xl transition-all duration-500 cursor-pointer ${
              donor.isTop
                ? "bg-gradient-to-r from-[#E3EED4]/90 via-[#AEC3B0]/90 to-[#E3EED4]/90 dark:from-[#0F2A1D]/90 dark:via-[#375534]/90 dark:to-[#0F2A1D]/90 backdrop-blur-md border border-white/30 dark:border-white/20 shadow-2xl hover:shadow-3xl"
                : "bg-gradient-to-r from-white/80 via-gray-50/80 to-white/80 dark:from-slate-800/80 dark:via-slate-700/80 dark:to-slate-800/80 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-xl hover:shadow-2xl hover:border-white/30 dark:hover:border-white/20"
            }`}
          >
            
            <div className="relative p-5 flex items-center gap-4">
              <div className="flex-shrink-0 relative">
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`w-14 h-14 rounded-full ${getRankBg(donor.position)} ${getRankBorder(donor.position)} flex items-center justify-center relative ${
                    donor.isTop ? "animate-pulse" : ""
                  }`}
                >
                  {getRankIcon(donor.position)}
                  {donor.isTop && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-full animate-ping"></div>
                  )}
                </motion.div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`font-bold text-lg ${
                    donor.isTop 
                      ? "text-gray-900 dark:text-white" 
                      : "text-slate-900 dark:text-white"
                  }`}>
                    {donor.name}
                  </div>
                  {donor.isTop && (
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <LucideIcons.Star size="sm" className="text-yellow-500" />
                    </motion.div>
                  )}
                </div>
                <div className={`text-base font-bold ${
                  donor.isTop 
                    ? "text-gray-800 dark:text-gray-200" 
                    : "text-slate-600 dark:text-slate-400"
                }`}>
                  ₽{donor.amount}
                </div>
                {donor.position <= 3 && (
                  <div className={`text-xs font-medium mt-1 ${
                    donor.isTop 
                      ? "text-gray-700 dark:text-gray-300" 
                      : "text-slate-500 dark:text-slate-500"
                  }`}>
                    {donor.position === 1 ? "🥇 Лидер" : donor.position === 2 ? "🥈 Серебро" : "🥉 Бронза"}
                  </div>
                )}
              </div>

              {donor.isTop && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, type: "spring", stiffness: 300 }}
                  className="flex-shrink-0"
                >
                  <div className="px-4 py-2 rounded-full bg-gradient-to-r from-[#AEC3B0] to-[#6B9071] dark:from-[#375534] dark:to-[#6B9071] text-xs font-bold text-gray-900 dark:text-white border border-[#6B9071] dark:border-[#AEC3B0] shadow-lg">
                    👑 ЛИДЕР
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="text-center mt-10"
      >
        <div className="relative group" data-sal="slide-up" data-sal-delay="800">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#AEC3B0] to-[#6B9071] rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
          <div className="relative p-6 rounded-2xl bg-gradient-to-r from-[#E3EED4]/80 via-[#AEC3B0]/80 to-[#E3EED4]/80 dark:from-[#0F2A1D]/80 dark:via-[#375534]/80 dark:to-[#0F2A1D]/80 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
          
          <div className="relative flex items-center justify-center gap-3 mb-3">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <LucideIcons.Heart size="md" className="text-red-500" />
            </motion.div>
            <span className="text-base font-bold bg-gradient-to-r from-[#0F2A1D] to-[#375534] bg-clip-text text-transparent">
              Спасибо всем за поддержку!
            </span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <LucideIcons.Heart size="md" className="text-red-500" />
            </motion.div>
          </div>
          <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">
            💝 Каждая копейка помогает изменить чью-то жизнь 💝
          </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}





