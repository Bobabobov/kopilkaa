// components/profile/FriendsSearch.tsx
"use client";

import { motion } from "framer-motion";
import UserCard from "./UserCard";

interface User {
  id: string;
  name?: string | null;
  email: string;
  avatar?: string | null;
  createdAt: string;
  lastSeen?: string | null;
  hideEmail?: boolean;
  friendshipStatus?: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  friendshipId?: string;
  isRequester?: boolean;
}

interface UserStatus {
  status: "online" | "offline";
  text: string;
}

interface FriendsSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: User[];
  searchLoading: boolean;
  currentUserId: string | null;
  getUserStatus: (lastSeen: string | null) => UserStatus;
  sendingRequests: Set<string>;
  onSendRequest: (userId: string) => void;
  onCancelRequest: (friendshipId: string, userId: string) => void;
}

export default function FriendsSearch({
  searchQuery,
  setSearchQuery,
  searchResults,
  searchLoading,
  currentUserId,
  getUserStatus,
  sendingRequests,
  onSendRequest,
  onCancelRequest
}: FriendsSearchProps) {
  
  return (
    <div className="space-y-4">
      {/* Поиск */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Поиск пользователей по имени или email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
        />
        {searchLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Результаты поиска */}
      <div className="h-[50vh] overflow-y-auto">
        {searchLoading && searchQuery.trim() ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-xl animate-pulse"
              >
                <div className="w-12 h-12 bg-gray-600 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                </div>
                <div className="w-16 h-6 bg-gray-600 rounded"></div>
              </div>
            ))}
          </div>
        ) : searchQuery.trim() && searchResults.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-white mb-2">Ничего не найдено</h3>
            <p className="text-gray-400 text-sm">
              Попробуйте изменить поисковый запрос
            </p>
          </motion.div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-1">
            {searchQuery.trim() && (
              <div className="mb-4">
                <p className="text-sm text-gray-400">
                  {searchResults.length} {searchResults.length === 1 ? 'пользователь найден' : searchResults.length < 5 ? 'пользователя найдено' : 'пользователей найдено'}
                </p>
              </div>
            )}
            {searchResults.map((user, index) => {
              const status = getUserStatus(user.lastSeen || null);
              const isSendingRequest = sendingRequests.has(user.id);
              const isCurrentUser = user.id === currentUserId;

              return (
                <UserCard
                  key={user.id}
                  user={user}
                  index={index}
                  currentUserId={currentUserId}
                  status={status}
                  actions={{
                    onSendRequest: isCurrentUser ? undefined : () => onSendRequest(user.id),
                    onCancelRequest: isCurrentUser ? undefined : user.friendshipId ? () => onCancelRequest(user.friendshipId!, user.id) : undefined
                  }}
                  isSendingRequest={isSendingRequest}
                  variant="search"
                />
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">
              {searchQuery.trim() ? '🔍' : '👥'}
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              {searchQuery.trim() ? 'Ничего не найдено' : 'Поиск друзей'}
            </h3>
            <p className="text-gray-400 text-sm">
              {searchQuery.trim() 
                ? 'Попробуйте изменить поисковый запрос'
                : 'Введите имя или email пользователя для поиска или выберите из списка ниже'
              }
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
