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
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="group"
    >
      <Link href={`/stories/${story.id}`}>
        <div className="bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border border-[#abd1c6]/40 hover:-translate-y-2 hover:scale-[1.02] h-full max-w-full overflow-hidden flex flex-col group-hover:border-[#f9bc60]/60"
             style={{ 
               background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 50%, rgba(249,188,96,0.1) 100%)',
               boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
             }}>
          {/* Изображение */}
          <div className="relative mb-4 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg">
            <img 
              src={mainImage} 
              alt={story.title}
              className="w-full h-52 object-cover group-hover:scale-110 transition-all duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:from-black/20 transition-all duration-500"></div>
            {/* Акцентная полоса */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#f9bc60] via-[#e8a545] to-[#f9bc60] group-hover:h-2 transition-all duration-500"></div>
            {/* Overlay эффект */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#004643]/0 to-[#004643]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          
          {/* Контент */}
          <div className="flex flex-col flex-1 min-w-0">
            {/* Заголовок */}
            <h3 className="text-xl font-bold transition-all duration-300 line-clamp-2 break-words overflow-hidden mb-3 h-16 group-hover:text-[#004643] group-hover:scale-[1.02]" style={{ color: '#001e1d' }}>
              {story.title}
            </h3>
            
            {/* Описание */}
            <p className="text-sm leading-relaxed line-clamp-3 break-words overflow-hidden flex-1 mb-4 h-20 transition-all duration-300 group-hover:text-[#2d5a4e] group-hover:scale-[1.01]" style={{ color: '#2d5a4e' }}>
              {story.summary}
            </p>
            
            {/* Метаданные */}
            <div className="bg-gradient-to-r from-[#abd1c6]/80 to-[#94c4b8]/70 rounded-2xl p-4 border-2 border-[#abd1c6]/60 shadow-lg flex-shrink-0 transition-all duration-300 group-hover:shadow-xl group-hover:border-[#f9bc60]/40 group-hover:bg-gradient-to-r group-hover:from-[#abd1c6]/90 group-hover:to-[#94c4b8]/80"
                 style={{
                   background: 'linear-gradient(135deg, rgba(171,209,198,0.8) 0%, rgba(148,196,184,0.7) 100%)'
                 }}>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  {story.user?.id ? (
                    <Link 
                      href={`/profile/${story.user.id}`}
                      className="flex items-center gap-2 hover:opacity-80 transition-all duration-300 group/author bg-white/90 rounded-xl px-3 py-2 shadow-md border border-[#abd1c6]/40 hover:shadow-lg hover:scale-105 hover:border-[#f9bc60]/60"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="relative">
                        <img
                          src={story.user.avatar || '/default-avatar.png'}
                          alt={authorName}
                          className="w-5 h-5 rounded-full object-cover border-2 border-[#abd1c6]/60 group-hover/author:border-[#f9bc60] transition-all duration-300"
                        />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#f9bc60]/30 to-transparent opacity-0 group-hover/author:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <span className="group-hover/author:text-[#004643] transition-colors duration-300 font-semibold text-[#001e1d]">
                        {authorName}
                      </span>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-md border border-emerald-300/60">
                      <img
                        src={story.user?.avatar || '/default-avatar.png'}
                        alt={authorName}
                        className="w-5 h-5 rounded-full object-cover border-2 border-emerald-400/60"
                      />
                      <span className="font-semibold text-gray-800">{authorName}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 bg-white/90 rounded-xl px-3 py-2 shadow-md border border-[#abd1c6]/40 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-[#f9bc60]/60">
                    <LucideIcons.Clock size="sm" className="text-[#004643]" />
                    <span className="font-medium text-[#001e1d]">{Math.ceil(story.summary.length / 200)} мин</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 bg-white/90 rounded-xl px-3 py-2 shadow-md border border-[#abd1c6]/40 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-[#e16162]/60" style={{ color: '#e16162' }}>
                  <LucideIcons.Heart size="sm" className="transition-transform duration-300 group-hover:scale-110" />
                  <span className="font-medium">{story._count?.likes || 0}</span>
                </div>
              </div>
            </div>
            
            {/* Дата */}
            <div className="pt-3 border-t mt-4 flex-shrink-0 transition-all duration-300 group-hover:border-[#f9bc60]/40" style={{ borderColor: '#abd1c6/50' }}>
              <span className="text-xs font-medium transition-colors duration-300 group-hover:text-[#004643]" style={{ color: '#2d5a4e' }}>
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