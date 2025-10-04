"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import UniversalBackground from "@/components/ui/UniversalBackground";

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
        <UniversalBackground />
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
        <UniversalBackground />
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
        <UniversalBackground />
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
      <UniversalBackground />
      <div className="relative z-10">
        {/* Простая навигация */}
        <div className="p-4">
          <Link 
            href="/stories"
            className="flex items-center gap-2 transition-colors"
            style={{ color: '#f9bc60' }}
          >
            ← Вернуться к историям
          </Link>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Простой заголовок */}
            <h1 className="text-3xl font-bold mb-6" style={{ color: '#fffffe' }}>
              {story.title}
            </h1>
            
            {/* Простые метаданные */}
            <div className="flex items-center gap-6 text-sm mb-8" style={{ color: '#abd1c6' }}>
              <span>Автор: {story.user?.name || story.user?.email}</span>
              <span>Дата: {story.createdAt ? new Date(story.createdAt).toLocaleDateString('ru-RU') : 'Неизвестно'}</span>
              <span>Лайков: {likesCount}</span>
              <button 
                onClick={handleLike}
                className="px-4 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: liked ? '#f9bc60' : '#abd1c6/20',
                  color: liked ? '#001e1d' : '#abd1c6'
                }}
              >
                {liked ? '❤️' : '🤍'} {likesCount}
              </button>
            </div>
            
            {/* Простой контент */}
            <div className="rounded-lg p-6 mb-8" style={{ backgroundColor: '#fffffe/80' }}>
              <div className="leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere max-w-none" style={{ color: '#001e1d' }}>
                {story.story || story.summary || 'Текст истории недоступен.'}
              </div>
            </div>
            
            {/* Простые изображения */}
            {story.images && story.images.length > 0 && (
              <div className="space-y-4 mb-8">
                <h3 className="text-xl font-semibold" style={{ color: '#fffffe' }}>Изображения:</h3>
                {story.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.url}
                      alt={`${story.title} - изображение ${index + 1}`}
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}
            
            {/* Простые действия */}
            <div className="flex gap-4 justify-center">
              <Link
                href="/stories"
                className="px-6 py-3 rounded-lg transition-colors border-2"
                style={{ borderColor: '#abd1c6', color: '#abd1c6' }}
              >
                Все истории
              </Link>
              <Link
                href="/applications"
                className="px-6 py-3 rounded-lg transition-colors"
                style={{ backgroundColor: '#f9bc60', color: '#001e1d' }}
              >
                Подать заявку
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}