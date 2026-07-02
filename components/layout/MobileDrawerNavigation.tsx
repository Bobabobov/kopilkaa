"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  HEADER_NAV_LINKS,
  isHeaderNavLinkActive,
} from "@/lib/navigation/headerNavLinks";

interface MobileDrawerNavigationProps {
  onLinkClick?: () => void;
}

export function MobileDrawerNavigation({
  onLinkClick,
}: MobileDrawerNavigationProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Разделы сайта" className="w-full">
      <p className="mb-2.5 px-1 text-xs font-medium uppercase tracking-wider text-[#abd1c6]/70">
        Разделы
      </p>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        {HEADER_NAV_LINKS.map((link, index) => {
          const active = isHeaderNavLinkActive(pathname, link.href);
          const Icon = link.icon;
          const isLast = index === HEADER_NAV_LINKS.length - 1;

          return (
            <Link
              key={link.href}
              href={link.href}
              prefetch
              onClick={onLinkClick}
              className={cn(
                "flex min-h-[3rem] items-center gap-3 px-4 py-3 transition-colors active:bg-white/[0.06]",
                !isLast && "border-b border-white/[0.06]",
                active && "bg-[#f9bc60]/12",
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                  active
                    ? "bg-[#f9bc60] text-[#001e1d] shadow-[0_2px_12px_rgba(249,188,96,0.35)]"
                    : "bg-white/[0.06] text-[#abd1c6]",
                )}
              >
                <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={2.25} />
              </span>

              <span
                className={cn(
                  "min-w-0 flex-1 text-left text-[0.9375rem] font-medium leading-snug",
                  active ? "font-semibold text-[#f9bc60]" : "text-[#fffffe]",
                )}
              >
                {link.label}
              </span>

              <ChevronRight
                className={cn(
                  "h-4 w-4 shrink-0",
                  active ? "text-[#f9bc60]/80" : "text-[#abd1c6]/45",
                )}
                aria-hidden
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
