// components/profile/FriendsTab.tsx
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

interface Friendship {
  id: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "BLOCKED";
  requesterId: string;
  receiverId: string;
  requester: User;
  receiver: User;
  createdAt: string;
}

interface UserStatus {
  status: "online" | "offline";
  text: string;
}

interface FriendsTabProps {
  type: 'friends' | 'sent' | 'received';
  data: Friendship[];
  loading: boolean;
  currentUserId: string | null;
  getUserStatus: (lastSeen: string | null) => UserStatus;
  sendingRequests: Set<string>;
  actions: {
    onSendRequest?: (userId: string) => void;
    onCancelRequest?: (friendshipId: string, userId: string) => void;
    onAcceptRequest?: (friendshipId: string) => void;
    onDeclineRequest?: (friendshipId: string) => void;
    onRemoveFriend?: (friendshipId: string) => void;
  };
}

export default function FriendsTab({
  type,
  data,
  loading,
  currentUserId,
  getUserStatus,
  sendingRequests,
  actions
}: FriendsTabProps) {
  
  const getEmptyStateMessage = () => {
    switch (type) {
      case 'friends':
        return {
          icon: '👥',
          title: 'Пока нет друзей',
          description: 'Добавьте друзей, чтобы начать общение'
        };
      case 'sent':
        return {
          icon: '📤',
          title: 'Нет отправленных заявок',
          description: 'Вы еще не отправляли заявки в друзья'
        };
      case 'received':
        return {
          icon: '📥',
          title: 'Нет входящих заявок',
          description: 'У вас пока нет новых заявок в друзья'
        };
      default:
        return {
          icon: '📋',
          title: 'Пусто',
          description: 'Здесь пока ничего нет'
        };
    }
  };

  const renderUserCard = (friendship: Friendship, index: number) => {
    let user: User;
    let userActions: any = {};

    switch (type) {
      case 'friends':
        // Для друзей показываем того, кто не является текущим пользователем
        user = friendship.requesterId === currentUserId ? friendship.receiver : friendship.requester;
        userActions = {
          onRemoveFriend: () => actions.onRemoveFriend?.(friendship.id)
        };
        break;
        
      case 'sent':
        // Для отправленных заявок показываем получателя
        user = friendship.receiver;
        userActions = {
          onCancelRequest: () => actions.onCancelRequest?.(friendship.id, friendship.receiverId)
        };
        break;
        
      case 'received':
        // Для полученных заявок показываем отправителя
        user = friendship.requester;
        userActions = {
          onAcceptRequest: () => actions.onAcceptRequest?.(friendship.id),
          onDeclineRequest: () => actions.onDeclineRequest?.(friendship.id)
        };
        break;
    }

    const status = getUserStatus(user.lastSeen || null);
    const isSendingRequest = sendingRequests.has(user.id);

    return (
      <UserCard
        key={friendship.id}
        user={user}
        index={index}
        currentUserId={currentUserId}
        status={status}
        actions={userActions}
        isSendingRequest={isSendingRequest}
        variant={type}
      />
    );
  };

  if (loading) {
    return (
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
    );
  }

  // Проверяем, что data является массивом
  if (!data || !Array.isArray(data)) {
    const emptyState = getEmptyStateMessage();
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="text-6xl mb-4">{emptyState.icon}</div>
        <h3 className="text-lg font-medium text-white mb-2">{emptyState.title}</h3>
        <p className="text-gray-400 text-sm">{emptyState.description}</p>
      </motion.div>
    );
  }

  if (data.length === 0) {
    const emptyState = getEmptyStateMessage();
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="text-6xl mb-4">{emptyState.icon}</div>
        <h3 className="text-lg font-medium text-white mb-2">{emptyState.title}</h3>
        <p className="text-gray-400 text-sm">{emptyState.description}</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-1">
      {data.map((friendship, index) => renderUserCard(friendship, index))}
    </div>
  );
}
