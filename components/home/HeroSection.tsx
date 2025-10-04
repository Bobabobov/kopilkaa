"use client";
import Link from "next/link";
import { motion } from "framer-motion";

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
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-4xl mx-auto">
        {/* Основной заголовок */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ color: '#fffffe' }}>
          Помогаем людям
          <br />
          <span style={{ color: '#f9bc60' }}>найти поддержку</span>
        </h1>
        
        {/* Описание */}
        <p className="text-xl md:text-2xl mb-12 leading-relaxed" style={{ color: '#abd1c6' }}>
          Безопасная платформа для сбора помощи. Создавайте заявки, делитесь историями и находите поддержку сообщества.
        </p>
        
        {/* Кнопки */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link 
            href="/applications"
            className="group relative px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer"
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#ffffff',
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4), 0 4px 15px rgba(118, 75, 162, 0.3)',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #7c94f1 0%, #8a5cb8 100%)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.6), 0 6px 20px rgba(118, 75, 162, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.4), 0 4px 15px rgba(118, 75, 162, 0.3)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.95)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
          >
            <span className="relative z-10">Создать заявку</span>
            <div 
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(135deg, #8a9eff 0%, #9d6dd1 100%)',
                filter: 'blur(1px)'
              }}
            />
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
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
        </motion.div>
      </div>
    </div>
  );
}