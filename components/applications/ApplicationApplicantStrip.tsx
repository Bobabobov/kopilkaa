"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type Size = "sm" | "md";

type Props = {
  displayName: string;
  avatarUrl?: string | null;
  size?: Size;
  className?: string;
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
};

export function ApplicationApplicantStrip({
  displayName,
  avatarUrl,
  size = "md",
  className,
}: Props) {
  const reducedMotion = useReducedMotion();
  const safeName = displayName.trim() || "Участник";
  const initial = safeName.charAt(0).toUpperCase();

  return (
    <motion.div
      className={cn("flex items-center gap-3 min-w-0", className)}
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reducedMotion
          ? { duration: 0.01 }
          : { type: "spring", stiffness: 320, damping: 28 }
      }
      role="group"
      aria-label={`Заявку заполняет ${safeName}`}
    >
      <Avatar
        className={cn(
          sizeClasses[size],
          "shrink-0 border-2 border-[#f9bc60]/40 bg-[#001e1d]/80 shadow-[0_4px_14px_rgba(0,0,0,0.25)] ring-1 ring-white/10",
        )}
      >
        <AvatarImage src={avatarUrl || undefined} alt="" />
        <AvatarFallback
          className={cn(
            "bg-[#004643] text-[#f9bc60] font-bold",
            size === "sm" ? "text-xs" : "text-sm",
          )}
        >
          {initial}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1 text-left">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#94a1b2]">
          Заполняете вы
        </p>
        <p className="truncate text-sm font-semibold text-[#fffffe] sm:text-[15px]">
          {safeName}
        </p>
      </div>
    </motion.div>
  );
}
