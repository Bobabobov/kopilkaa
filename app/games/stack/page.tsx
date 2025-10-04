"use client";

import React from 'react';
import Link from 'next/link';
import UniversalBackground from "@/components/ui/UniversalBackground";
import dynamic from 'next/dynamic';
import StackLeaderboard from '@/components/games/StackGame/StackLeaderboard';

// Динамический импорт Stack Game (без SSR для избежания проблем с canvas)
const StackGame = dynamic(() => import('@/components/games/StackGame/StackGame'), {
  ssr: false,
  loading: () => <div className="text-center p-8 text-white">Загрузка игры...</div>
});

export default function StackGamePage() {
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
        <div className="w-full max-w-7xl px-4 flex flex-col lg:flex-row gap-8">
          {/* Левая колонка - пустая */}
          <div className="hidden lg:block flex-1"></div>
          
          {/* Центральная колонка - игра */}
          <div className="flex-1">
            <StackGame />
          </div>
          
          {/* Правая колонка - таблица рекордов */}
          <div className="flex-shrink-0 w-full lg:w-auto">
            <StackLeaderboard />
          </div>
        </div>
      </div>
    </div>
  );
}
