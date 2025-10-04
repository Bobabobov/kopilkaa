"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Lottie from 'lottie-react';
import UniversalBackground from "@/components/ui/UniversalBackground";
import GamePreview from "@/components/games/GamePreview";
// Импортируем анимацию из папки app
import maintenanceAnimation from '../Under Maintenance.json';

export default function GamesPage() {
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
        {/* Основной контент */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            🎮 Игры
          </h1>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
            Игры
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto">
            Попробуйте наши игры! Каждая игра поможет вам расслабиться и заработать дополнительные очки.
          </p>
          
          {/* Превью игр */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <GamePreview
                title="Stack Game"
                description="Классическая игра на точность и реакцию. Постройте как можно более высокую башню из блоков, кликая в нужный момент!"
                icon="🎯"
                href="/games/stack"
                difficulty="Средне"
                category="Аркада"
                isAvailable={false}
              />
              
              <GamePreview
                title="Memory Cards"
                description="Тренируйте память, находя пары одинаковых карт. Чем быстрее находите пары, тем больше очков получаете!"
                icon="🧠"
                href="/games/memory"
                difficulty="Легко"
                category="Память"
                isAvailable={false}
              />
              
              <GamePreview
                title="Snake Game"
                description="Классическая змейка с современной графикой. Собирайте еду, избегайте столкновений и становитесь длиннее!"
                icon="🐍"
                href="/games/snake"
                difficulty="Легко"
                category="Аркада"
                isAvailable={false}
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="/profile"
              className="bg-gradient-to-r from-pastel-mint-500 to-pastel-aqua-500 hover:from-pastel-mint-600 hover:to-pastel-aqua-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              Вернуться в профиль
            </Link>
            <Link 
              href="/applications"
              className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-xl font-semibold transition-all duration-300 border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl"
            >
              Подать заявку
            </Link>
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Разнообразие игр
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Планируем добавить различные типы игр: головоломки, аркады, стратегии
              </p>
            </div>
            
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20 text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Система достижений
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Каждая игра будет интегрирована с системой достижений и рейтингов
              </p>
            </div>
            
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20 text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Быстрая разработка
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Мы активно работаем над играми и скоро представим первые результаты
              </p>
            </div>
          </div>
        </div>

        {/* Анимация в самом низу */}
        <div className="flex justify-center">
          <Lottie 
            animationData={maintenanceAnimation}
            loop={true}
            autoplay={true}
            className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80"
          />
        </div>
      </div>
    </div>
  );
}















