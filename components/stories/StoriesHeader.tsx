"use client";

import { LucideIcons } from "@/components/ui/LucideIcons";

interface StoriesHeaderProps {
  query: string;
  onQueryChange: (query: string) => void;
}

export function StoriesHeader({ query, onQueryChange }: StoriesHeaderProps) {
  return (
    <div className="pt-32 pb-8">
      {/* Заголовок */}
      <div className="text-center mb-8">
        <div className="relative inline-block mb-6">
          {/* Декоративные элементы */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400/20 rounded-full animate-pulse"></div>
          <div className="absolute -top-2 -right-6 w-6 h-6 bg-yellow-400/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-yellow-400/25 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 relative z-10">
            <span 
              className="inline-block transform hover:scale-105 transition-transform duration-300 bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent"
              style={{ 
                backgroundImage: 'linear-gradient(135deg, #fffffe 0%, #f9bc60 50%, #fffffe 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(249, 188, 96, 0.3)'
              }}
            >
              📖 Истории Помощи
            </span>
          </h1>
          
          {/* Подчёркивание */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></div>
        </div>
        
        <div className="relative">
          {/* Фоновый декоративный элемент */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/5 to-transparent h-16 -top-4"></div>
          
          <p className="text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto px-4 relative z-10" style={{ color: '#abd1c6' }}>
            Читайте вдохновляющие истории людей, которые получили помощь через нашу платформу.
            <span className="font-medium block mt-2 text-center" style={{ color: '#f9bc60' }}>
              ✨ Каждая история — это надежда ✨
            </span>
          </p>
        </div>
      </div>

      {/* Поиск */}
      <div className="container mx-auto px-4">
        <div className="relative group max-w-md mx-auto">
          {/* Декоративная рамка */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20 rounded-lg blur-sm"></div>
          
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
              <LucideIcons.Search 
                size="sm" 
                className={`transition-all duration-300 ${
                  query ? 'text-yellow-400 scale-110' : 'text-gray-400 group-hover:text-yellow-300'
                }`} 
              />
            </div>
            
            <input 
              className="w-full pl-10 pr-10 py-4 backdrop-blur-xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300 text-white placeholder-gray-300 text-sm shadow-xl group-hover:shadow-yellow-400/20 focus:shadow-yellow-400/30 relative z-10" 
              style={{
                backgroundColor: 'rgba(0, 30, 29, 0.85)',
                borderColor: query ? 'rgba(249, 188, 96, 0.4)' : 'rgba(171, 209, 198, 0.3)'
              }}
              placeholder="Поиск историй..." 
              value={query} 
              onChange={(e) => onQueryChange(e.target.value)} 
            />
            
            {query && (
              <button
                onClick={() => onQueryChange("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-red-400 transition-all duration-200 rounded-full hover:bg-red-500/10 hover:scale-110 z-20"
                title="Очистить поиск"
              >
                <LucideIcons.Close size="sm" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
