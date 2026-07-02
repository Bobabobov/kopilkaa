import type { Route } from "next";
import type { LucideIcon } from "lucide-react";
import {
  Home,
  BookOpen,
  Star,
  ClipboardList,
  HeartHandshake,
  Gamepad2,
  Flame,
  Users,
  Megaphone,
} from "lucide-react";

export interface HeaderNavLink {
  href: Route;
  label: string;
  icon: LucideIcon;
  /** Короткая подпись для узкой сетки */
  shortLabel?: string;
}

export const HEADER_NAV_LINKS: HeaderNavLink[] = [
  { href: "/", label: "Главная", shortLabel: "Главная", icon: Home },
  { href: "/stories", label: "Истории", icon: BookOpen },
  { href: "/reviews", label: "Отзывы", icon: Star },
  { href: "/applications", label: "Заявка", icon: ClipboardList },
  {
    href: "/good-deeds",
    label: "Добрые дела",
    shortLabel: "Дела",
    icon: HeartHandshake,
  },
  { href: "/games", label: "Игры", icon: Gamepad2 },
  { href: "/vyzhivanie", label: "Выживание", shortLabel: "Выжив.", icon: Flame },
  { href: "/heroes", label: "Герои", icon: Users },
  { href: "/advertising", label: "Реклама", icon: Megaphone },
];

export function isHeaderNavLinkActive(pathname: string, href: Route): boolean {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}
