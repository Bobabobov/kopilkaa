// components/profile/other-user/widgets/MutualFriends.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/users/${userId}/mutual-friends`);
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users || []);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  if (loading) {
    return (
      <div className="relative overflow-hidden bg-[#001e1d]/30 border border-[#abd1c6]/10 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-[#f9bc60] rounded-md flex items-center justify-center text-[#001e1d]">
            👥
          </div>
          <h3 className="text-sm font-semibold text-[#fffffe]">Общие друзья</h3>
        </div>
        <div className="h-10 animate-pulse bg-[#001e1d]/40 rounded-lg" />
      </div>
    );
  }

  if (users.length === 0) {
    return null;
  }

  return (
    <div className="relative overflow-hidden bg-[#001e1d]/30 border border-[#abd1c6]/10 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#f9bc60] rounded-md flex items-center justify-center text-[#001e1d]">
            👥
          </div>
          <h3 className="text-sm font-semibold text-[#fffffe]">
            Общие друзья
          </h3>
        </div>
        <span className="text-xs text-[#abd1c6]">{users.length}</span>
      </div>

      <div className="flex -space-x-2 overflow-hidden mb-3">
        {users.slice(0, 8).map((u) => (
          <Link
            key={u.id}
            href={`/profile/${u.id}`}
            className="inline-block ring-2 ring-[#001e1d] rounded-full"
            prefetch={false}
            title={u.name || u.email}
          >
            {u.avatar ? (
              <img
                className="inline-block h-8 w-8 rounded-full object-cover"
                src={u.avatar}
                alt=""
              />
            ) : (
              <div className="inline-flex h-8 w-8 rounded-full bg-[#004643] text-[#f9bc60] items-center justify-center text-xs font-bold">
                {(u.name || u.email.split("@")[0])[0].toUpperCase()}
              </div>
            )}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {users.slice(0, 6).map((u) => (
          <Link
            key={`mf-${u.id}`}
            href={`/profile/${u.id}`}
            prefetch={false}
            className="group flex items-center gap-2 p-2 rounded-lg hover:bg-[#001e1d]/40 transition"
          >
            {u.avatar ? (
              <img
                src={u.avatar}
                alt=""
                className="w-7 h-7 rounded-full object-cover"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-[#004643] text-[#f9bc60] flex items-center justify-center text-xs font-bold">
                {(u.name || u.email.split("@")[0])[0].toUpperCase()}
              </div>
            )}
            <span className="text-xs text-[#fffffe] truncate group-hover:underline">
              {u.name || u.email.split("@")[0]}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}


