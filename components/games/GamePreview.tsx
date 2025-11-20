"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface GamePreviewProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  difficulty: "Легко" | "Средне" | "Сложно";
  category: string;
  isAvailable?: boolean;
}

const GamePreview: React.FC<GamePreviewProps> = ({
  title,
  description,
  icon,
  href,
  difficulty,
  category,
  isAvailable = true,
}) => {
  const difficultyColors = {
    Легко: "bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30",
    Средне: "bg-[#f9bc60]/20 text-[#f9bc60] border-[#f9bc60]/30",
    Сложно: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const content = (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`
        group relative overflow-hidden bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl 
        border border-[#abd1c6]/20 hover:border-[#abd1c6]/40 transition-all duration-500
      ${
        isAvailable
            ? "hover:shadow-3xl cursor-pointer"
          : "opacity-60 cursor-not-allowed"
      }
    `}
    >
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-[#f9bc60]/15 to-[#abd1c6]/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-to-br from-[#abd1c6]/10 to-[#f9bc60]/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500"></div>
      </div>

      <div className="relative z-10">
      {/* Иконка игры */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="text-6xl mb-5 text-center"
        >
          {icon}
        </motion.div>

      {/* Заголовок */}
        <h3 className="text-xl sm:text-2xl font-bold text-[#fffffe] mb-3 text-center group-hover:text-[#f9bc60] transition-colors duration-300">
        {title}
      </h3>

      {/* Описание */}
        <p className="text-[#abd1c6] text-sm sm:text-base mb-5 text-center leading-relaxed">
        {description}
      </p>

      {/* Метаданные */}
        <div className="flex justify-between items-center mb-6">
        <span
          className={`
            px-3 py-1.5 rounded-xl text-xs font-bold border
          ${difficultyColors[difficulty]}
        `}
        >
          {difficulty}
        </span>
          <span className="text-xs text-[#abd1c6] bg-[#001e1d]/30 px-3 py-1.5 rounded-xl border border-[#abd1c6]/10">
          {category}
        </span>
      </div>

      {/* Кнопка */}
      <div className="text-center">
        {isAvailable ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#f9bc60] to-[#e8a545] hover:from-[#e8a545] hover:to-[#f9bc60] text-[#001e1d] rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
            Играть
            <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            </motion.div>
        ) : (
            <div className="inline-flex items-center px-6 py-3 bg-[#001e1d]/50 text-[#abd1c6] rounded-xl font-medium border border-[#abd1c6]/20">
            Скоро
          </div>
        )}
      </div>

      {/* Индикатор доступности */}
      {isAvailable && (
          <div className="absolute top-4 right-4 w-3 h-3 bg-[#10B981] rounded-full animate-pulse shadow-lg shadow-[#10B981]/50"></div>
      )}
    </div>
    </motion.div>
  );

  if (isAvailable) {
    return (
      <Link href={href as any} className="block">
        {content}
      </Link>
    );
  }

  return content;
};

export default GamePreview;
