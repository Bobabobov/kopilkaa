// components/profile/other-user/widgets/RecentApplications.tsx
"use client";

import { useEffect, useState } from "react";

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
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const load = async (next?: string | null) => {
    const url = new URL(
      `/api/users/${userId}/applications/recent`,
      window.location.origin,
    );
    url.searchParams.set("take", "5");
    if (next) url.searchParams.set("cursor", next);
    const res = await fetch(url.toString());
    if (res.ok) {
      const data = await res.json();
      setItems((prev) => (next ? [...prev, ...data.applications] : data.applications));
      setCursor(data.nextCursor);
      setHasMore(Boolean(data.nextCursor));
    }
  };

  useEffect(() => {
    setLoading(true);
    load()
      .catch(() => {})
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="relative overflow-hidden bg-[#001e1d]/30 border border-[#abd1c6]/10 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#f9bc60] rounded-md flex items-center justify-center text-[#001e1d]">
            📝
          </div>
          <h3 className="text-sm font-semibold text-[#fffffe]">Недавние заявки</h3>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 bg-[#001e1d]/40 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-[#abd1c6] text-sm">Заявок пока нет</p>
      ) : (
        <>
          <div className="space-y-2">
            {items.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#001e1d]/40 border border-[#abd1c6]/10"
              >
                <div className="min-w-0">
                  <div className="text-sm text-[#fffffe] truncate">
                    {a.title || "Заявка"}
                  </div>
                  <div className="text-xs text-[#94a3b8]">
                    {new Date(a.createdAt).toLocaleString("ru-RU")}
                  </div>
                </div>
                <div className={`text-xs px-2 py-1 rounded-lg font-semibold ${statusBadge(a.status)}`}>
                  {a.status === "PENDING"
                    ? "На рассмотрении"
                    : a.status === "APPROVED"
                    ? "Одобрена"
                    : "Отклонена"}
                </div>
              </div>
            ))}
          </div>
          {hasMore && (
            <div className="mt-3">
              <button
                onClick={() => load(cursor)}
                className="w-full px-3 py-2 rounded-lg bg-[#f9bc60]/10 hover:bg-[#f9bc60]/20 text-[#f9bc60] text-sm font-semibold transition-colors"
              >
                Показать ещё
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}


