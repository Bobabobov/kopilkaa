"use client";

import { LucideIcons } from "@/components/ui/LucideIcons";
import type { ComponentType } from "react";

interface ProfileSectionTitleProps {
  icon: keyof typeof LucideIcons;
  title: string;
  /** Опциональный подзаголовок под заголовком */
  subtitle?: string;
  className?: string;
}

export function ProfileSectionTitle({
  icon: iconKey,
  title,
  subtitle,
  className = "",
}: ProfileSectionTitleProps) {
  const Icon = LucideIcons[iconKey] as ComponentType<{ className?: string }> | undefined;
  return (
    <div
      className={`flex items-center gap-2.5 sm:gap-3 ${className}`}
      aria-hidden
    >
      {Icon && (
        <div
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-[#f9bc60]"
          style={{ background: "rgba(249, 188, 96, 0.15)" }}
        >
          <Icon className="h-4 w-4" />
        </div>
      )}
      <div>
        <h3
          className="text-sm font-semibold uppercase tracking-wider"
          style={{ color: "#f9bc60", letterSpacing: "0.1em" }}
        >
          {title}
        </h3>
        {subtitle && (
          <p className="mt-0.5 text-xs text-[#94a1b2]">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
