// components/stories/StoryContent.tsx
"use client";

import { motion } from "framer-motion";

interface StoryContentProps {
  content: string;
}

export default function StoryContent({ content }: StoryContentProps) {
  return (
    <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl mb-8 overflow-hidden" style={{ borderColor: '#abd1c6/30' }}>
      {/* Декоративные элементы */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-yellow-400/5 to-yellow-600/5 rounded-full blur-xl"></div>
      
      <div className="relative z-10">
        <div className="prose prose-lg max-w-none">
          <div className="leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere text-lg" style={{ color: '#001e1d' }}>
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}