// components/friends/ReceivedRequests.tsx
"use client";

import { motion } from "framer-motion";
import RequestCard from "./RequestCard";

type User = {
  id: string;
  name?: string | null;
  email: string;
  avatar?: string | null;
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

interface ReceivedRequestsProps {
  receivedRequests: Friendship[];
  onAccept: (friendshipId: string) => void;
  onDecline: (friendshipId: string) => void;
}

export default function ReceivedRequests({ receivedRequests, onAccept, onDecline }: ReceivedRequestsProps) {
  if (receivedRequests.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 backdrop-blur-sm rounded-2xl border border-slate-200/30 dark:border-slate-700/20 bg-white/10 dark:bg-black/10"
      >
        <div className="text-8xl mb-6">📨</div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Нет входящих заявок</h3>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Пока никто не отправил вам заявку в друзья</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {receivedRequests.map((friendship) => (
        <RequestCard
          key={friendship.id}
          friendship={friendship}
          type="received"
          onAccept={onAccept}
          onDecline={onDecline}
        />
      ))}
    </div>
  );
}


