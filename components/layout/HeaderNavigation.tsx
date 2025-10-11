// components/layout/HeaderNavigation.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Route } from "next";

const links: { href: Route; label: string }[] = [
  { href: "/", label: "Главная" },
  { href: "/stories", label: "Истории" },
  { href: "/applications", label: "Заявка" },
  { href: "/games", label: "Игры" },
  { href: "/advertising", label: "📢 Реклама" },
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
          onClick={onLinkClick}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 drop-shadow-md",
            isActive(l.href) ? "shadow-lg" : "hover:shadow-md",
          )}
          style={{
            backgroundColor: isActive(l.href) ? "#f9bc60" : "transparent",
            color: isActive(l.href) ? "#001e1d" : "#fffffe",
          }}
          suppressHydrationWarning
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
