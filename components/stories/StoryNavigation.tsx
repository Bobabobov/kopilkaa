// components/stories/StoryNavigation.tsx
"use client";

import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";

export default function StoryNavigation() {
  return (
    <div className="pt-20 sm:pt-24 px-4">
      <Link
        href="/stories"
        className="inline-flex items-center gap-2 rounded-xl border border-[#abd1c6]/30 bg-[#001e1d]/50 px-4 py-2.5 text-sm font-semibold text-[#abd1c6] transition-all duration-300 hover:border-[#f9bc60]/50 hover:bg-[#f9bc60]/15 hover:text-[#f9bc60] hover:shadow-[0_4px_20px_rgba(249,188,96,0.15)]"
      >
        <LucideIcons.ArrowLeft size="sm" />
        Вернуться к историям
      </Link>
    </div>
  );
}
