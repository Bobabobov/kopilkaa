"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import GamesLoading from "./components/GamesLoading";

export default function GamesPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/profile/me", { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setIsAuthorized(true);
          } else {
            router.push("/login");
          }
        } else {
          router.push("/login");
        }
      } catch (error) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <GamesLoading />;
  }

  if (!isAuthorized) {
    return null;
  }

  /** На сервере не задавать NEXT_PUBLIC_GAMES_ENABLED — игры пока «Игра ещё не готова». Локально в .env.local задать NEXT_PUBLIC_GAMES_ENABLED=true для доступа. */
  const gamesEnabled = process.env.NEXT_PUBLIC_GAMES_ENABLED === "true";

  const games: Array<{
    title: string;
    description: string;
    href: string;
    badge: string;
    image: string;
  }> = [
    {
      title: "Монеткосбор 90-х",
      description: "Собирай монеты за 30 секунд! Клик мимо монеты = -1 жизнь. У тебя 3 жизни.",
      href: "/games/coin-catch",
      badge: "30 секунд / 3 жизни / недельный топ",
      image: "/game.png",
    },
  ];

  const comingSoon = [
    {
      title: "Скоро",
      description: "Новая игра в разработке.",
    },
    {
      title: "Скоро",
      description: "Ещё одна игра готовится.",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 pb-12 sm:pb-16 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[70vh]">
          {/* Картинка */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 sm:mb-10 md:mb-12 relative"
          >
            <div
              className="rounded-3xl p-4 sm:p-6 bg-gradient-to-br from-[#001e1d]/40 to-[#004643]/40 border border-[#f9bc60]/20"
              style={{ willChange: "auto" }}
            >
              <Image
                src="/game.png"
                alt="Игры"
                width={600}
                height={600}
                className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto rounded-2xl"
                priority
                loading="eager"
              />
            </div>
          </motion.div>

          {/* Надпись */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-center"
          >
            <span className="bg-gradient-to-r from-[#fffffe] via-[#f9bc60] to-[#fffffe] bg-clip-text text-transparent inline-block">
              Игры
            </span>
          </motion.h1>

          <div className="w-full mt-10 sm:mt-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game) => (
                <motion.div
                  key={game.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className={`rounded-2xl bg-gradient-to-br from-[#001e1d]/40 to-[#004643]/40 border border-[#f9bc60]/20 p-4 ${!gamesEnabled ? "opacity-90" : ""}`}
                >
                  {gamesEnabled ? (
                    <Link
                      href={game.href}
                      className="block rounded-xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f9bc60]/60"
                    >
                      <div className="rounded-xl overflow-hidden relative">
                        <Image
                          src={game.image}
                          alt={game.title}
                          width={640}
                          height={480}
                          className="w-full h-44 sm:h-48 object-cover"
                        />
                        <span className="absolute top-3 left-3 rounded-full bg-[#f9bc60] text-[#001e1d] text-xs font-semibold px-3 py-1">
                          {game.badge}
                        </span>
                      </div>
                      <div className="mt-4">
                        <div className="text-xl font-bold text-[#fffffe]">{game.title}</div>
                        <div className="text-sm text-[#abd1c6] mt-1">{game.description}</div>
                        <div className="text-sm text-[#f9bc60] mt-3">Открыть →</div>
                      </div>
                    </Link>
                  ) : (
                    <div className="block rounded-xl overflow-hidden cursor-not-allowed">
                      <div className="rounded-xl overflow-hidden relative">
                        <Image
                          src={game.image}
                          alt=""
                          width={640}
                          height={480}
                          className="w-full h-44 sm:h-48 object-cover"
                        />
                        <span className="absolute inset-0 flex items-center justify-center bg-[#001e1d]/70 rounded-xl text-[#f9bc60] font-semibold text-lg">
                          Игра ещё не готова
                        </span>
                      </div>
                      <div className="mt-4">
                        <div className="text-sm text-[#abd1c6]">Игра ещё не готова</div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {comingSoon.map((game, index) => (
                <motion.div
                  key={`${game.title}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.6 }}
                  className="rounded-2xl bg-gradient-to-br from-[#001e1d]/30 to-[#004643]/20 border border-[#f9bc60]/10 p-4"
                >
                  <div className="rounded-xl overflow-hidden border border-dashed border-[#f9bc60]/25 h-44 sm:h-48 flex items-center justify-center text-[#abd1c6] text-sm">
                    Скоро
                  </div>
                  <div className="mt-4">
                    <div className="text-xl font-bold text-[#fffffe]">{game.title}</div>
                    <div className="text-sm text-[#abd1c6] mt-1">{game.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
