// components/profile/UserCard.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

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

interface UserCardProps {
  user: User;
  index: number;
  currentUserId?: string | null;
  status?: UserStatus;
  showStatus?: boolean;
  actions?: {
    onSendRequest?: () => void;
    onCancelRequest?: () => void;
    onAcceptRequest?: () => void;
    onDeclineRequest?: () => void;
    onRemoveFriend?: () => void;
  };
  isSendingRequest?: boolean;
  variant?: 'friends' | 'sent' | 'received' | 'search';
}

export default function UserCard({
  user,
  index,
  currentUserId,
  status,
  showStatus = true,
  actions,
  isSendingRequest = false,
  variant = 'friends'
}: UserCardProps) {
  const displayName = user.name || (!user.hideEmail ? user.email.split('@')[0] : 'Пользователь');
  const isCurrentUser = user.id === currentUserId;

  // Определяем какие кнопки показывать в зависимости от варианта
  const getActionButtons = () => {
    if (isCurrentUser) return null;

    switch (variant) {
      case 'friends':
        return (
          <button
            onClick={actions?.onRemoveFriend}
            className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
          >
            Удалить
          </button>
        );

      case 'sent':
        return (
          <button
            onClick={actions?.onCancelRequest}
            disabled={isSendingRequest}
            className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900/20 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSendingRequest ? 'Отмена...' : 'Отменить'}
          </button>
        );

      case 'received':
        return (
          <div className="flex gap-2">
            <button
              onClick={actions?.onAcceptRequest}
              className="px-3 py-1.5 text-xs font-medium text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200"
            >
              Принять
            </button>
            <button
              onClick={actions?.onDeclineRequest}
              className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
            >
              Отклонить
            </button>
          </div>
        );

      case 'search':
        // Проверяем статус дружбы
        if (user.friendshipStatus === 'PENDING' && user.isRequester) {
          return (
            <button
              onClick={actions?.onCancelRequest}
              disabled={isSendingRequest}
              className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#abd1c6] to-[#94c4b8] hover:from-[#94c4b8] hover:to-[#7db8aa] text-[#001e1d] rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none font-semibold"
            >
              {isSendingRequest ? 'Отмена...' : 'Отменить заявку'}
            </button>
          );
        }
        
        if (user.friendshipStatus === 'ACCEPTED') {
          return (
            <button
              disabled
              className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#abd1c6] to-[#94c4b8] text-[#001e1d] rounded-xl cursor-not-allowed shadow-lg font-semibold"
            >
              В друзьях
            </button>
          );
        }
        
        return (
          <button
            onClick={actions?.onSendRequest}
            disabled={isSendingRequest}
            className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#f9bc60] to-[#e8a545] hover:from-[#e8a545] hover:to-[#d4952a] text-[#001e1d] rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none font-semibold"
          >
            {isSendingRequest ? 'Отправка...' : 'Добавить'}
          </button>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      key={user.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      className="flex items-center gap-4 p-4 rounded-2xl bg-[#004643]/40 hover:bg-[#004643]/60 backdrop-blur-sm border border-[#abd1c6]/20 hover:border-[#abd1c6]/40 transition-all duration-300 group"
    >
      {/* Аватарка */}
      <Link 
        href={`/profile/${user.id}`}
        className="relative flex-shrink-0"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-emerald-500 via-green-500 to-lime-600 flex items-center justify-center text-white font-bold text-lg">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            displayName[0].toUpperCase()
          )}
        </div>
        
        {/* Статус онлайн */}
        {showStatus && status && (
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
            status.status === "online" 
              ? "bg-green-400 animate-pulse" 
              : "bg-gray-400"
          }`} title={status.status === "online" ? "Онлайн" : `Последний вход: ${status.text}`}>
          </div>
        )}
      </Link>

      {/* Информация о пользователе */}
      <div className="flex-1 min-w-0">
        <Link 
          href={`/profile/${user.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <h3 className="font-medium text-white truncate group-hover:text-emerald-300 transition-colors duration-200">
            {displayName}
          </h3>
          <p className="text-sm text-gray-400 truncate">
            {!user.hideEmail ? user.email : 'Email скрыт'}
          </p>
          {showStatus && status && (
            <p className="text-xs text-gray-500">
              {status.status === "online" ? "🟢 Онлайн" : status.text}
            </p>
          )}
        </Link>
      </div>

      {/* Кнопки действий */}
      <div className="flex-shrink-0">
        {getActionButtons()}
      </div>
    </motion.div>
  );
}
