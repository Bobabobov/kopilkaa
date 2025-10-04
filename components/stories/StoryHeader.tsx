// components/stories/StoryHeader.tsx
"use client";

import { motion } from "framer-motion";

interface StoryHeaderProps {
  title: string;
}

export default function StoryHeader({ title }: StoryHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
        {title}
      </h1>
      
      {/* Декоративная линия */}
      <div className="mt-4 h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full w-full">
      </div>
    </div>
  );
}