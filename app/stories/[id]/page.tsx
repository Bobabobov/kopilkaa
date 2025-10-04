"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PixelBackground from "@/components/ui/PixelBackground";
import { 
  StoryHeader, 
  StoryContent, 
  StoryImages, 
  StoryActions, 
  StoryMetadata,
  StoryNavigation 
} from "@/components/stories";

interface Story {
  id: string;
  title: string;
  summary: string;
  story?: string;
  createdAt?: string;
  images?: Array<{ url: string; sort: number }>;
  user?: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
    hideEmail?: boolean;
  };
  _count?: {
    likes: number;
  };
  userLiked?: boolean;
}

export default function StoryPage() {
  const params = useParams();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    if (params.id) {
      const id = params.id as string;
      
      // Проверяем валидность ID - проверяем на любые недопустимые символы
      const hasInvalidChars = /[^a-zA-Z0-9]/.test(id);
      
      if (hasInvalidChars) {
        setError("Неправильный формат ID истории");
        setLoading(false);
        return;
      }
      
      // Очищаем ID от любых недопустимых символов
      const cleanId = id.replace(/[^a-zA-Z0-9]/g, "");
      
      loadStory(cleanId);
    }
  }, [params.id]);

  const loadStory = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/stories/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setStory(data);
      setLiked(data.userLiked || false);
      setLikesCount(data._count?.likes || 0);
    } catch (error) {
      console.error("Error loading story:", error);
      setError("Не удалось загрузить историю");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!story) return;

    try {
      const method = liked ? 'DELETE' : 'POST';
      const response = await fetch(`/api/stories/${story.id}/like`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Ошибка лайка:', errorData.message);
        return;
      }

      // Обновляем состояние локально
      setLiked(!liked);
      setLikesCount(prev => liked ? prev - 1 : prev + 1);
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <PixelBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-t-transparent mx-auto mb-4" style={{ borderColor: '#f9bc60' }}></div>
            <p style={{ color: '#abd1c6' }}>Загрузка истории...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <PixelBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: '#fffffe' }}>Ошибка</h1>
            <p className="mb-6" style={{ color: '#abd1c6' }}>{error}</p>
            <Link 
              href="/stories"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-colors"
              style={{ backgroundColor: '#f9bc60', color: '#001e1d' }}
            >
              ← Вернуться к историям
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen">
        <PixelBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4">📖</div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: '#fffffe' }}>История не найдена</h1>
            <p className="mb-6" style={{ color: '#abd1c6' }}>Возможно, история была удалена или не существует</p>
            <Link 
              href="/stories"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-colors"
              style={{ backgroundColor: '#f9bc60', color: '#001e1d' }}
            >
              ← Вернуться к историям
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PixelBackground />
      <div className="relative z-10">
        {/* Навигация */}
        <StoryNavigation />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Заголовок истории */}
            <StoryHeader 
              title={story.title}
              author={story.user?.name || story.user?.email || 'Неизвестный автор'}
              authorId={story.user?.id}
              authorAvatar={story.user?.avatar}
              createdAt={story.createdAt}
            />
            
            {/* Метаданные */}
            <StoryMetadata 
              story={story}
              liked={liked}
              likesCount={likesCount}
              onLike={handleLike}
            />
            
            {/* Контент */}
            <StoryContent 
              content={story.story || story.summary || 'Текст истории недоступен.'}
            />
            
            {/* Изображения */}
            {story.images && story.images.length > 0 && (
              <StoryImages 
                images={story.images}
                title={story.title}
              />
            )}
            
            {/* Действия */}
            <StoryActions />
          </div>
        </div>
      </div>
    </div>
  );
}