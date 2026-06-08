"use client";

import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { cn } from "@/lib/utils";
import { storiesGlassPill } from "@/app/stories/_components/stories-ui/glassStyles";

export default function StoryNavigation() {
  return (
    <nav
      className="mb-5 sm:mb-6 flex items-center"
      aria-label="Навигация по истории"
    >
      <Link
        href="/stories"
        className={cn(
          storiesGlassPill,
          "font-semibold text-[#fffffe]",
          "transition-colors hover:border-[#f9bc60]/35 hover:bg-[#f9bc60]/10 hover:text-[#f9bc60]",
        )}
      >
        <LucideIcons.ArrowLeft size="sm" />
        <span className="hidden sm:inline">К списку историй</span>
        <span className="sm:hidden">Назад</span>
      </Link>
    </nav>
  );
}
