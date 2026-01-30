// app/admin/reports/components/UserCard.tsx
"use client";

import Link from "next/link";

interface UserCardProps {
  userId: string;
  name: string | null;
  email: string;
  avatar: string | null;
  label: string;
  isBanned?: boolean;
  bannedUntil?: string | null;
}

export default function UserCard({
  userId,
  name,
  email,
  avatar,
  label,
  isBanned,
  bannedUntil,
}: UserCardProps) {
  const getInitial = () => {
    if (name) return name[0].toUpperCase();
    return email[0].toUpperCase();
  };

  return (
    <div>
      <p className="text-[#abd1c6] text-sm mb-2">{label}</p>
      <Link
        href={`/profile/${userId}`}
        className="flex items-center gap-3 group hover:bg-[#001e1d]/40 p-2 rounded-lg transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f9bc60] to-[#e8a545] flex items-center justify-center flex-shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt=""
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-[#001e1d] font-bold">{getInitial()}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[#fffffe] font-medium group-hover:text-[#f9bc60] transition-colors">
            {name || "Пользователь"}
          </p>
          <p className="text-[#abd1c6] text-sm truncate">{email}</p>
          {isBanned && (!bannedUntil || new Date(bannedUntil) > new Date()) && (
            <p className="text-red-400 text-xs mt-1">
              {bannedUntil
                ? `Заблокирован до ${new Date(bannedUntil).toLocaleDateString("ru-RU")}`
                : "Заблокирован навсегда"}
            </p>
          )}
        </div>
        <svg
          className="w-4 h-4 text-[#abd1c6] group-hover:text-[#f9bc60] transition-colors flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Link>
    </div>
  );
}
