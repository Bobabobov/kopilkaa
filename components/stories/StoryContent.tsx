// components/stories/StoryContent.tsx
"use client";

import { motion } from "framer-motion";

interface StoryContentProps {
  story: {
    story?: string;
    summary?: string;
  };
}

export default function StoryContent({ story }: StoryContentProps) {
  return (
    <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/30 dark:border-gray-700/30 mb-8 overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-xl"></div>
      
      <div className="relative z-10">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere text-lg">
            {story.story || story.summary || 'Текст истории недоступен.'}
          </div>
        </div>
      </div>
    </div>
  );
}