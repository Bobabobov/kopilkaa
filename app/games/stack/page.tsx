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
      
      {/* Фиксированная шапка */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-700/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            href="/games"
            className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors"
          >
            ← Вернуться к играм
          </Link>
          
          <h1 className="text-xl font-bold text-white">
            🎯 Stack Game
          </h1>
          
          <div className="w-24"></div> {/* Для центрирования заголовка */}
        </div>
      </div>

      {/* Игра на всю страницу */}
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-6xl px-4">
          <StackGame />
        </div>
      </div>
    </div>
    </div>
  );
}
