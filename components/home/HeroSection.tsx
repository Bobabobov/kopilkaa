"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { useBulldog } from "@/lib/useBulldog";

type Stats = {
  collected: number;
  requests: number;
  approved: number;
  people: number;
};

interface HeroSectionProps {
  stats: Stats;
  loading: boolean;
}

export default function HeroSection({ stats, loading }: HeroSectionProps) {
  const { state, handleClick, message } = useBulldog();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16">
      <div className="text-center max-w-4xl mx-auto">
        {/* Основной заголовок */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ color: '#fffffe' }}>
          Помогаем людям
          <br />
          <span style={{ color: '#f9bc60' }}>найти поддержку</span>
        </h1>
        
        {/* Описание */}
        <p className="text-xl md:text-2xl mb-8 leading-relaxed" style={{ color: '#abd1c6' }}>
          Безопасная платформа для сбора помощи. Создавайте заявки, делитесь историями и находите поддержку сообщества.
        </p>
        {/* Кнопки */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link 
            href="/applications"
            className="px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105"
            style={{ 
              backgroundColor: '#f9bc60',
              color: '#001e1d'
            }}
          >
            Создать заявку
          </Link>
          
          <Link 
            href="/stories"
            className="px-8 py-4 text-lg font-semibold rounded-lg border-2 transition-all duration-200 hover:scale-105"
            style={{ 
              borderColor: '#abd1c6',
              color: '#abd1c6'
            }}
          >
            Читать истории
          </Link>
        </div>

        {/* Статистика платформы */}
        <div className="max-w-2xl mx-auto animate-fade-in-up">
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#fffffe' }}>
            Статистика платформы
          </h2>
          
          {/* Основная сумма */}
          <div className="mb-8">
            <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: '#f9bc60' }}>
              ₽ {loading ? "0" : stats.collected.toLocaleString()}
            </div>
            <p className="text-lg" style={{ color: '#abd1c6' }}>
              Собрано для помощи
            </p>
          </div>
          
          {/* Компактная статистика */}
          <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold mb-1" style={{ color: '#fffffe' }}>
                {loading ? "0" : stats.requests}
              </div>
              <div className="text-sm" style={{ color: '#abd1c6' }}>
                Заявок
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold mb-1" style={{ color: '#fffffe' }}>
                {loading ? "0" : stats.approved}
              </div>
              <div className="text-sm" style={{ color: '#abd1c6' }}>
                Одобрено
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold mb-1" style={{ color: '#fffffe' }}>
                {loading ? "0" : stats.people}
              </div>
              <div className="text-sm" style={{ color: '#abd1c6' }}>
                Помогли
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}