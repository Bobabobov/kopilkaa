"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface StoriesEmptyStateProps {
  hasQuery: boolean;
}

export function StoriesEmptyState({ hasQuery }: StoriesEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center py-16 px-4"
    >
      <div className="container mx-auto">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-12 shadow-lg border border-white/20 max-w-2xl mx-auto"
             style={{ borderColor: '#abd1c6/30' }}>
          {hasQuery ? (
            <>
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <LucideIcons.Search size="xl" className="text-gray-400" />
              </div>
              
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#001e1d' }}>
                Ничего не найдено
              </h3>
              
              <p className="mb-8 leading-relaxed" style={{ color: '#2d5a4e' }}>
                По вашему запросу не найдено ни одной истории. Попробуйте изменить поисковый запрос или посмотрите все доступные истории.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  style={{ background: 'linear-gradient(135deg, #f9bc60 0%, #e8a94a 100%)' }}
                >
                  Показать все истории
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <LucideIcons.BookOpen size="xl" style={{ color: '#f9bc60' }} />
              </div>
              
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#001e1d' }}>
                Истории скоро появятся
              </h3>
              
              <p className="mb-8 leading-relaxed" style={{ color: '#2d5a4e' }}>
                Мы работаем над созданием вдохновляющих историй о помощи. Скоро здесь появятся первые истории людей, которые получили поддержку через нашу платформу.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/applications"
                  className="px-6 py-3 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  style={{ background: 'linear-gradient(135deg, #f9bc60 0%, #e8a94a 100%)' }}
                >
                  Подать заявку
                </a>
                <a
                  href="/profile"
                  className="px-6 py-3 bg-white/90 backdrop-blur-xl hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl"
                  style={{ borderColor: '#abd1c6/30' }}
                >
                  Мой профиль
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
