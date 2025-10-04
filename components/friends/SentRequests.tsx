// components/friends/SentRequests.tsx
"use client";

import { motion } from "framer-motion";
import RequestCard from "./RequestCard";

type User = {
  id: string;
  name?: string | null;
  email: string;
  avatar?: string | null;
  createdAt: string;
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

interface SentRequestsProps {
  sentRequests: Friendship[];
}

export default function SentRequests({ sentRequests }: SentRequestsProps) {
  if (sentRequests.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 backdrop-blur-sm rounded-2xl border border-slate-200/30 dark:border-slate-700/20 bg-white/10 dark:bg-black/10"
      >
        <div className="text-8xl mb-6">📤</div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Нет исходящих заявок</h3>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Вы еще не отправили ни одной заявки</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {sentRequests.map((friendship) => (
        <RequestCard
          key={friendship.id}
          friendship={friendship}
          type="sent"
        />
      ))}
    </div>
  );
}


