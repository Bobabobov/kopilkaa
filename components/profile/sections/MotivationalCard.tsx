"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { Separator } from "@/components/ui/separator";

const motivationalQuotes = [
  {
    text: "Каждый маленький шаг приближает к большой цели",
    author: "Неизвестный",
    icon: "Target",
    color: "#f9bc60",
    gradient: "from-[#f9bc60] to-[#e8a545]",
  },
  {
    text: "Вместе мы сильнее. Участие делает проект заметнее",
    author: "Команда Копилки",
    icon: "Heart",
    color: "#e16162",
    gradient: "from-[#e16162] to-[#d14d4e]",
  },
  {
    text: "Доброта возвращается. Продолжайте творить добро",
    author: "Неизвестный",
    icon: "Star",
    color: "#abd1c6",
    gradient: "from-[#abd1c6] to-[#94a1b2]",
  },
  {
    text: "Каждая оплата размещения — это вклад в развитие сервиса",
    author: "Неизвестный",
    icon: "Coins",
    color: "#f9bc60",
    gradient: "from-[#f9bc60] to-[#e8a545]",
  },
  {
    text: "Вы не просто участвуете — вы создаёте будущее проекта",
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
    text: "Когда мы развиваем сервис, выигрывают все",
    author: "Неизвестный",
    icon: "Users",
    color: "#abd1c6",
    gradient: "from-[#abd1c6] to-[#94a1b2]",
  },
  {
    text: "Помощь друг другу — это то, что делает нас людьми",
    author: "Неизвестный",
    icon: "Heart",
    color: "#e16162",
    gradient: "from-[#e16162] to-[#d14d4e]",
  },
  {
    text: "Одна рука помогает другой — так растёт общее дело",
    author: "Команда Копилки",
    icon: "Users",
    color: "#abd1c6",
    gradient: "from-[#abd1c6] to-[#94a1b2]",
  },
  {
    text: "Доверие зарабатывается поступками, а не словами",
    author: "Неизвестный",
    icon: "Shield",
    color: "#f9bc60",
    gradient: "from-[#f9bc60] to-[#e8a545]",
  },
  {
    text: "Поддержка в трудную минуту дороже любых подарков",
    author: "Неизвестный",
    icon: "Star",
    color: "#abd1c6",
    gradient: "from-[#abd1c6] to-[#94a1b2]",
  },
  {
    text: "Ваша история может вдохновить кого-то на первый шаг",
    author: "Команда Копилки",
    icon: "MessageCircle",
    color: "#f9bc60",
    gradient: "from-[#f9bc60] to-[#e8a545]",
  },
  {
    text: "Не размер помощи важнее, а то, что вы не прошли мимо",
    author: "Неизвестный",
    icon: "Heart",
    color: "#e16162",
    gradient: "from-[#e16162] to-[#d14d4e]",
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
  const IconComponent =
    LucideIcons[quote.icon as keyof typeof LucideIcons] || LucideIcons.Star;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-2xl border border-[#abd1c6]/20 bg-gradient-to-br from-[#004643] via-[#003533] to-[#001e1d] shadow-[0_4px_24px_-8px_rgba(0,30,29,0.5)] group"
      aria-label="Мотивационная цитата"
    >
      {/* Декоративный фон */}
      <motion.div
        key={currentQuote}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.35 }}
        transition={{ duration: 0.8 }}
        className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: quote.color }}
      />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-gradient-to-tr from-[#abd1c6]/15 to-transparent rounded-full blur-2xl pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10 pl-4 sm:pl-5 pr-4 sm:pr-5 pt-4 sm:pt-5 pb-4 sm:pb-5 md:pt-6 md:pb-6">
        {/* Блок цитаты: левая полоска в стиле blockquote (shadcn/Context7) */}
        <div
          className="relative border-l-4 border-[#f9bc60]/70 rounded-r-lg py-1 pl-4 sm:pl-5"
          style={{ borderLeftColor: quote.color }}
        >
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={currentQuote}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="space-y-4"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className={`flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${quote.gradient} shadow-md`}
                >
                  <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-white" size="md" />
                </motion.div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-sm sm:text-base md:text-lg text-[#fffffe] font-medium leading-relaxed tracking-tight">
                    {quote.text}
                  </p>
                  <footer className="mt-3 flex items-center gap-2">
                    <Separator className="h-px flex-1 max-w-[80px] bg-[#abd1c6]/25" />
                    <cite className="not-italic text-xs sm:text-sm text-[#abd1c6]/90 font-medium">
                      — {quote.author}
                    </cite>
                  </footer>
                </div>
              </div>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        {/* Пагинация и счётчик */}
        <div className="flex items-center justify-between mt-5 sm:mt-6 pt-4 border-t border-[#abd1c6]/15">
          <div className="flex items-center gap-1.5 sm:gap-2" role="tablist" aria-label="Выбор цитаты">
            {motivationalQuotes.map((_, index) => (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={index === currentQuote}
                aria-label={`Цитата ${index + 1}`}
                onClick={() => setCurrentQuote(index)}
                className={`relative rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f9bc60]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#004643] ${
                  index === currentQuote
                    ? "h-2 w-6 sm:w-8"
                    : "h-1.5 w-1.5 sm:w-2 hover:w-4"
                } ${
                  index === currentQuote
                    ? `bg-gradient-to-r ${quote.gradient} shadow-sm`
                    : "bg-[#abd1c6]/30 hover:bg-[#abd1c6]/50"
                }`}
              >
                {index === currentQuote && (
                  <motion.span
                    layoutId="motivationActive"
                    className="absolute inset-0 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  />
                )}
              </button>
            ))}
          </div>
          <span className="text-xs text-[#abd1c6]/60 tabular-nums">
            {currentQuote + 1} / {motivationalQuotes.length}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
