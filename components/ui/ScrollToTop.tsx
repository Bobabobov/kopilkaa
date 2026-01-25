"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isNearFooter, setIsNearFooter] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Расстояние до конца страницы
      const distanceToBottom = documentHeight - (scrollTop + windowHeight);

      // Определяем, близко ли к футеру (менее 250px) - для изменения позиции
      const nearFooter = distanceToBottom < 250;
      setIsNearFooter(nearFooter);

      // Показываем кнопку если прокрутили больше 300px от верха
      // НЕ скрываем при приближении к футеру - кнопка должна быть доступна всегда
      if (scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    toggleVisibility();

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, x: 30, scale: 0.8 }}
          animate={{
            opacity: 1,
            x: 0,
            scale: 1,
          }}
          exit={{ opacity: 0, x: 30, scale: 0.8 }}
          whileHover={{
            scale: 1.08,
            y: -2,
            transition: { duration: 0.2 },
          }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          className={`fixed right-3 xs:right-4 sm:right-5 md:right-6 lg:right-8 xl:right-10 z-40 flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 px-2.5 py-2 xs:px-3 xs:py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#001e1d] via-[#003c3a] to-[#001e1d] backdrop-blur-lg border border-[#abd1c6]/30 hover:border-[#f9bc60]/60 shadow-xl hover:shadow-2xl hover:shadow-[#f9bc60]/20 transition-all duration-300 group overflow-hidden ${
            isNearFooter
              ? "bottom-32 xs:bottom-36 sm:bottom-40 md:bottom-44 lg:bottom-16 xl:bottom-20"
              : "bottom-20 xs:bottom-24 sm:bottom-28 md:bottom-32 lg:bottom-8 xl:bottom-10"
          }`}
          aria-label="Прокрутить наверх"
          title="Наверх"
        >
          {/* Декоративный градиент при hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-[#f9bc60]/10 via-transparent to-[#abd1c6]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={false}
          />

          {/* Иконка стрелки */}
          <motion.div
            animate={{
              y: [0, -3, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative z-10"
          >
            <svg
              className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 text-[#abd1c6] group-hover:text-[#f9bc60] transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.div>

          {/* Текст - скрыт на очень маленьких экранах, виден на sm+ */}
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            className="text-[10px] xs:text-xs sm:text-sm md:text-base font-semibold text-[#abd1c6] group-hover:text-[#f9bc60] transition-colors duration-300 hidden xs:inline-block relative z-10 whitespace-nowrap"
          >
            Наверх
          </motion.span>

          {/* Свечение при hover */}
          <motion.div
            className="absolute inset-0 rounded-xl sm:rounded-2xl bg-[#f9bc60]/0 group-hover:bg-[#f9bc60]/5 blur-xl transition-all duration-300"
            initial={false}
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
