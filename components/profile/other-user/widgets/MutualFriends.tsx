// components/profile/other-user/widgets/MutualFriends.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import OtherUserFriendsModal from "../OtherUserFriendsModal";

type UserLite = {
  id: string;
  name?: string | null;
  email: string;
  avatar?: string | null;
  lastSeen?: string | null;
};

interface MutualFriendsProps {
  userId: string;
}

export default function MutualFriends({ userId }: MutualFriendsProps) {
  const [users, setUsers] = useState<UserLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/users/${userId}/friends`);
        if (res.ok) {
          const data = await res.json();
          setUsers(data.friends || []);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#004643]/30 backdrop-blur-sm rounded-2xl p-5 border border-[#abd1c6]/20 min-h-[160px]"
      >
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-[#abd1c6]/20 rounded w-32" />
          <div className="h-4 bg-[#abd1c6]/10 rounded w-24" />
          <div className="h-10 bg-[#abd1c6]/10 rounded-xl" />
        </div>
      </motion.div>
    );
  }

  if (users.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#004643]/30 backdrop-blur-sm rounded-2xl p-5 border border-[#abd1c6]/20 min-h-[160px] flex items-center justify-center"
      >
        <p className="text-sm text-[#abd1c6]">У пользователя пока нет друзей.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#004643]/30 backdrop-blur-sm rounded-2xl p-5 border border-[#abd1c6]/20 min-h-[160px] flex flex-col"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#f9bc60] flex items-center justify-center text-xs text-[#001e1d]">
            👥
          </div>
          <h3 className="text-sm font-semibold text-[#fffffe]">Друзья</h3>
        </div>
        <span className="text-xs font-semibold text-[#f9bc60] bg-[#f9bc60]/10 px-2.5 py-1 rounded-full">
          {users.length}
        </span>
      </div>

      <div className="space-y-2 flex-1">
        {users.slice(0, 3).map((u, index) => (
          <motion.div
            key={u.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              href={`/profile/${u.id}`}
              prefetch={false}
              className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#001e1d]/30 hover:bg-[#001e1d]/50 border border-[#abd1c6]/15 hover:border-[#f9bc60]/40 transition-colors"
            >
              {u.avatar ? (
                <img
                  src={u.avatar}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#004643] to-[#001e1d] text-[#f9bc60] flex items-center justify-center text-xs font-bold border border-[#f9bc60]/40">
                  {(u.name || u.email.split("@")[0])[0].toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-[#fffffe]">
                  {u.name || u.email.split("@")[0]}
                </p>
                {u.lastSeen && (
                  <p className="text-[10px] text-[#abd1c6]/70">
                    Был(а) в сети:{" "}
                    {new Date(u.lastSeen).toLocaleDateString("ru-RU")}
                  </p>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {users.length > 3 && (
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="mt-3 w-full text-[11px] text-[#abd1c6]/80 hover:text-[#f9bc60] underline underline-offset-4 text-center"
        >
          Показать всех друзей ({users.length})
        </button>
      )}

      <OtherUserFriendsModal
        userId={userId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </motion.div>
  );
}


