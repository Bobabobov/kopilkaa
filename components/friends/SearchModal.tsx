// components/friends/SearchModal.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type User = {
  id: string;
  name?: string | null;
  email: string;
  avatar?: string | null;
  hideEmail?: boolean;
  createdAt: string;
};

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchResults: User[];
  searchLoading: boolean;
  sendingRequests: Set<string>;
  onSendRequest: (userId: string) => void;
}

export default function SearchModal({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  searchResults,
  searchLoading,
  sendingRequests,
  onSendRequest
}: SearchModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
      >
        {/* Заголовок */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Поиск друзей
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Поисковая строка */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <input
              type="text"
              placeholder="Введите имя или email..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            />
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Результаты поиска */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {searchLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Поиск...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name || "Пользователь"} 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-lime-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {user.name ? user.name[0].toUpperCase() : (!user.hideEmail ? user.email[0].toUpperCase() : 'П')}
                      </div>
                    )}
                    <div>
                      <Link 
                        href={`/profile/${user.id}`}
                        className="font-medium text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      >
                        {user.name || (!user.hideEmail ? user.email.split('@')[0] : 'Пользователь')}
                      </Link>
                      {!user.hideEmail ? (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {user.email}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                          Email скрыт
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onSendRequest(user.id)}
                    disabled={sendingRequests.has(user.id) || (user as any).friendshipStatus === 'PENDING'}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors backdrop-blur-sm border ${
                      sendingRequests.has(user.id)
                        ? 'bg-gray-500/20 text-gray-600 dark:text-gray-400 cursor-not-allowed border-gray-500/20'
                        : (user as any).friendshipStatus === 'PENDING'
                        ? 'bg-lime-500/20 text-lime-600 dark:text-lime-400 cursor-not-allowed border-lime-500/20'
                        : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    {sendingRequests.has(user.id) 
                      ? 'Отправка...' 
                      : (user as any).friendshipStatus === 'PENDING'
                      ? 'Заявка отправлена'
                      : 'Добавить'
                    }
                  </button>
                </div>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-600 dark:text-gray-400">
                Пользователи не найдены
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-gray-600 dark:text-gray-400">
                Введите имя или email для поиска
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}


