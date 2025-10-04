// components/stories/StoryNavigation.tsx
"use client";

import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";

export default function StoryNavigation() {
  return (
    <div className="mb-8">
      <Link
        href="/stories"
        className="inline-flex items-center text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
      >
        <LucideIcons.ArrowLeft size="sm" className="mr-2" />
        Вернуться к историям
      </Link>
    </div>
  );
}