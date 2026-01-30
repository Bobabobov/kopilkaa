"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { HeroBadge } from "@/components/ui/HeroBadge";
import type { HeroBadge as HeroBadgeType } from "@/lib/heroBadges";
import Image from "next/image";

interface Donor {
  id: string;
  name: string;
  avatar?: string | null;
  amount: string;
  position: number;
  heroBadge?: HeroBadgeType | null;
}

/**
 * Компактный виджет «Топ‑донатёры» для правой колонки / небольших вставок.
 * Не такой детализированный, как большой блок TopDonors.
 */
const DEFAULT_AVATAR = "/default-avatar.png";

export default function TopDonorsWidget() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [failedAvatars, setFailedAvatars] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/top-donors", { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Берём только первых трёх для компактного виджета
            setDonors((data.donors || []).slice(0, 3));
          }
        }
      } catch (error) {
        console.error("Error fetching top donors (widget):", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, []);

  return (
    <section className="w-full">
      <div className="rounded-3xl bg-[#001e1d] text-[#fffffe] shadow-lg border border-[#abd1c6]/30 px-4 py-4">
        {/* Заголовок */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f9bc60] text-[#001e1d]">
              <LucideIcons.Heart size="xs" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold leading-tight">
                Топ‑донатёры
              </h3>
              <p className="text-[11px] text-[#abd1c6]/85">
                Герои, которые держат проект на плаву
              </p>
            </div>
          </div>
          <Link
            href="/support"
            className="inline-flex items-center gap-1 rounded-full bg-[#f9bc60] px-3 py-1 text-[10px] font-semibold text-[#001e1d] hover:bg-[#e8a545] transition-colors"
          >
            Поддержать
          </Link>
        </div>

        {/* Список / скелетон / пусто */}
        {loading ? (
          <div className="space-y-2">
            <div className="h-10 rounded-lg bg-[#001e1d]/60 border border-[#abd1c6]/25 animate-pulse" />
            <div className="h-10 rounded-lg bg-[#001e1d]/60 border border-[#abd1c6]/25 animate-pulse" />
            <div className="h-10 rounded-lg bg-[#001e1d]/60 border border-[#abd1c6]/25 animate-pulse" />
          </div>
        ) : donors.length === 0 ? (
          <p className="text-[12px] text-[#abd1c6]/90">
            Здесь появятся самые щедрые герои проекта. Возможно, один из них —
            вы.
          </p>
        ) : (
          <div className="space-y-2">
            {donors.map((donor) => (
              <Link key={donor.id} href={`/profile/${donor.id}`}>
                <div className="flex items-center justify-between gap-3 rounded-xl border border-[#abd1c6]/30 bg-[#001e1d]/80 px-3 py-2 hover:border-[#f9bc60]/70 hover:bg-[#004643]/80 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative flex-shrink-0">
                      <div className="h-9 w-9 rounded-full overflow-hidden border border-[#abd1c6]/40">
                        <Image
                          src={
                            failedAvatars[donor.id]
                              ? DEFAULT_AVATAR
                              : donor.avatar || DEFAULT_AVATAR
                          }
                          alt={donor.name}
                          width={36}
                          height={36}
                          sizes="36px"
                          quality={70}
                          className="h-full w-full object-cover"
                          onError={() =>
                            setFailedAvatars((prev) => ({
                              ...prev,
                              [donor.id]: true,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 min-w-0">
                        <p className="truncate text-[13px] font-semibold min-w-0">
                          {donor.name}
                        </p>
                        {donor.heroBadge && (
                          <HeroBadge badge={donor.heroBadge} size="xs" />
                        )}
                      </div>
                      <p className="text-[11px] font-semibold text-[#f9bc60]">
                        ₽{donor.amount}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
