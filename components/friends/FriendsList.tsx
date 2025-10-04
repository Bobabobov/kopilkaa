// components/friends/FriendsList.tsx
"use client";

import { motion } from "framer-motion";
import FriendCard from "./FriendCard";

type User = {
  id: string;
  name?: string | null;
  email: string;
  avatar?: string | null;
  avatarFrame?: string | null;
  headerTheme?: string | null;
  createdAt: string;
  lastSeen?: string | null;
};

type Friendship = {
  id: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "BLOCKED";
  requesterId: string;
  receiverId: string;
  requester: User;
  receiver: User;
  createdAt: string;
};

interface FriendsListProps {
  friends: Friendship[];
  currentUserId: string | null;
  onRemoveFriend: (friendshipId: string) => void;
}

export default function FriendsList({ friends, currentUserId, onRemoveFriend }: FriendsListProps) {
  const getOtherUser = (friendship: Friendship) => {
    if (!currentUserId) {
      return friendship.requester;
    }
    if (friendship.requesterId === currentUserId) {
      return friendship.receiver;
    } else {
      return friendship.requester;
    }
  };

  if (friends.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 backdrop-blur-sm rounded-2xl border border-slate-200/30 dark:border-slate-700/20 bg-white/10 dark:bg-black/10"
      >
        <div className="text-8xl mb-6">👥</div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Нет друзей</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">Начните добавлять друзей и стройте сообщество!</p>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-friends-modal', { detail: 'search' }))}
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Найти друзей
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {friends.map((friendship) => {
        const otherUser = getOtherUser(friendship);
        return (
          <FriendCard
            key={friendship.id}
            friendship={friendship}
            otherUser={otherUser}
            onRemove={onRemoveFriend}
          />
        );
      })}
    </div>
  );
}
