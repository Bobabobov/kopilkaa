"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface Story {
  id: string;
  title: string;
  summary: string;
  createdAt?: string;
  images?: Array<{ url: string; sort: number }>;
  user?: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
  };
  _count?: {
    likes: number;
  };
}

interface StoryCardProps {
  story: Story;
  index: number;
}

export function StoryCard({ story, index }: StoryCardProps) {
  const authorName = story.user?.name || story.user?.email?.split('@')[0] || 'Неизвестный автор';
  const mainImage = story.images?.[0]?.url || "/stories-preview.jpg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/stories/${story.id}`}>
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:-translate-y-1 h-full"
             style={{ borderColor: '#abd1c6/30' }}>
          {/* Изображение */}
          <div className="relative mb-4 rounded-xl overflow-hidden">
            <img 
              src={mainImage} 
              alt={story.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            {/* Акцентная полоса */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
          </div>
          
          {/* Контент */}
          <div className="space-y-4">
            {/* Заголовок */}
            <h3 className="text-xl font-bold transition-colors line-clamp-2" style={{ color: '#001e1d' }}>
              {story.title}
            </h3>
            
            {/* Описание */}
            <p className="text-sm leading-relaxed line-clamp-3" style={{ color: '#2d5a4e' }}>
              {story.summary}
            </p>
            
            {/* Метаданные */}
            <div className="flex items-center justify-between text-xs" style={{ color: '#2d5a4e' }}>
              <div className="flex items-center gap-4">
                {story.user?.id ? (
                  <Link 
                    href={`/profile/${story.user.id}`}
                    className="flex items-center gap-1 hover:opacity-80 transition-opacity duration-200 group/author"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="relative">
                      <img
                        src={story.user.avatar || '/default-avatar.png'}
                        alt={authorName}
                        className="w-4 h-4 rounded-full object-cover border border-white/20 group-hover/author:border-yellow-400/50 transition-colors duration-200"
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/20 to-transparent opacity-0 group-hover/author:opacity-100 transition-opacity duration-200"></div>
                    </div>
                    <span className="group-hover/author:text-yellow-400 transition-colors duration-200">
                      {authorName}
                    </span>
                  </Link>
                ) : (
                  <span className="flex items-center gap-1">
                    <img
                      src={story.user?.avatar || '/default-avatar.png'}
                      alt={authorName}
                      className="w-4 h-4 rounded-full object-cover border border-white/20"
                    />
                    {authorName}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <LucideIcons.Clock size="sm" />
                  {Math.ceil(story.summary.length / 200)} мин
                </span>
              </div>
              
              <div className="flex items-center gap-1" style={{ color: '#e16162' }}>
                <LucideIcons.Heart size="sm" />
                {story._count?.likes || 0}
              </div>
            </div>
            
            {/* Дата */}
            <div className="pt-2 border-t" style={{ borderColor: '#abd1c6/50' }}>
              <span className="text-xs" style={{ color: '#2d5a4e' }}>
                {story.createdAt ? new Date(story.createdAt).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Дата неизвестна'}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}