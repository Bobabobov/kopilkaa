"use client";

import React from "react";
import Link from "next/link";

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
    Легко:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    Средне:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    Сложно: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  };

  const content = (
    <div
      className={`
      group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg 
      border border-white/20 dark:border-gray-700/20 transition-all duration-300 
      ${
        isAvailable
          ? "hover:shadow-xl hover:-translate-y-2 cursor-pointer"
          : "opacity-60 cursor-not-allowed"
      }
    `}
    >
      {/* Иконка игры */}
      <div className="text-6xl mb-4 text-center">{icon}</div>

      {/* Заголовок */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
        {title}
      </h3>

      {/* Описание */}
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 text-center leading-relaxed">
        {description}
      </p>

      {/* Метаданные */}
      <div className="flex justify-between items-center mb-4">
        <span
          className={`
          px-3 py-1 rounded-full text-xs font-medium
          ${difficultyColors[difficulty]}
        `}
        >
          {difficulty}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {category}
        </span>
      </div>

      {/* Кнопка */}
      <div className="text-center">
        {isAvailable ? (
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-200 transform group-hover:scale-105">
            Играть
            <svg
              className="w-4 h-4 ml-2"
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
          </div>
        ) : (
          <div className="inline-flex items-center px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-xl font-medium">
            Скоро
          </div>
        )}
      </div>

      {/* Индикатор доступности */}
      {isAvailable && (
        <div className="absolute top-4 right-4 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
      )}
    </div>
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
