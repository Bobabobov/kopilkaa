// components/profile/other-user/widgets/RecentApplications.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type Application = {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  title?: string | null;
  amount?: number | null;
  createdAt: string;
};

interface RecentApplicationsProps {
  userId: string;
}

export default function RecentApplications({ userId }: RecentApplicationsProps) {
  const [items, setItems] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/users/${userId}/applications/recent`);
        if (res.ok) {
          const data = await res.json();
          setItems(data.applications || []);
        }
      } catch (error) {
        console.error("Error loading recent applications:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId]);

  const statusBadge = (s: Application["status"]) => {
    switch (s) {
      case "APPROVED":
        return "bg-[#10B981]/20 text-[#10B981]";
      case "REJECTED":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-[#f9bc60]/20 text-[#f9bc60]";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-[#abd1c6]/20 group hover:shadow-3xl transition-all duration-500"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-[#f9bc60]/15 to-[#abd1c6]/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-[#abd1c6]/10 to-[#f9bc60]/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-[#f9bc60] to-[#e8a545] rounded-xl flex items-center justify-center text-[#001e1d] text-lg shadow-lg">
            📝
          </div>
          <h3 className="text-base font-bold text-[#fffffe]">Одобренные</h3>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-[#001e1d]/40 rounded-xl animate-pulse border border-[#abd1c6]/10" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#f9bc60]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📝</span>
            </div>
            <p className="text-[#abd1c6] text-sm">Заявок пока нет</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((a, index) => (
              <Link key={a.id} href={`/stories/${a.id}`} prefetch={false}>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-[#001e1d]/30 hover:bg-[#001e1d]/50 border border-[#abd1c6]/10 hover:border-[#f9bc60]/30 transition-all duration-200 hover:scale-[1.02] group/item cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold text-[#fffffe] truncate group-hover:text-[#f9bc60] transition-colors">
                        {a.title || "Заявка"}
                      </div>
                      <svg
                        className="w-4 h-4 text-[#10B981] flex-shrink-0 group-hover:translate-x-1 transition-transform"
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
                    </div>
                    <div className="text-xs text-[#abd1c6] mt-1">
                      {new Date(a.createdAt).toLocaleString("ru-RU")}
                    </div>
                  </div>
                  <div className={`text-xs px-3 py-1.5 rounded-lg font-bold ${statusBadge(a.status)} border border-current/20 ml-3 flex-shrink-0`}>
                    Одобрена
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}


