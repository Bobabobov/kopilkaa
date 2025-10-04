"use client";
import { useEffect, useRef, useState } from 'react';
import BulldogModelGLB from './BulldogModelGLB';

export default function ThreePet() {
  const [hunger, setHunger] = useState(100); // Начальный уровень сытости
  const [feedAnim, setFeedAnim] = useState(false);
  const [scale, setScale] = useState(1.0); // Размер модели

  // Функция для кормления
  const feedPet = () => {
    setHunger(prev => Math.min(100, prev + 20)); // Увеличиваем сытость на 20
    
    // Запускаем анимацию кормления
    setFeedAnim(true);
    setTimeout(() => setFeedAnim(false), 1000);
  };

  // Определяем настроение на основе голода
  const getMood = (hungerLevel: number): 'happy' | 'hungry' | 'sad' => {
    if (hungerLevel >= 70) return 'happy';
    if (hungerLevel >= 40) return 'hungry';
    return 'sad';
  };

  // Автоматическое уменьшение голода со временем
  useEffect(() => {
    const hungerInterval = setInterval(() => {
      setHunger(prev => Math.max(0, prev - 1)); // Уменьшаем голод на 1 каждые 5 секунд
    }, 5000);

    return () => clearInterval(hungerInterval);
  }, []);

  return (
    <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-lg flex items-center justify-center" style={{ backgroundColor: '#004643' }}>
      <BulldogModelGLB mood={getMood(hunger)} feedAnim={feedAnim} scale={scale} />
      
      {/* Кнопка кормления */}
      <div className="absolute bottom-4 left-4">
        <button
          onClick={feedPet}
          className="px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          style={{ 
            backgroundColor: '#f9bc60', 
            color: '#001e1d' 
          }}
        >
          🍎 Покормить
        </button>
      </div>
      
      {/* Индикатор голода */}
      <div className="absolute top-4 right-4 bg-black/50 rounded-lg p-3">
        <div className="text-white text-sm font-semibold mb-2">Сытость: {hunger}%</div>
        <div className="w-32 h-2 bg-gray-600 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-300"
            style={{ 
              width: `${hunger}%`,
              backgroundColor: hunger >= 70 ? '#8B4513' : hunger >= 40 ? '#D2691E' : '#8B0000'
            }}
          />
        </div>
      </div>

      {/* Кнопки изменения размера */}
      <div className="absolute top-4 left-4 bg-black/50 rounded-lg p-2 space-y-1">
        <div className="text-white text-xs font-semibold mb-1">Размер:</div>
        <button
          onClick={() => setScale(0.3)}
          className={`w-8 h-6 text-xs rounded ${scale === 0.3 ? 'bg-yellow-500' : 'bg-gray-600'} text-white`}
        >
          S
        </button>
        <button
          onClick={() => setScale(0.5)}
          className={`w-8 h-6 text-xs rounded ${scale === 0.5 ? 'bg-yellow-500' : 'bg-gray-600'} text-white`}
        >
          M
        </button>
        <button
          onClick={() => setScale(1.0)}
          className={`w-8 h-6 text-xs rounded ${scale === 1.0 ? 'bg-yellow-500' : 'bg-gray-600'} text-white`}
        >
          L
        </button>
        <button
          onClick={() => setScale(1.5)}
          className={`w-8 h-6 text-xs rounded ${scale === 1.5 ? 'bg-yellow-500' : 'bg-gray-600'} text-white`}
        >
          XL
        </button>
      </div>
    </div>
  );
}
