// components/layout/HeaderNavigation.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  HEADER_NAV_LINKS,
  isHeaderNavLinkActive,
} from "@/lib/navigation/headerNavLinks";

interface HeaderNavigationProps {
  className?: string;
  onLinkClick?: () => void;
  variant?: "header" | "drawer";
}

export default function HeaderNavigation({
  className,
  onLinkClick,
  variant = "header",
}: HeaderNavigationProps) {
  const pathname = usePathname();
  const isDrawer = variant === "drawer";
  const isMobileList = isDrawer || className?.includes("flex-col");

  return (
    <nav
      className={cn(
        "flex items-center gap-2",
        isDrawer && "flex-col items-stretch gap-1 w-full",
        className,
      )}
      suppressHydrationWarning
    >
      {HEADER_NAV_LINKS.map((l) => {
        const active = isHeaderNavLinkActive(pathname, l.href);

        return (
          <Link
            key={l.href}
            href={l.href}
            prefetch={true}
            onClick={onLinkClick}
            className={cn(
              "rounded-xl font-medium transition-all duration-200",
              isDrawer
                ? "px-3 py-2.5 text-center text-base font-semibold"
                : "px-3 sm:px-4 py-2 text-sm",
              active ? "shadow-lg" : "hover:shadow-md",
              isMobileList &&
                !active &&
                "text-white font-semibold drop-shadow-lg",
              !isMobileList && "drop-shadow-md",
              isDrawer && !active && "hover:bg-white/[0.06] active:scale-[0.99]",
            )}
            style={{
              backgroundColor: active ? "#f9bc60" : "transparent",
              color: active ? "#001e1d" : isMobileList ? "#ffffff" : "#fffffe",
              textShadow:
                !active && isMobileList
                  ? "0 2px 4px rgba(0,0,0,0.7), 0 0 12px rgba(0,0,0,0.5)"
                  : undefined,
            }}
            suppressHydrationWarning
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
