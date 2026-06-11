"use client";

import Image from "next/image";

type ProfileImageIconProps = {
  src: string;
  alt?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  xs: "h-5 w-5",
  sm: "h-8 w-8",
  md: "h-9 w-9 sm:h-10 sm:w-10",
  lg: "h-12 w-12",
};

const imageSizes = {
  xs: "20px",
  sm: "32px",
  md: "40px",
  lg: "48px",
};

/** Декоративная PNG-иконка без рамки — как картинки ачивок. */
export function ProfileImageIcon({
  src,
  alt = "",
  size = "md",
  className = "",
}: ProfileImageIconProps) {
  return (
    <div
      className={`relative shrink-0 drop-shadow-[0_4px_16px_rgba(249,188,96,0.35)] ${sizeClasses[size]} ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain"
        sizes={imageSizes[size]}
      />
    </div>
  );
}
