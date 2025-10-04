// components/stories/StoryMetadata.tsx
"use client";

import { LucideIcons } from "@/components/ui/LucideIcons";
import LikeButton from "./LikeButton";

interface StoryMetadataProps {
  story: {
    user?: {
      name: string | null;
      email: string;
    };
    story?: string;
    createdAt?: string;
  };
  liked: boolean;
  likesCount: number;
  onLike: () => void;
}

export default function StoryMetadata({ story, liked, likesCount, onLike }: StoryMetadataProps) {
  const authorName = story.user?.name || story.user?.email?.split('@')[0] || 'Неизвестный автор';
  const readTime = Math.ceil((story.story?.length || 0) / 200);

  return (
    <div className="flex flex-wrap items-center gap-6 text-sm mb-8" style={{ color: '#abd1c6' }}>
      <span className="flex items-center gap-2">
        <LucideIcons.Clock size="sm" />
        {readTime} мин чтения
      </span>
      
      {/* Красивая анимированная кнопка лайка */}
      <LikeButton 
        liked={liked} 
        likesCount={likesCount} 
        onLike={onLike} 
      />
    </div>
  );
}
