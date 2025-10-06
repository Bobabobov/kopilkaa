// components/stories/ReadingProgress.tsx
"use client";
import { useEffect, useState } from "react";

interface ReadingProgressProps {
  target: string; // CSS selector для элемента, за которым следим
}

export function ReadingProgress({ target }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const element = document.querySelector(target);
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementHeight = rect.height;
      const elementTop = rect.top;

      // Вычисляем прогресс на основе того, сколько элемента видно
      const visibleHeight =
        Math.min(windowHeight, elementTop + elementHeight) -
        Math.max(0, elementTop);
      const progressPercent = Math.max(
        0,
        Math.min(100, (visibleHeight / elementHeight) * 100),
      );

      setProgress(progressPercent);
    };

    const handleScroll = () => {
      requestAnimationFrame(updateProgress);
    };

    window.addEventListener("scroll", handleScroll);
    updateProgress(); // Инициализация

    return () => window.removeEventListener("scroll", handleScroll);
  }, [target]);

  return (
    <div className="fixed top-0 left-0 right-0 z-40 h-1 bg-gray-200 dark:bg-gray-700">
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
