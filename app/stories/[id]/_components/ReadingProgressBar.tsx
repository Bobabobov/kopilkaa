"use client";

import { useEffect, useState, useRef } from "react";

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const tickingRef = useRef(false);

  useEffect(() => {
    const updateProgress = () => {
      const winScroll = document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      setProgress(height > 0 ? (winScroll / height) * 100 : 0);
      tickingRef.current = false;
    };

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      rafRef.current = requestAnimationFrame(updateProgress);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const scale = Math.min(1, Math.max(0, progress / 100));

  return (
    <div
      className="fixed left-0 top-0 z-[60] h-0.5 sm:h-1 w-full overflow-hidden bg-[#001e1d]/40"
      role="progressbar"
      aria-label="Прогресс чтения страницы"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full w-full origin-left rounded-r-full bg-gradient-to-r from-[#f9bc60] to-[#e8a545] shadow-[0_0_8px_rgba(249,188,96,0.4)] will-change-transform"
        style={{ transform: `scaleX(${scale})` }}
      />
    </div>
  );
}
