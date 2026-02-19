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
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-[#abd1c6]/25 bg-[#abd1c6]/15 text-[#f9bc60]">
          <Icon className="h-4 w-4" />
        </div>
      )}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#abd1c6]/90">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-0.5 text-xs text-[#94a1b2]">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
