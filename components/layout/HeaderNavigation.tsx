// components/layout/HeaderNavigation.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Route } from "next";

const links: { href: Route; label: string }[] = [
  { href: "/", label: "Главная" },
  { href: "/news", label: "Новости" },
  { href: "/stories", label: "Истории" },
  { href: "/reviews", label: "Отзывы" },
  { href: "/applications", label: "Заявка" },
  { href: "/good-deeds", label: "Добрые дела" },
  { href: "/games", label: "Игры" },
  { href: "/heroes", label: "Герои" },
  { href: "/advertising", label: "Реклама" },
];

interface HeaderNavigationProps {
  className?: string;
  onLinkClick?: () => void;
}

export default function HeaderNavigation({
  className,
  onLinkClick,
}: HeaderNavigationProps) {
  const pathname = usePathname();

  // корректная подсветка активного пункта (учитывает вложенные маршруты)
  const isActive = (href: Route) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <nav
      className={cn("flex items-center gap-2", className)}
      suppressHydrationWarning
    >
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          prefetch={true}
          onClick={onLinkClick}
          className={cn(
            "px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
            isActive(l.href) ? "shadow-lg" : "hover:shadow-md",
            // Улучшенная читаемость для мобильного меню (когда используется flex-col)
            className?.includes("flex-col") &&
              !isActive(l.href) &&
              "text-white font-semibold drop-shadow-lg",
            !className?.includes("flex-col") && "drop-shadow-md",
          )}
          style={{
            backgroundColor: isActive(l.href) ? "#f9bc60" : "transparent",
            color: isActive(l.href)
              ? "#001e1d"
              : className?.includes("flex-col")
                ? "#ffffff"
                : "#fffffe",
            textShadow:
              !isActive(l.href) && className?.includes("flex-col")
                ? "0 2px 4px rgba(0,0,0,0.7), 0 0 12px rgba(0,0,0,0.5)"
                : undefined,
          }}
          suppressHydrationWarning
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
