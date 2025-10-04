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
        <div className="backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border hover:-translate-y-1 h-full"
             style={{ backgroundColor: '#fffffe/80', borderColor: '#abd1c6/20' }}>
          {/* Изображение */}
          <div className="relative mb-4 rounded-xl overflow-hidden">
            <img 
              src={mainImage} 
              alt={story.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          
          {/* Контент */}
          <div className="space-y-4">
            {/* Заголовок */}
            <h3 className="text-xl font-bold transition-colors line-clamp-2" style={{ color: '#001e1d' }}>
              {story.title}
            </h3>
            
            {/* Описание */}
            <p className="text-sm leading-relaxed line-clamp-3" style={{ color: '#abd1c6' }}>
              {story.summary}
            </p>
            
            {/* Метаданные */}
            <div className="flex items-center justify-between text-xs" style={{ color: '#abd1c6' }}>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <LucideIcons.User size="sm" />
                  {authorName}
                </span>
                <span className="flex items-center gap-1">
                  <LucideIcons.Clock size="sm" />
                  {Math.ceil(story.summary.length / 200)} мин
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <LucideIcons.Heart size="sm" />
                {story._count?.likes || 0}
              </div>
            </div>
            
            {/* Дата */}
            <div className="pt-2 border-t" style={{ borderColor: '#abd1c6/50' }}>
              <span className="text-xs" style={{ color: '#abd1c6' }}>
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