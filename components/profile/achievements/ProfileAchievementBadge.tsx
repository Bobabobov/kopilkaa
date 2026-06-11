"use client";

import Image from "next/image";
import type { ComponentType } from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { isAchievementImageIcon } from "@/lib/achievements/icon";

type ProfileAchievementBadgeProps = {
  icon: string;
  name: string;
  size?: "sm" | "md" | "corner" | "showcase" | "strip" | "vitrine" | "vitrineHero";
  /** floating — только картинка/иконка, без рамки и тени */
  variant?: "default" | "floating";
  className?: string;
  showName?: boolean;
};

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-9 w-9 xs:h-10 xs:w-10",
  corner: "h-8 w-8 sm:h-9 sm:w-9",
  showcase: "h-11 w-11 sm:h-12 sm:w-12",
  strip: "h-12 w-12 sm:h-14 sm:w-14",
  vitrine: "h-11 w-11 sm:h-12 sm:w-12",
  vitrineHero: "h-14 w-14 sm:h-16 sm:w-16",
};

const imageSizes = {
  sm: "32px",
  md: "40px",
  corner: "44px",
  showcase: "64px",
  strip: "56px",
  vitrine: "48px",
  vitrineHero: "64px",
};

export function ProfileAchievementBadge({
  icon,
  name,
  size = "md",
  variant = "default",
  className = "",
  showName = false,
}: ProfileAchievementBadgeProps) {
  const boxClass = sizeClasses[size];
  const isFloating = variant === "floating";
  const isImage = isAchievementImageIcon(icon);
  const Icon = LucideIcons[icon as keyof typeof LucideIcons] as
    | ComponentType<{ className?: string }>
    | undefined;

  const shellClass = isFloating
    ? boxClass
    : `overflow-hidden rounded-lg border border-white/20 bg-black/35 shadow-[0_4px_14px_rgba(0,0,0,0.35)] backdrop-blur-sm ${boxClass}`;

  const lucideShellClass = isFloating
    ? `flex items-center justify-center text-[#f9bc60] ${boxClass}`
    : `flex h-full w-full items-center justify-center text-[#f9bc60]`;

  const floatingLucideClass =
    size === "vitrineHero" || size === "strip"
      ? "h-7 w-7 sm:h-8 sm:w-8"
      : size === "showcase" || size === "vitrine"
        ? "h-6 w-6 sm:h-7 sm:w-7"
        : size === "md" || size === "corner"
          ? "h-5 w-5"
          : "h-4 w-4";

  const badge = (
    <div
      className={`relative shrink-0 ${shellClass} ${className}`}
      aria-hidden={showName}
    >
      {isImage ? (
        <Image
          src={icon}
          alt=""
          fill
          className={isFloating ? "object-contain" : "object-contain p-0.5"}
          sizes={imageSizes[size]}
        />
      ) : Icon ? (
        <div className={lucideShellClass}>
          <Icon className={isFloating ? floatingLucideClass : "h-4 w-4"} />
        </div>
      ) : (
        <div className={lucideShellClass}>
          <LucideIcons.Trophy
            className={isFloating ? floatingLucideClass : "h-4 w-4"}
          />
        </div>
      )}
    </div>
  );

  if (!showName) {
    return badge;
  }

  return (
    <div className="flex w-[4.75rem] sm:w-[5.25rem] flex-col items-center gap-1.5">
      {badge}
      <p
        className="w-full text-center text-[10px] sm:text-[11px] font-medium leading-tight text-white line-clamp-2 [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]"
        title={name}
      >
        {name}
      </p>
    </div>
  );
}
