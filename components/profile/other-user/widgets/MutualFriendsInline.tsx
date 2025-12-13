"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type Friend = {
  id: string;
  name?: string | null;
  email?: string;
  avatar?: string | null;
};

interface MutualFriendsInlineProps {
  friends: Friend[];
}

export function MutualFriendsInline({ friends }: MutualFriendsInlineProps) {
  if (!friends || friends.length === 0) return null;

  return (
    <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2">
      {friends.slice(0, 6).map((f, idx) => (
        <motion.div
          key={f.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.05 }}
          className="w-9 h-9 rounded-full overflow-hidden border border-[#abd1c6]/40 bg-[#001e1d]/50"
          whileHover={{ scale: 1.1 }}
        >
          <Link href={`/profile/${f.id}`} prefetch={false}>
            {f.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={f.avatar} 
                alt="" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Скрываем изображение при ошибке и показываем fallback
                  e.currentTarget.style.display = "none";
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) {
                    fallback.style.display = "flex";
                  }
                }}
              />
            ) : null}
            <div className={`w-full h-full flex items-center justify-center text-[#f9bc60] text-xs font-bold ${f.avatar ? "hidden" : ""}`}>
              {(f.name || f.email || "?")[0]?.toUpperCase()}
            </div>
          </Link>
        </motion.div>
      ))}
      {friends.length > 6 && (
        <div className="text-xs text-[#abd1c6]">+{friends.length - 6}</div>
      )}
    </div>
  );
}




