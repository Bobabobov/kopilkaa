"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

/**
 * Aceternity UI — Hover Border Gradient.
 * Готовый эффект из registry @aceternity/hover-border-gradient.
 */
export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  innerClassName,
  as: Tag = "div",
  duration = 1,
  clockwise = true,
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType;
    containerClassName?: string;
    className?: string;
    innerClassName?: string;
    duration?: number;
    clockwise?: boolean;
  } & React.HTMLAttributes<HTMLElement>
>) {
  const [hovered, setHovered] = useState(false);
  const [direction, setDirection] = useState<Direction>("TOP");

  const rotateDirection = (currentDirection: Direction): Direction => {
    const directions: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
    const currentIndex = directions.indexOf(currentDirection);
    const nextIndex = clockwise
      ? (currentIndex - 1 + directions.length) % directions.length
      : (currentIndex + 1) % directions.length;
    return directions[nextIndex];
  };

  const movingMap: Record<Direction, string> = {
    TOP: "radial-gradient(20.7% 50% at 50% 0%, #f9bc60 0%, rgba(249, 188, 96, 0) 100%)",
    LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, #f9bc60 0%, rgba(249, 188, 96, 0) 100%)",
    BOTTOM:
      "radial-gradient(20.7% 50% at 50% 100%, #f9bc60 0%, rgba(249, 188, 96, 0) 100%)",
    RIGHT:
      "radial-gradient(16.2% 41.2% at 100% 50%, #f9bc60 0%, rgba(249, 188, 96, 0) 100%)",
  };

  const highlight =
    "radial-gradient(75% 181% at 50% 50%, rgba(249, 188, 96, 0.4) 0%, rgba(255, 255, 255, 0) 100%)";

  useEffect(() => {
    if (!hovered) {
      const interval = setInterval(() => {
        setDirection((prev) => rotateDirection(prev));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  }, [hovered, duration]);

  return (
    <Tag
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex rounded-2xl content-center bg-[#001e1d]/80 border border-[#abd1c6]/20 transition-colors duration-300 hover:border-[#f9bc60]/30 focus-within:border-[#f9bc60]/40 focus-within:ring-2 focus-within:ring-[#f9bc60]/30 focus-within:ring-offset-2 focus-within:ring-offset-[#004643] items-center justify-center overflow-visible p-px w-fit outline-none",
        containerClassName
      )}
      {...props}
    >
      <div
        className={cn(
          "relative z-10 bg-[#001e1d] rounded-[calc(1rem-1px)] px-6 py-4 text-[#fffffe] font-semibold transition-colors duration-300",
          className,
          innerClassName
        )}
      >
        {children}
      </div>
      <motion.div
        className="absolute inset-0 z-0 overflow-hidden rounded-[inherit]"
        style={{ filter: "blur(2px)" }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered ? highlight : movingMap[direction],
        }}
        transition={{ ease: "easeOut", duration: duration * 0.5 }}
      />
    </Tag>
  );
}
