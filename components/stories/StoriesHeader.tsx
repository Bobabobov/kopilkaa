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
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4" style={{ color: '#fffffe' }}>
          📖 Истории Помощи
        </h1>
        
        <p className="text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto px-4" style={{ color: '#abd1c6' }}>
          Читайте вдохновляющие истории людей, которые получили помощь через нашу платформу.
          <span className="font-medium" style={{ color: '#f9bc60' }}> Каждая история — это надежда</span>
        </p>
      </div>

      {/* Поиск */}
      <div className="container mx-auto px-4">
        <div className="relative group max-w-md mx-auto">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <LucideIcons.Search 
              size="sm" 
              className={`transition-colors duration-300 ${
                query ? 'text-yellow-500' : 'text-gray-400'
              }`} 
            />
          </div>
          
          <input 
            className="w-full pl-10 pr-10 py-3 bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all duration-300 text-gray-900 placeholder-gray-500 text-sm shadow-lg group-hover:shadow-yellow-500/10 focus:shadow-yellow-500/20" 
            placeholder="Поиск историй..." 
            value={query} 
            onChange={(e) => onQueryChange(e.target.value)} 
          />
          
          {query && (
            <button
              onClick={() => onQueryChange("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 transition-all duration-200 rounded-full hover:bg-red-50 hover:scale-110"
              title="Очистить поиск"
            >
              <LucideIcons.Close size="sm" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
