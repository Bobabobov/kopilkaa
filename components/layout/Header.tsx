// components/layout/Header.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ui/ThemeToggle";
import NavAuth from "@/app/_parts/NavAuth";
import type { Route } from "next"; // ✅ важно: тип для typed routes

const links: { href: Route; label: string }[] = [
  { href: "/", label: "Главная" },
  { href: "/stories", label: "Истории" }, // публичные истории
  { href: "/applications", label: "Заявка" },
  { href: "/profile", label: "Профиль" },
  // Админку показывает NavAuth, если роль ADMIN
];

export default function Header() {
  const pathname = usePathname();

  // корректная подсветка активного пункта (учитывает вложенные маршруты)
  const isActive = (href: Route) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-black/20 border-b border-black/5 dark:border-white/10">
      <div className="container-p mx-auto flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image src="/logo.svg" alt="Копилка" width={28} height={28} className="rounded" />
          <span>Копилка</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href} // ✅ теперь тип Route — ок
              className={cn(
                "px-3 py-2 rounded-xl text-sm transition hover:bg-black/5 dark:hover:bg-white/10",
                isActive(l.href) && "bg-black/5 dark:bg-white/10 font-medium"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <NavAuth />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
