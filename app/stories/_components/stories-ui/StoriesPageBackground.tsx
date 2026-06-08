"use client";

import { useMobileReducedMotion } from "@/components/home/how-it-works/useMobileReducedMotion";
import { cn } from "@/lib/utils";

export function StoriesPageBackground() {
  const lite = useMobileReducedMotion();

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div
        className={cn(
          "stories-bg-orb absolute -left-[20%] top-[8%] rounded-full bg-[#f9bc60]/[0.07]",
          lite
            ? "h-[260px] w-[260px] bg-[#f9bc60]/12"
            : "h-[420px] w-[420px] blur-[100px]",
        )}
      />
      <div
        className={cn(
          "stories-bg-orb absolute -right-[15%] top-[22%] rounded-full bg-[#abd1c6]/[0.08]",
          lite
            ? "h-[220px] w-[220px] bg-[#abd1c6]/14"
            : "h-[380px] w-[380px] blur-[90px]",
        )}
      />
      <div
        className={cn(
          "stories-bg-orb absolute left-[30%] bottom-[5%] rounded-full",
          lite
            ? "h-[200px] w-[200px] bg-[#004643]/90"
            : "h-[320px] w-[320px] bg-[#004643]/80 blur-[80px]",
        )}
      />
      {!lite && (
        <div
          className="absolute inset-0 opacity-[0.035]"
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
