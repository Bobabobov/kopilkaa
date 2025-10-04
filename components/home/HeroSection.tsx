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
            style={{ 
              display: 'inline-block',
              padding: '12px 24px',
              background: '#68b7e9',
              color: '#151729',
              border: 'none',
              borderRadius: '0px',
              fontFamily: '"Courier New", monospace',
              fontSize: '14px',
              fontWeight: 'bold',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              textDecoration: 'none',
              cursor: 'pointer',
              position: 'relative',
              imageRendering: 'pixelated',
              WebkitImageRendering: 'pixelated'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#7bc7f0';
              e.currentTarget.style.transform = 'translate(-2px, -2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#68b7e9';
              e.currentTarget.style.transform = 'translate(0px, 0px)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.background = '#5ba7d9';
              e.currentTarget.style.transform = 'translate(2px, 2px)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.background = '#7bc7f0';
              e.currentTarget.style.transform = 'translate(-2px, -2px)';
            }}
          >
            <span style={{
              position: 'relative',
              zIndex: 2,
              textShadow: '1px 1px 0px #ffffff'
            }}>
              Создать заявку
            </span>
            {/* Пиксельная тень */}
            <div style={{
              position: 'absolute',
              top: '0px',
              left: '0px',
              right: '0px',
              bottom: '0px',
              background: '#4f7e8b',
              zIndex: '-1',
              transform: 'translate(4px, 4px)'
            }} />
            {/* Пиксельная рамка */}
            <div style={{
              position: 'absolute',
              top: '0px',
              left: '0px',
              right: '0px',
              bottom: '0px',
              border: '2px solid #ffffff',
              zIndex: '1',
              boxSizing: 'border-box'
            }} />
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