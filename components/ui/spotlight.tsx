"use client";

import React from "react";
import { cn } from "@/lib/utils";

type SpotlightProps = {
  className?: string;
  fill?: string;
};

/**
 * Aceternity UI — Spotlight. Центральный луч/подсветка для hero.
 */
export function Spotlight({ className, fill = "#f9bc60" }: SpotlightProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden",
        className
      )}
    >
      <div
        className="absolute h-[200%] w-[200%] animate-spotlight rounded-full opacity-0"
        style={{
          left: "50%",
          top: "50%",
          background: `radial-gradient(ellipse at center, ${fill}20 0%, ${fill}08 40%, transparent 70%)`,
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
}
