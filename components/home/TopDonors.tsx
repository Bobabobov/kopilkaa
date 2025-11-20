"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { TelegramIcon } from "@/components/ui/icons/TelegramIcon";
import { VKIcon } from "@/components/ui/icons/VKIcon";
import { YouTubeIcon } from "@/components/ui/icons/YouTubeIcon";

interface Donor {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  vkLink?: string | null;
  telegramLink?: string | null;
  youtubeLink?: string | null;
  amount: string;
  position: number;
  isTop: boolean;
}

export default function TopDonors() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/top-donors", { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setDonors(data.donors || []);
          }
        }
      } catch (error) {
        console.error("Error fetching top donors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, []);

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <LucideIcons.Crown size="sm" className="text-[#001e1d]" />;
      case 2:
        return <LucideIcons.Award size="sm" className="text-[#001e1d]" />;
      case 3:
        return <LucideIcons.Medal size="sm" className="text-[#001e1d]" />;
      default:
        return (
          <span className="text-xs font-bold text-[#001e1d]">{position}</span>
        );
    }
  };

  const getAvatarBg = (position: number) => {
    switch (position) {
      case 1:
        return "bg-[#f9bc60]";
      case 2:
        return "bg-[#abd1c6]";
      case 3:
        return "bg-[#e16162]";
      default:
        return "bg-[#94a1b2]";
    }
  };

  return (
    <section className="w-full">
      <div className="rounded-3xl border border-[#abd1c6]/30 bg-gradient-to-br from-[#004643] via-[#002523] to-[#001e1d] px-6 py-6 sm:px-7 sm:py-7 shadow-2xl shadow-black/40">
        {/* Заголовок */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f9bc60] flex items-center justify-center text-base text-[#001e1d] shadow-md shadow-[#f9bc60]/40">
              ★
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-[#fffffe]">
                Топ‑донатеры
              </h3>
              <p className="text-sm text-[#abd1c6]/85">
                Пользователи, которые задонатили проекту больше всех
              </p>
            </div>
          </div>
          <Link
            href="/heroes"
            className="hidden sm:inline-flex items-center gap-1 rounded-full border border-[#abd1c6]/40 px-3 py-1 text-[11px] font-medium text-[#abd1c6] hover:bg-[#004643]/80 hover:text-[#fffffe] transition-colors"
          >
            <LucideIcons.Users size="xs" />
            Все герои
          </Link>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-12 rounded-xl bg-[#001e1d]/40 border border-[#abd1c6]/20 animate-pulse"
              />
            ))}
          </div>
        ) : donors.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#abd1c6]/45 px-4 py-4 text-[13px] text-[#abd1c6] flex items-center justify-between gap-3 bg-[#001e1d]/40">
            <span>Пока никто не попал в топ‑донатеров.</span>
            <Link
              href="/support"
              className="inline-flex items-center gap-1 rounded-full bg-[#f9bc60] px-3 py-1 text-[11px] font-semibold text-[#001e1d] hover:bg-[#e8a545] transition-colors"
            >
              <LucideIcons.Heart size="xs" />
              Поддержать
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {donors.map((donor) => (
              <Link key={donor.id} href={`/profile/${donor.id}`}>
                <motion.div
                  whileHover={{ y: -3, scale: 1.02 }}
                  className="flex items-center justify-between gap-4 rounded-2xl px-4 py-3 bg-[#001e1d]/40 hover:bg-[#004643]/70 transition-colors cursor-pointer border border-transparent hover:border-[#f9bc60]/50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative">
                      {donor.avatar ? (
                        <div className="w-11 h-11 rounded-full overflow-hidden border border-[#abd1c6]/40">
                          <img
                            src={donor.avatar}
                            alt={donor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div
                          className={`w-11 h-11 rounded-full ${getAvatarBg(
                            donor.position,
                          )} flex items-center justify-center text-xs font-semibold text-[#001e1d]`}
                        >
                          {getRankIcon(donor.position)}
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#001e1d] border border-[#f9bc60]/70 text-[10px] flex items-center justify-center text-[#f9bc60] shadow-sm">
                        #{donor.position}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-[#fffffe]">
                        {donor.name}
                      </p>
                      <p className="text-sm text-[#f9bc60]">₽{donor.amount}</p>
                    </div>
                  </div>
                  {(donor.vkLink || donor.telegramLink || donor.youtubeLink) && (
                    <div className="flex items-center gap-1">
                      {donor.vkLink && (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            window.open(donor.vkLink!, "_blank", "noopener,noreferrer");
                          }}
                          className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-[#4c75a3]/60 text-[#4c75a3] bg-transparent hover:bg-[#4c75a3]/20 transition-colors"
                          aria-label="VK"
                        >
                          <VKIcon className="w-3 h-3" />
                        </button>
                      )}
                      {donor.telegramLink && (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            window.open(
                              donor.telegramLink!,
                              "_blank",
                              "noopener,noreferrer",
                            );
                          }}
                          className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-[#229ED9]/60 text-[#229ED9] bg-transparent hover:bg-[#229ED9]/20 transition-colors"
                          aria-label="Telegram"
                        >
                          <TelegramIcon className="w-3 h-3" />
                        </button>
                      )}
                      {donor.youtubeLink && (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            window.open(
                              donor.youtubeLink!,
                              "_blank",
                              "noopener,noreferrer",
                            );
                          }}
                          className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-[#ff4f45]/60 text-[#ff4f45] bg-transparent hover:bg-[#ff4f45]/20 transition-colors"
                          aria-label="YouTube"
                        >
                          <YouTubeIcon className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}