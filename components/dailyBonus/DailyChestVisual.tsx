"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  DAILY_CHEST_CLOSED_SRC,
  DAILY_CHEST_IMAGE_SIZE,
  DAILY_CHEST_OPEN_SRC,
} from "@/lib/dailyBonus/chestAssets";
import {
  DAILY_CHEST_OPENING_DURATION_MS,
  getChestOpenBlendFromProgress,
} from "@/lib/dailyBonus/chestAnimation";
import { cn } from "@/lib/utils";

export type DailyChestVisualState = "closed" | "opening" | "open";

const OPENING_DURATION_S = DAILY_CHEST_OPENING_DURATION_MS / 1000;

type Props = {
  state: DailyChestVisualState;
  openingProgress?: number;
  className?: string;
  glow?: boolean;
};

export function DailyChestVisual({
  state,
  openingProgress = 0,
  className,
  glow = true,
}: Props) {
  const reducedMotion = useReducedMotion();
  const isOpen = state === "open";
  const isOpening = state === "opening";
  const isClosed = state === "closed";

  const openBlend = isOpen
    ? 1
    : isOpening
      ? getChestOpenBlendFromProgress(openingProgress)
      : 0;

  const closedOpacity = 1 - openBlend;
  const openOpacity = openBlend;

  return (
    <div
      className={cn(
        "relative mx-auto aspect-square w-[6.25rem] sm:w-[8.5rem]",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-[10%] rounded-full border border-[#f9bc60]/15 bg-[radial-gradient(circle_at_50%_60%,rgba(249,188,96,0.12),transparent_65%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-[12%] bottom-[8%] h-5 rounded-[100%] bg-black/45 blur-md"
        aria-hidden
      />

      <div
        className={cn(
          "pointer-events-none absolute inset-x-[18%] bottom-[10%] h-3 rounded-[100%] blur-sm transition-colors duration-300",
          openBlend > 0.4 ? "bg-[#f9bc60]/35" : "bg-[#f9bc60]/18",
        )}
        aria-hidden
      />

      {glow ? (
        <motion.div
          className="pointer-events-none absolute inset-[8%] rounded-full blur-2xl bg-[#f9bc60]/20"
          style={{
            opacity: 0.35 + openBlend * 0.45,
            scale: 1 + openBlend * 0.1,
          }}
          aria-hidden
        />
      ) : null}

      {openBlend > 0.55 && !reducedMotion ? (
        <>
          <div
            className="pointer-events-none absolute left-1/2 top-[18%] h-24 w-1 -translate-x-1/2 rounded-full bg-gradient-to-t from-[#f9bc60]/0 via-[#f9bc60]/55 to-[#f9bc60]/0"
            style={{ opacity: (openBlend - 0.55) * 2.2 }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute left-1/2 top-[18%] h-24 w-16 -translate-x-1/2 rounded-full bg-[#f9bc60]/12 blur-xl"
            style={{ opacity: (openBlend - 0.55) * 1.8 }}
            aria-hidden
          />
        </>
      ) : null}

      <motion.div
        className="relative flex h-full w-full items-center justify-center"
        animate={
          reducedMotion
            ? undefined
            : isOpening
              ? {
                  rotate: [0, -5, 5, -4, 4, -3, 3, -2, 0],
                  scale: [1, 1.03, 1.01, 1.05, 1.02, 1.04, 1.01, 1.03, 1],
                  y: [0, -2, 0, -3, 0, -2, 0, -1, 0],
                }
              : isClosed
                ? { y: [0, -8, 0], rotate: [0, -2, 2, 0] }
                : { y: [0, -3, 0], scale: [1, 1.02, 1] }
        }
        transition={
          reducedMotion
            ? undefined
            : isOpening
              ? { duration: OPENING_DURATION_S, ease: "linear" }
              : isOpen
                ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
                : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <div className="relative h-full w-full">
          <div
            className="absolute inset-0"
            style={{
              opacity: closedOpacity,
              transform: `scale(${1 - openBlend * 0.04}) translateY(${-openBlend * 6}px) rotate(${-openBlend * 3}deg)`,
            }}
          >
            <Image
              src={DAILY_CHEST_CLOSED_SRC}
              alt=""
              width={DAILY_CHEST_IMAGE_SIZE}
              height={DAILY_CHEST_IMAGE_SIZE}
              className="h-full w-full object-contain drop-shadow-[0_14px_32px_rgba(0,0,0,0.55)]"
              priority
            />
          </div>

          <div
            className="absolute inset-0"
            style={{
              opacity: openOpacity,
              transform: `scale(${0.94 + openBlend * 0.06}) translateY(${(1 - openBlend) * 8}px)`,
            }}
          >
            <Image
              src={DAILY_CHEST_OPEN_SRC}
              alt=""
              width={DAILY_CHEST_IMAGE_SIZE}
              height={DAILY_CHEST_IMAGE_SIZE}
              className={cn(
                "h-full w-full object-contain drop-shadow-[0_14px_32px_rgba(0,0,0,0.55)]",
                openBlend > 0.5 &&
                  "drop-shadow-[0_18px_36px_rgba(249,188,96,0.28)]",
              )}
              priority
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
