"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { VKIcon } from "@/components/ui/icons/VKIcon";
import { TelegramIcon } from "@/components/ui/icons/TelegramIcon";
import { YouTubeIcon } from "@/components/ui/icons/YouTubeIcon";

interface Donor {
  id: string;
  name: string;
  amount: string;
  avatar?: string | null;
  vkLink?: string | null;
  telegramLink?: string | null;
  youtubeLink?: string | null;
  position?: number;
}

const DEFAULT_AVATAR = "/default-avatar.png";

export default function HomeTopDonorsScene() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [failedAvatars, setFailedAvatars] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    const fetchTopDonors = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/top-donors", { cache: "no-store" });
        if (!response.ok) return;

        const data = await response.json();
        if (!data.success || !Array.isArray(data.donors)) return;

        setDonors((data.donors as Donor[]).slice(0, 3));
      } catch (error) {
        console.error("Error fetching top donors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopDonors();
  }, []);

  if (loading) {
    return (
      <section className="py-10">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white/80" />
          <p className="mt-3 text-sm text-[#abd1c6]">
            Загружаем топ‑донатёров...
          </p>
        </div>
      </section>
    );
  }

  if (donors.length === 0) {
    return null;
  }

  const totalAmount = donors.reduce((sum, donor) => {
    const numeric = parseInt(donor.amount.replace(/\D/g, ""), 10);
    if (Number.isNaN(numeric)) return sum;
    return sum + numeric;
  }, 0);

  const formattedTotal =
    totalAmount > 0 ? totalAmount.toLocaleString("ru-RU") : null;

  return (
    <section className="pt-8 pb-4">
      <div className="max-w-2xl text-left lg:ml-auto">
        <p className="text-xs uppercase tracking-[0.3em] text-[#abd1c6]">
          Герои платформы
        </p>
        <h3 className="mt-2 text-xl font-semibold text-[#fffffe]">
          Топ-донатеры
        </h3>
        <p className="mt-2 text-xs text-[#abd1c6]">
          {formattedTotal
            ? `В сумме топ-донатеры собрали ₽${formattedTotal}`
            : "Люди, которые уже поддержали эксперимент"}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:ml-auto lg:max-w-5xl">
        {donors.map((donor, index) => (
          <motion.div
            key={donor.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Link href={`/profile/${donor.id}`}>
              <div
                className={`flex items-center gap-4 rounded-3xl border border-[#abd1c6]/20 bg-[#001e1d]/70 p-4 transition-all duration-300 hover:border-[#f9bc60]/40 hover:shadow-lg hover:shadow-[#f9bc60]/10 ${
                  index === 1 ? "lg:-translate-y-3" : index === 2 ? "lg:translate-y-3" : ""
                }`}
              >
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border border-[#abd1c6]/40">
                  <img
                    src={
                      failedAvatars[donor.id]
                        ? DEFAULT_AVATAR
                        : donor.avatar || DEFAULT_AVATAR
                    }
                    alt={donor.name}
                    className="h-full w-full object-cover"
                    onError={() =>
                      setFailedAvatars((prev) => ({
                        ...prev,
                        [donor.id]: true,
                      }))
                    }
                  />
                  <span className="absolute -bottom-1 -right-1 rounded-full bg-[#001e1d] px-1.5 py-0.5 text-[10px] text-[#f9bc60]">
                    #{index + 1}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-semibold text-[#fffffe]">
                    {donor.name}
                  </p>
                  <p className="text-sm text-[#f9bc60]">
                    Оплатил(а): ₽{donor.amount}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(event) => {
                        if (!donor.vkLink) return;
                        event.preventDefault();
                        event.stopPropagation();
                        window.open(donor.vkLink!, "_blank", "noopener,noreferrer");
                      }}
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full border ${
                        donor.vkLink
                          ? "border-[#4c75a3]/60 text-[#4c75a3] hover:bg-[#4c75a3]/20"
                          : "border-[#4c75a3]/25 text-[#4c75a3]/40 cursor-default"
                      }`}
                      aria-label="VK"
                    >
                      <VKIcon className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        if (!donor.telegramLink) return;
                        event.preventDefault();
                        event.stopPropagation();
                        window.open(
                          donor.telegramLink!,
                          "_blank",
                          "noopener,noreferrer",
                        );
                      }}
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full border ${
                        donor.telegramLink
                          ? "border-[#229ED9]/60 text-[#229ED9] hover:bg-[#229ED9]/20"
                          : "border-[#229ED9]/25 text-[#229ED9]/40 cursor-default"
                      }`}
                      aria-label="Telegram"
                    >
                      <TelegramIcon className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        if (!donor.youtubeLink) return;
                        event.preventDefault();
                        event.stopPropagation();
                        window.open(
                          donor.youtubeLink!,
                          "_blank",
                          "noopener,noreferrer",
                        );
                      }}
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full border ${
                        donor.youtubeLink
                          ? "border-[#ff4f45]/60 text-[#ff4f45] hover:bg-[#ff4f45]/20"
                          : "border-[#ff4f45]/25 text-[#ff4f45]/40 cursor-default"
                      }`}
                      aria-label="YouTube"
                    >
                      <YouTubeIcon className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
