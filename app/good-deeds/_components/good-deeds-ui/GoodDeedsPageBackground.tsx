"use client";

import { useMobileReducedMotion } from "@/components/home/how-it-works/useMobileReducedMotion";
import { cn } from "@/lib/utils";

export function GoodDeedsPageBackground() {
  const lite = useMobileReducedMotion();

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div
        className={cn(
          "absolute -left-[18%] top-[6%] rounded-full bg-[#f9bc60]/[0.08]",
          lite
            ? "h-[240px] w-[240px] bg-[#f9bc60]/12"
            : "h-[400px] w-[400px] blur-[100px]",
        )}
      />
      <div
        className={cn(
          "absolute -right-[12%] top-[20%] rounded-full bg-[#abd1c6]/[0.07]",
          lite
            ? "h-[200px] w-[200px] bg-[#abd1c6]/12"
            : "h-[360px] w-[360px] blur-[90px]",
        )}
      />
      <div
        className={cn(
          "absolute left-[25%] bottom-[8%] rounded-full",
          lite
            ? "h-[180px] w-[180px] bg-[#004643]/90"
            : "h-[300px] w-[300px] bg-[#004643]/75 blur-[80px]",
        )}
      />
      {!lite && (
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #fffffe 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
      )}
    </div>
  );
}
