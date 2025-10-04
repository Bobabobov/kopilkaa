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
            className="group relative px-8 py-4 text-lg font-bold transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer"
            style={{ 
              background: 'linear-gradient(45deg, #00ffff 0%, #ff00ff 50%, #ffff00 100%)',
              color: '#000000',
              boxShadow: '0 0 20px #00ffff, 0 0 40px #ff00ff, inset 0 0 20px rgba(255, 255, 255, 0.3)',
              textShadow: '0 0 10px #ffffff',
              borderRadius: '8px',
              border: '2px solid #ffffff',
              fontFamily: 'monospace',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              filter: 'brightness(1.2) contrast(1.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(45deg, #00ffff 0%, #ff00ff 30%, #ffff00 60%, #ff00ff 100%)';
              e.currentTarget.style.boxShadow = '0 0 30px #00ffff, 0 0 60px #ff00ff, 0 0 90px #ffff00, inset 0 0 30px rgba(255, 255, 255, 0.5)';
              e.currentTarget.style.filter = 'brightness(1.4) contrast(1.2) saturate(1.3)';
              e.currentTarget.style.textShadow = '0 0 15px #ffffff, 0 0 25px #00ffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(45deg, #00ffff 0%, #ff00ff 50%, #ffff00 100%)';
              e.currentTarget.style.boxShadow = '0 0 20px #00ffff, 0 0 40px #ff00ff, inset 0 0 20px rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.filter = 'brightness(1.2) contrast(1.1)';
              e.currentTarget.style.textShadow = '0 0 10px #ffffff';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.95)';
              e.currentTarget.style.filter = 'brightness(1.0) contrast(1.0)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.filter = 'brightness(1.4) contrast(1.2) saturate(1.3)';
            }}
          >
            <span className="relative z-10" style={{ 
              background: 'linear-gradient(45deg, #00ffff, #ff00ff, #ffff00)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Создать заявку
            </span>
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(45deg, #00ffff 0%, #ff00ff 25%, #ffff00 50%, #ff00ff 75%, #00ffff 100%)',
                borderRadius: '6px',
                filter: 'blur(2px)',
                animation: 'rainbow-pulse 2s ease-in-out infinite alternate'
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