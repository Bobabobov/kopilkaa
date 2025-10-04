// components/stories/StoryActions.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

export default function StoryActions() {
  return (
    <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
      <div>
        <Link
          href="/stories"
          className="inline-flex items-center px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-2xl transition-all duration-300 border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl group"
        >
          <LucideIcons.BookOpen size="md" className="mr-3 group-hover:rotate-12 transition-transform duration-300" />
          Все истории
        </Link>
      </div>
      
      <div>
        <Link
          href="/applications"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
        >
          <LucideIcons.Plus size="md" className="mr-3 group-hover:rotate-90 transition-transform duration-300" />
          Подать заявку
        </Link>
      </div>
    </div>
  );
}