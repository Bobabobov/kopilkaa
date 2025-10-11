// components/stories/LikeButton.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface LikeButtonProps {
  liked: boolean;
  likesCount: number;
  onLike: () => void;
}

export default function LikeButton({
  liked,
  likesCount,
  onLike,
}: LikeButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAnimating(true);
    onLike();

    // Сбрасываем анимацию через 600ms
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={`relative z-10 flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 cursor-pointer ${
          liked
            ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25"
            : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700"
        }`}
      >
        {/* Сердце */}
        <div>
          <LucideIcons.Heart
            size="md"
            className={`transition-colors duration-200 ${
              liked
                ? "fill-current text-white"
                : "text-gray-500 dark:text-gray-400"
            }`}
          />
        </div>

        {/* Счетчик лайков */}
        <span
          className={`text-sm font-semibold transition-colors duration-200 ${
            liked ? "text-white" : "text-gray-600 dark:text-gray-400"
          }`}
        >
          {likesCount}
        </span>
      </button>
    </div>
  );
}
