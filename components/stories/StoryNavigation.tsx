// components/stories/StoryNavigation.tsx
"use client";

import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";

export default function StoryNavigation() {
  return (
    <div className="pt-24 p-4">
      <Link
        href="/stories"
        className="inline-flex items-center transition-colors"
        style={{ color: '#f9bc60' }}
      >
        <LucideIcons.ArrowLeft size="sm" className="mr-2" />
        Вернуться к историям
      </Link>
    </div>
  );
}