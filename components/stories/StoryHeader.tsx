// components/stories/StoryHeader.tsx
"use client";

import { motion } from "framer-motion";

interface StoryHeaderProps {
  title: string;
  author?: string;
  createdAt?: string;
}

export default function StoryHeader({ title, author, createdAt }: StoryHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4" style={{ color: '#fffffe' }}>
        {title}
      </h1>
      
      {/* Метаданные */}
      {(author || createdAt) && (
        <div className="flex flex-wrap items-center gap-4 text-sm mb-4" style={{ color: '#abd1c6' }}>
          {author && (
            <span className="flex items-center gap-2">
              👤 {author}
            </span>
          )}
          {createdAt && (
            <span className="flex items-center gap-2">
              📅 {new Date(createdAt).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          )}
        </div>
      )}
      
      {/* Декоративная линия */}
      <div className="mt-4 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full w-full">
      </div>
    </div>
  );
}