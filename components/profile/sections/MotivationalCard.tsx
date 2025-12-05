"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

const motivationalQuotes = [
  {
    text: "Каждый маленький шаг приближает к большой цели",
    author: "Неизвестный",
    icon: "Target",
    color: "#f9bc60",
    gradient: "from-[#f9bc60] to-[#e8a545]",
  },
  {
    text: "Вместе мы сильнее! Ваша поддержка меняет жизни",
    author: "Команда Копилки",
    icon: "Heart",
    color: "#e16162",
    gradient: "from-[#e16162] to-[#d14d4e]",
  },
  {
    text: "Доброта возвращается. Продолжайте творить добро!",
    author: "Неизвестный",
    icon: "Star",
    color: "#abd1c6",
    gradient: "from-[#abd1c6] to-[#94a1b2]",
  },
  {
    text: "Каждое пожертвование — это семя надежды",
    author: "Неизвестный",
    icon: "Coins",
    color: "#f9bc60",
    gradient: "from-[#f9bc60] to-[#e8a545]",
  },
  {
    text: "Вы не просто помогаете — вы создаёте будущее",
    author: "Команда Копилки",
    icon: "Rocket",
    color: "#e16162",
    gradient: "from-[#e16162] to-[#d14d4e]",
  },
  {
    text: "Великие дела начинаются с малых поступков",
    author: "Неизвестный",
    icon: "Zap",
    color: "#f9bc60",
    gradient: "from-[#f9bc60] to-[#e8a545]",
  },
  {
    text: "Когда мы помогаем другим, мы помогаем себе",
    author: "Неизвестный",
    icon: "Users",
    color: "#abd1c6",
    gradient: "from-[#abd1c6] to-[#94a1b2]",
  },
];

export default function MotivationalCard() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  const quote = motivationalQuotes[currentQuote];
  const IconComponent = LucideIcons[quote.icon as keyof typeof LucideIcons] || LucideIcons.Star;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-[#004643] to-[#001e1d] rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6 relative overflow-hidden group"
    >
      {/* Анимированные декоративные элементы */}
      <motion.div 
        key={currentQuote}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        transition={{ duration: 0.8 }}
        className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl"
        style={{ backgroundColor: quote.color }}
      ></motion.div>
      <motion.div 
        key={`${currentQuote}-2`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#abd1c6]/20 to-transparent rounded-full blur-2xl"
      ></motion.div>
      
      {/* Дополнительные световые эффекты */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuote}
            initial={{ opacity: 0, x: -30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 30, scale: 0.95 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="space-y-4"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <motion.div 
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${quote.gradient} shadow-lg relative overflow-hidden`}
              >
                {/* Блестящий эффект на иконке */}
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatDelay: 3,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                ></motion.div>
                <IconComponent 
                  className="text-white relative z-10" 
                  size="md"
                />
              </motion.div>
              <div className="flex-1 min-w-0">
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm sm:text-base text-[#fffffe] font-medium leading-relaxed mb-2 relative"
                >
                  <span className="text-2xl text-[#abd1c6]/40 absolute -left-2 -top-1">"</span>
                  <span className="relative z-10 pl-4">{quote.text}</span>
                  <span className="text-2xl text-[#abd1c6]/40">"</span>
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-2"
                >
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#abd1c6]/30 to-transparent"></div>
                  <p className="text-xs text-[#abd1c6] font-medium whitespace-nowrap">
                    — {quote.author}
                  </p>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#abd1c6]/30 to-transparent"></div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Улучшенные индикаторы */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#abd1c6]/10">
          <div className="flex items-center gap-1.5">
            {motivationalQuotes.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuote(index)}
                className={`relative transition-all duration-300 ${
                  index === currentQuote 
                    ? 'w-8 h-2' 
                    : 'w-2 h-2 hover:w-4'
                } rounded-full ${
                  index === currentQuote 
                    ? `bg-gradient-to-r ${quote.gradient} shadow-lg` 
                    : 'bg-[#abd1c6]/30 hover:bg-[#abd1c6]/50'
                }`}
                aria-label={`Цитата ${index + 1}`}
              >
                {index === currentQuote && (
                  <motion.span
                    layoutId="activeIndicator"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
          <div className="text-xs text-[#abd1c6]/60">
            {currentQuote + 1} / {motivationalQuotes.length}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

