"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { GameCanvas } from "./GameCanvas";
import { getMe, getGameStatus } from "../_services/api";
import type { UserProfile } from "../_types";
import type { CoinCatchStatus } from "../_services/api";
import { playButtonSound } from "../_services/sfx";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { GAME_THEME } from "../_constants/theme";
import { cn } from "@/lib/utils";

export function CoinCatchPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [gameStatus, setGameStatus] = useState<CoinCatchStatus | null>(null);
  const [rulesModalOpen, setRulesModalOpen] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getMe()
      .then((profile) => {
        if (!cancelled) {
          setUser(profile);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const fetchGameStatus = useCallback(() => {
    getGameStatus().then((status) => {
      setGameStatus(status);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    getGameStatus().then(setGameStatus);
  }, [user]);

  useEffect(() => {
    if (gameStatus?.mode === "banned") {
      router.replace("/games");
      return;
    }
  }, [gameStatus?.mode, router]);

  useEffect(() => {
    if (gameStatus?.canPlay && gameStatus.mode === "real") {
      setRulesModalOpen(true);
    }
  }, [gameStatus?.canPlay, gameStatus?.mode]);

  useEffect(() => {
    if (!rulesModalOpen) return;
    const scrollY = window.scrollY;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyPosition = document.body.style.position;
    const prevBodyTop = document.body.style.top;
    const prevBodyWidth = document.body.style.width;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        playButtonSound();
        setRulesModalOpen(false);
      }
    };
    document.addEventListener("keydown", onEscape);
    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.position = prevBodyPosition;
      document.body.style.top = prevBodyTop;
      document.body.style.width = prevBodyWidth;
      window.scrollTo(0, scrollY);
      document.removeEventListener("keydown", onEscape);
    };
  }, [rulesModalOpen]);

  if (gameStatus?.mode === "banned") {
    return (
      <div className={cn("min-h-screen flex items-center justify-center", GAME_THEME.bg.page)} style={{ minHeight: "100dvh" }}>
        <p className={cn("text-sm text-white/60")}>Перенаправление на список игр...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className={cn("min-h-screen flex flex-col items-center justify-center gap-4", GAME_THEME.bg.page)}
        style={{ minHeight: "100dvh" }}
      >
        <div
          className="w-10 h-10 rounded-full border-[3px] border-[#f9bc60]/30 border-t-[#f9bc60] animate-spin"
          aria-hidden
        />
        <p className={cn("text-sm sm:text-base font-medium", GAME_THEME.text.secondary)}>
          Загрузка...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className={cn("min-h-screen flex items-center justify-center p-4", GAME_THEME.bg.page)}
        style={{ minHeight: "100dvh" }}
      >
        <Card
          className={cn("w-full max-w-md rounded-2xl overflow-hidden border-2", GAME_THEME.border.default, GAME_THEME.bg.card, GAME_THEME.shadow.card)}
          padding="none"
        >
          <CardContent className="text-center p-6 sm:p-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#f9bc60]/20 flex items-center justify-center overflow-hidden" aria-hidden>
              <img src="/coin/co/1.png" alt="" className="w-9 h-9 object-contain" />
            </div>
            <h2 className={cn("text-xl sm:text-2xl font-bold mb-2", GAME_THEME.text.primary)}>
              Нужно войти, чтобы играть
            </h2>
            <p className={cn("text-sm sm:text-base mb-6", GAME_THEME.text.secondary)}>
              Войдите в аккаунт, чтобы играть в «Монетка» и попасть в таблицу лидеров.
            </p>
            <Button
              asChild
              className={cn("min-h-[48px] px-6 py-3 rounded-xl shadow-md", GAME_THEME.button.primary)}
            >
              <Link href="/?modal=auth">Войти</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameStatus === null) {
    return (
      <div
        className={cn("min-h-screen flex flex-col items-center justify-center gap-4", GAME_THEME.bg.page)}
        style={{ minHeight: "100dvh" }}
      >
        <div
          className="w-10 h-10 rounded-full border-[3px] border-[#f9bc60]/30 border-t-[#f9bc60] animate-spin"
          aria-hidden
        />
        <p className={cn("text-sm sm:text-base font-medium", GAME_THEME.text.secondary)}>
          Проверка доступа...
        </p>
      </div>
    );
  }

  if (!gameStatus.canPlay) {
    return (
      <div
        className={cn("min-h-screen flex flex-col items-center justify-center gap-4", GAME_THEME.bg.page)}
        style={{ minHeight: "100dvh" }}
      >
        <div
          className="w-10 h-10 rounded-full border-[3px] border-[#f9bc60]/30 border-t-[#f9bc60] animate-spin"
          aria-hidden
        />
        <p className={cn("text-sm sm:text-base font-medium", GAME_THEME.text.secondary)}>
          Проверка доступа...
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn("flex flex-col overflow-hidden", GAME_THEME.bg.page)}
      style={{
        width: "100vw",
        maxWidth: "100vw",
        height: "100dvh",
        marginLeft: "calc(-50vw + 50%)",
        marginRight: "calc(-50vw + 50%)",
        boxSizing: "border-box",
      }}
    >
      <header
        className={cn(
          "flex-shrink-0 flex items-center justify-between gap-2 px-3 sm:px-5 py-2.5 sm:py-3 border-b-2 shadow-md",
          GAME_THEME.bg.header,
          GAME_THEME.border.default
        )}
      >
        <Link
          href="/games"
          onClick={() => playButtonSound()}
          onPointerDown={() => playButtonSound()}
          onPointerEnter={() => playButtonSound()}
          onTouchStart={() => playButtonSound()}
          className={cn(
            "flex items-center gap-1 transition-colors text-sm sm:text-base font-medium whitespace-nowrap px-3 py-2 rounded-lg hover:bg-[#f9bc60]/10 active:bg-[#f9bc60]/15",
            GAME_THEME.text.secondary,
            "hover:text-[#f9bc60]"
          )}
          aria-label="Назад к списку игр"
        >
          ← <span className="hidden sm:inline">Назад</span>
        </Link>
        <h1 className={cn("text-base sm:text-xl font-bold truncate flex-1 text-center px-2 drop-shadow-sm", GAME_THEME.text.primary)}>
          <span className="hidden sm:inline">Монетка</span>
          <span className="sm:hidden">Монетка</span>
        </h1>
        <div className="w-12 sm:w-24" aria-hidden />
      </header>

      <AnimatePresence>
        {rulesModalOpen && gameStatus && gameStatus.canPlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            style={{ touchAction: "none" }}
            onTouchMove={(e) => e.preventDefault()}
            onClick={() => {
              playButtonSound();
              setRulesModalOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="relative w-full max-w-md rounded-2xl border-2 border-[#1e4a47] overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.4),0_24px_48px_rgba(0,0,0,0.5)]"
              style={{ backgroundColor: "#0e2422" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 sm:p-6">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#f9bc60]/15 border border-[#f9bc60]/30 flex items-center justify-center overflow-hidden" aria-hidden>
                  <img src="/coin/co/1.png" alt="" className="w-9 h-9 object-contain" />
                </div>
                <h3 className={cn("text-lg sm:text-xl font-bold text-center mb-1", GAME_THEME.text.primary)}>
                  {gameStatus.mode === "test"
                    ? "Тестовые попытки"
                    : "Зачётная игра"}
                </h3>

                {gameStatus.mode === "test" ? (
                  <>
                    <div className="flex justify-center my-4">
                      <div className="inline-flex items-baseline gap-1.5 px-4 py-2.5 rounded-xl bg-[#f9bc60]/15 border border-[#f9bc60]/40">
                        <span className="text-3xl sm:text-4xl font-bold text-[#f9bc60] tabular-nums">
                          {gameStatus.testAttemptsLeft}
                        </span>
                        <span className="text-sm font-medium text-white/70">из 3</span>
                      </div>
                    </div>
                    <ul className="space-y-2.5 text-sm sm:text-base text-center text-white/80 mb-5 list-none">
                      <li className="flex items-start justify-center gap-2">
                        <span className="text-[#f9bc60] mt-0.5 shrink-0">•</span>
                        <span>Счёт в тестовых играх <strong className="text-white">не попадает</strong> в топ недели</span>
                      </li>
                      <li className="flex items-start justify-center gap-2">
                        <span className="text-[#f9bc60] mt-0.5 shrink-0">•</span>
                        <span>После 3 тестов одна игра будет зачётной — счёт попадёт в топ, затем игра недоступна на неделю</span>
                      </li>
                    </ul>
                  </>
                ) : (
                  <p className="text-sm sm:text-base text-center leading-relaxed mb-5 text-white/80">
                    Эта игра идёт в зачёт. Ваш счёт попадёт в топ недели.
                    <br />
                    <span className="text-white/60">После неё игра будет недоступна на неделю.</span>
                  </p>
                )}

                <Button
                  className={cn("w-full py-3 rounded-xl font-bold", GAME_THEME.button.primary)}
                  onClick={() => {
                    playButtonSound();
                    setRulesModalOpen(false);
                  }}
                >
                  Понятно
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 min-h-0 flex items-center justify-center overflow-auto md:p-8">
        <div className="w-full h-full min-w-0 min-h-0 flex items-center justify-center md:w-[992px] md:h-[572px] md:flex-shrink-0 md:rounded-2xl md:p-[10px] md:bg-[#061210]/90 md:shadow-[0_0_0_1px_rgba(249,188,96,0.3),0_16px_48px_rgba(0,0,0,0.55)]">
          <div className="w-full h-full min-w-0 min-h-0 flex items-center justify-center md:rounded-xl md:bg-gradient-to-b md:from-[#0d2321] md:via-[#0a1a18] md:to-[#071614] md:p-[6px] md:shadow-[inset_0_1px_0_rgba(249,188,96,0.2),inset_0_-1px_0_rgba(0,0,0,0.5)]">
            <div
              className="w-full h-full min-h-0 relative md:max-w-[960px] md:max-h-[540px] md:aspect-video md:rounded-lg md:overflow-hidden md:ring-2 md:ring-[#f9bc60]/55 md:ring-offset-0 md:shadow-[0_6px_24px_rgba(0,0,0,0.65),inset_0_0_0_1px_rgba(249,188,96,0.12)]"
              style={{ minHeight: 0 }}
            >
              <GameCanvas
                onRealGamePlayed={fetchGameStatus}
                onStatusChange={fetchGameStatus}
                onRealGameFinished={() => {
                  getGameStatus().then((s) => {
                    setGameStatus(s);
                    if (s?.mode === "banned") router.replace("/games");
                  });
                }}
                onStatusFromSubmit={(status) => {
                setGameStatus(status);
              }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
