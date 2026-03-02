"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GameCanvas } from "./GameCanvas";
import { getMe } from "../_services/api";
import type { UserProfile } from "../_types";
import { playButtonSound } from "../_services/sfx";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { GAME_THEME } from "../_constants/theme";
import { cn } from "@/lib/utils";

export function CoinCatchPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getMe().then((profile) => {
      if (!cancelled) {
        setUser(profile);
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

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
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#f9bc60]/20 flex items-center justify-center" aria-hidden>
              <span className="text-2xl">🪙</span>
            </div>
            <h2 className={cn("text-xl sm:text-2xl font-bold mb-2", GAME_THEME.text.primary)}>
              Нужно войти, чтобы играть
            </h2>
            <p className={cn("text-sm sm:text-base mb-6", GAME_THEME.text.secondary)}>
              Войдите в аккаунт, чтобы играть в «Монеткосбор 90-х» и попасть в таблицу лидеров.
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
          <span className="hidden sm:inline">Монеткосбор 90-х</span>
          <span className="sm:hidden">90-х</span>
        </h1>
        <div className="w-12 sm:w-24" aria-hidden />
      </header>
      <div className="flex-1 min-h-0 flex items-center justify-center overflow-auto md:p-8">
        <div className="w-full h-full min-w-0 min-h-0 flex items-center justify-center md:w-[992px] md:h-[572px] md:flex-shrink-0 md:rounded-2xl md:p-[10px] md:bg-[#061210]/90 md:shadow-[0_0_0_1px_rgba(249,188,96,0.3),0_16px_48px_rgba(0,0,0,0.55)]">
          <div className="w-full h-full min-w-0 min-h-0 flex items-center justify-center md:rounded-xl md:bg-gradient-to-b md:from-[#0d2321] md:via-[#0a1a18] md:to-[#071614] md:p-[6px] md:shadow-[inset_0_1px_0_rgba(249,188,96,0.2),inset_0_-1px_0_rgba(0,0,0,0.5)]">
            <div
              className="w-full h-full min-h-0 relative md:max-w-[960px] md:max-h-[540px] md:aspect-video md:rounded-lg md:overflow-hidden md:ring-2 md:ring-[#f9bc60]/55 md:ring-offset-0 md:shadow-[0_6px_24px_rgba(0,0,0,0.65),inset_0_0_0_1px_rgba(249,188,96,0.12)]"
              style={{ minHeight: 0 }}
            >
              <GameCanvas />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
