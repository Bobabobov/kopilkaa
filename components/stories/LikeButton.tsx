// components/stories/LikeButton.tsx
"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface LikeButtonProps {
  liked: boolean;
  likesCount: number;
  onLike: (e?: React.MouseEvent) => void;
  isAuthenticated?: boolean | null;
  isLiking?: boolean;
  /** "dark" — страница истории (тёмный фон), "light" — карточка на /stories */
  variant?: "dark" | "light";
}

function LikeButtonComponent({
  liked,
  likesCount,
  onLike,
  isAuthenticated,
  isLiking = false,
  variant = "dark",
}: LikeButtonProps) {
  const [playPop, setPlayPop] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onLike(e);
    },
    [onLike],
  );

  // Анимация «pop» один раз при переходе в состояние «лайк поставлен»
  useEffect(() => {
    if (liked && !isLiking) {
      setPlayPop(true);
      const t = setTimeout(() => setPlayPop(false), 480);
      return () => clearTimeout(t);
    }
  }, [liked, isLiking]);

  const disabled = isLiking || isAuthenticated === false;
  const showPop = playPop && liked;

  const baseClasses =
    "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-300 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f9bc60]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#001e1d]";
  const disabledClasses =
    "cursor-not-allowed opacity-60 border-[#abd1c6]/20 bg-[#001e1d]/30 text-[#abd1c6]/70";
  const likedClasses =
    "cursor-pointer border-[#e16162]/60 bg-[#e16162]/20 text-[#e16162] shadow-[0_0_0_1px_rgba(225,97,98,0.2)] hover:bg-[#e16162]/30 hover:border-[#e16162]/70 hover:shadow-[0_4px_16px_rgba(225,97,98,0.25)] active:scale-95";
  const unlikedDarkClasses =
    "cursor-pointer border-[#abd1c6]/30 bg-[#001e1d]/40 text-[#abd1c6] hover:border-[#e16162]/50 hover:bg-[#e16162]/10 hover:text-[#e16162] active:scale-95";
  const unlikedLightClasses =
    "cursor-pointer border-[#abd1c6]/40 bg-white/40 text-[#2d5a4e] hover:border-[#e16162]/50 hover:bg-[#e16162]/10 hover:text-[#e16162] active:scale-95";

  const stateClasses = disabled
    ? disabledClasses
    : liked
      ? likedClasses
      : variant === "light"
        ? unlikedLightClasses
        : unlikedDarkClasses;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-pressed={liked}
      aria-label={liked ? "Убрать лайк" : "Поставить лайк"}
      title={
        isAuthenticated === false
          ? "Войдите в систему, чтобы ставить лайки"
          : liked
            ? "Убрать лайк"
            : "Поставить лайк"
      }
      className={`${baseClasses} ${stateClasses} ${variant === "light" ? "focus-visible:ring-offset-white" : ""}`}
    >
      {isLiking ? (
        <LucideIcons.Loader2
          size="sm"
          className="text-[#e16162] animate-spin shrink-0"
          aria-hidden
        />
      ) : (
        <span
          className={`inline-flex shrink-0 transition-transform duration-200 ${showPop ? "animate-heart-pop" : ""}`}
        >
          <LucideIcons.Heart
            size="sm"
            className={liked ? "fill-[#e16162] text-[#e16162]" : "text-current"}
            aria-hidden
          />
        </span>
      )}
      <span className="tabular-nums">{likesCount}</span>
    </button>
  );
}

export default memo(LikeButtonComponent);
