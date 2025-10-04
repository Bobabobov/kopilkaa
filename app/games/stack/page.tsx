"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import UniversalBackground from "@/components/ui/UniversalBackground";

// Динамический импорт Stack Game (без SSR для избежания проблем с canvas)
const StackGame = dynamic(() => import('@/components/games/StackGame/StackGame'), { 
  ssr: false,
  loading: () => <div className="text-center p-8">Загрузка игры...</div>
});

export default function StackGamePage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  // Проверка авторизации
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/profile/me', { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setIsAuthorized(true);
          } else {
            router.push('/login');
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Универсальный фон */}
      <UniversalBackground />
      
      <div className="container mx-auto px-4 pt-32 pb-8 relative z-10">
        {/* Заголовок страницы */}
        <div className="text-center mb-8">
          <Link 
            href="/games"
            className="inline-flex items-center text-green-400 hover:text-green-300 mb-4 transition-colors"
          >
            ← Вернуться к играм
          </Link>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            🎯 Stack Game
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Классическая игра на точность и реакцию. Постройте как можно более высокую башню из блоков!
          </p>
        </div>

        {/* Компонент игры */}
        <div className="max-w-4xl mx-auto">
          <StackGame />
        </div>

        {/* Дополнительная информация */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Точность
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Кликайте в нужный момент, чтобы блоки точно попадали на стопку
              </p>
            </div>
            
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20 text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Скорость
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                С каждым блоком игра становится быстрее и сложнее
              </p>
            </div>
            
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20 text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Рекорды
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Соревнуйтесь сами с собой и улучшайте свой лучший результат
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
