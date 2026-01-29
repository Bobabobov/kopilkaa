"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GameCanvas } from "./GameCanvas";
import { getMe } from "../_services/api";
import type { UserProfile } from "../_types";

export function CoinCatchPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const profile = await getMe();
      setUser(profile);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#0f1614]"
        style={{ minHeight: "100dvh" }}
      >
        <div
          className="w-10 h-10 rounded-full border-3 border-[#f9bc60]/30 border-t-[#f9bc60] animate-spin"
          style={{ borderWidth: 3 }}
        />
        <p className="text-[#abd1c6] text-sm sm:text-base font-medium">Загрузка...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4 bg-[#0f1614]"
        style={{ minHeight: "100dvh" }}
      >
        <div className="w-full max-w-md rounded-2xl overflow-hidden bg-[#001e1d]/95 border-2 border-[#f9bc60]/40 shadow-lg shadow-black/20">
          <div className="p-6 sm:p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#f9bc60]/20 flex items-center justify-center">
              <span className="text-2xl" aria-hidden>🪙</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#fffffe] mb-2">
              Нужно войти, чтобы играть
            </h2>
            <p className="text-[#abd1c6] text-sm sm:text-base mb-6">
              Войдите в аккаунт, чтобы играть в «Монеткосбор 90-х» и попасть в таблицу лидеров.
            </p>
            <Link
              href="/?modal=auth"
              className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-xl bg-[#f9bc60] text-[#001e1d] font-bold text-base hover:bg-[#ffd700] active:scale-[0.98] transition-all shadow-md"
            >
              Войти
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col overflow-hidden bg-[#0f1614]"
      style={{
        width: "100vw",
        maxWidth: "100vw",
        height: "100dvh",
        marginLeft: "calc(-50vw + 50%)",
        marginRight: "calc(-50vw + 50%)",
        boxSizing: "border-box",
      }}
    >
      <header className="flex-shrink-0 flex items-center justify-between gap-2 px-3 sm:px-5 py-2.5 sm:py-3 bg-[#001e1d]/98 border-b-2 border-[#f9bc60]/40 shadow-md">
        <Link
          href="/games"
          className="flex items-center gap-1 text-[#abd1c6] hover:text-[#f9bc60] transition-colors text-sm sm:text-base font-medium whitespace-nowrap px-3 py-2 rounded-lg hover:bg-[#f9bc60]/10 active:bg-[#f9bc60]/15"
        >
          ← <span className="hidden sm:inline">Назад</span>
        </Link>
        <h1 className="text-base sm:text-xl font-bold text-[#fffffe] truncate flex-1 text-center px-2 drop-shadow-sm">
          <span className="hidden sm:inline">Монеткосбор 90-х</span>
          <span className="sm:hidden">90-х</span>
        </h1>
        <div className="w-12 sm:w-24" aria-hidden />
      </header>
      {/* Игровая область: на десктопе — окно фиксированного размера по центру экрана */}
      <div className="flex-1 min-h-0 flex items-center justify-center overflow-auto md:p-8">
        <div className="w-full h-full min-w-0 min-h-0 flex items-center justify-center md:w-[992px] md:h-[572px] md:flex-shrink-0 md:rounded-2xl md:p-[10px] md:bg-[#061210]/90 md:shadow-[0_0_0_1px_rgba(249,188,96,0.3),0_16px_48px_rgba(0,0,0,0.55)]">
          <div className="w-full h-full min-w-0 min-h-0 flex items-center justify-center md:rounded-xl md:bg-gradient-to-b md:from-[#0d2321] md:via-[#0a1a18] md:to-[#071614] md:p-[6px] md:shadow-[inset_0_1px_0_rgba(249,188,96,0.2),inset_0_-1px_0_rgba(0,0,0,0.5)]">
            <div
              className="w-full h-full min-w-0 min-h-0 relative md:max-w-[960px] md:max-h-[540px] md:aspect-video md:rounded-lg md:overflow-hidden md:ring-2 md:ring-[#f9bc60]/55 md:ring-offset-0 md:shadow-[0_6px_24px_rgba(0,0,0,0.65),inset_0_0_0_1px_rgba(249,188,96,0.12)]"
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
