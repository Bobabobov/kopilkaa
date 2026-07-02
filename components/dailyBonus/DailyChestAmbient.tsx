"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type AmbientMode = "idle" | "opening" | "reward" | "empty";

type Props = {
  mode: AmbientMode;
  className?: string;
};

const SPARKLE_COUNT = 10;
const COIN_COUNT = 8;

export function DailyChestAmbient({ mode, className }: Props) {
  const reducedMotion = useReducedMotion();
  const isReward = mode === "reward";
  const isOpening = mode === "opening";
  const isActive = isReward || isOpening;

  const sparkles = useMemo(
    () =>
      Array.from({ length: SPARKLE_COUNT }, (_, index) => {
        const angle = (index / SPARKLE_COUNT) * Math.PI * 2;
        const radius = 42 + (index % 3) * 14;
        return {
          id: index,
          left: 50 + Math.cos(angle) * radius * 0.55,
          top: 50 + Math.sin(angle) * radius * 0.45,
          delay: index * 0.12,
          size: index % 2 === 0 ? 4 : 3,
        };
      }),
    [],
  );

  const coins = useMemo(
    () =>
      Array.from({ length: COIN_COUNT }, (_, index) => ({
        id: index,
        x: (index - COIN_COUNT / 2) * 18 + (index % 2 === 0 ? 8 : -8),
        delay: index * 0.06,
        rotate: index % 2 === 0 ? 18 : -14,
      })),
    [],
  );

  if (reducedMotion) {
    return (
      <div
        className={cn(
          "pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]",
          className,
        )}
        aria-hidden
      >
        <div
          className={cn(
            "absolute left-1/2 top-[38%] h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl",
            isReward ? "bg-[#f9bc60]/30" : "bg-[#f9bc60]/16",
          )}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]",
        className,
      )}
      aria-hidden
    >
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-48 bg-gradient-to-b to-transparent transition-opacity duration-500",
          isReward
            ? "from-[#f9bc60]/28 opacity-100"
            : isOpening
              ? "from-[#f9bc60]/16 opacity-90"
              : "from-[#f9bc60]/10 opacity-80",
        )}
      />

      <motion.div
        className="absolute left-1/2 top-[42%] h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f9bc60]/20 blur-3xl"
        animate={
          isActive
            ? { scale: [1, 1.25, 1.05], opacity: [0.45, 0.85, 0.55] }
            : { scale: [1, 1.08, 1], opacity: [0.35, 0.55, 0.35] }
        }
        transition={{
          duration: isOpening ? 0.7 : 2.8,
          repeat: isOpening ? 0 : Infinity,
          ease: "easeInOut",
        }}
      />

      {isOpening ? (
        <motion.div
          className="absolute left-1/2 top-[42%] h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f9bc60]/35 blur-xl"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: [0.6, 1.35, 1], opacity: [0, 0.9, 0] }}
          transition={{ duration: 0.75, ease: "easeOut" }}
        />
      ) : null}

      {sparkles.map((sparkle) => (
        <motion.span
          key={sparkle.id}
          className="absolute rounded-full bg-[#f9bc60]"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            width: sparkle.size,
            height: sparkle.size,
          }}
          animate={{
            opacity: isReward ? [0.2, 1, 0.25] : [0.15, 0.75, 0.15],
            scale: isReward ? [0.7, 1.35, 0.8] : [0.8, 1.15, 0.8],
            y: isReward ? [0, -10, 0] : [0, -6, 0],
          }}
          transition={{
            duration: isReward ? 1.4 : 2.2,
            repeat: Infinity,
            delay: sparkle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {isReward
        ? coins.map((coin) => (
            <motion.span
              key={coin.id}
              className="absolute left-1/2 top-[42%] h-3 w-3 rounded-full border border-[#f9bc60]/70 bg-gradient-to-br from-[#ffd27d] to-[#e8a545] shadow-[0_0_12px_rgba(249,188,96,0.45)]"
              initial={{ x: coin.x, y: 0, opacity: 0, scale: 0.4 }}
              animate={{
                x: coin.x * 1.6,
                y: [-4, -42 - coin.id * 4, -72],
                opacity: [0, 1, 0],
                rotate: coin.rotate,
                scale: [0.4, 1, 0.7],
              }}
              transition={{
                duration: 1.1,
                delay: 0.12 + coin.delay,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          ))
        : null}
    </div>
  );
}
