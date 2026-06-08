import { cn } from "@/lib/utils";

/** Базовая панель «стекло» для страницы /stories */
export const storiesGlassPanel = cn(
  "relative overflow-hidden rounded-2xl",
  "border border-white/[0.12]",
  "bg-[linear-gradient(145deg,rgba(255,255,255,0.09)_0%,rgba(255,255,255,0.03)_45%,rgba(0,30,29,0.35)_100%)]",
  "backdrop-blur-2xl",
  "shadow-[0_16px_48px_-16px_rgba(0,0,0,0.55)]",
  "ring-1 ring-inset ring-white/[0.07]",
);

export const storiesGlassShine = cn(
  "pointer-events-none absolute inset-x-4 top-0 h-px",
  "bg-gradient-to-r from-transparent via-white/30 to-transparent",
);

export const storiesGlassCard = cn(
  "relative overflow-hidden rounded-2xl",
  "border border-white/[0.14]",
  "bg-[linear-gradient(160deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.04)_50%,rgba(0,70,67,0.25)_100%)]",
  "backdrop-blur-xl",
  "shadow-[0_12px_36px_-14px_rgba(0,0,0,0.5)]",
  "ring-1 ring-inset ring-white/[0.08]",
  "transition-all duration-300",
);

export const storiesGlassPill = cn(
  "inline-flex items-center gap-2 rounded-full",
  "border border-white/[0.12] bg-white/[0.06] backdrop-blur-md",
  "px-3.5 py-2 text-sm text-[#abd1c6]",
);

export const storiesGlassInput = cn(
  "w-full rounded-xl border border-white/[0.12] bg-[#001e1d]/40 backdrop-blur-md",
  "text-[#fffffe] placeholder:text-[#abd1c6]/45 text-sm",
  "py-3 pl-11 pr-10 outline-none transition-colors",
  "focus:border-[#f9bc60]/45 focus:ring-2 focus:ring-[#f9bc60]/15",
);

export const storiesGlassSelect = cn(
  "rounded-xl border border-white/[0.12] bg-[#001e1d]/50 backdrop-blur-md",
  "text-[#fffffe] text-sm font-medium py-2.5 pl-3 pr-9 appearance-none cursor-pointer",
  "focus:border-[#f9bc60]/45 focus:ring-2 focus:ring-[#f9bc60]/15 outline-none",
);
