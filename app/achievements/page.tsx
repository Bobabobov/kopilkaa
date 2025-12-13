"use client";

import { useEffect, useMemo, useState } from "react";
import PixelBackground from "@/components/ui/PixelBackground";
import { AchievementCard } from "@/components/achievements/AchievementCard";
import { AchievementProgress, AchievementRarity, RARITY_NAMES, RARITY_COLORS } from "@/lib/achievements/types";

interface ApiResponse {
  success?: boolean;
  data?: {
    progress?: AchievementProgress[];
  };
  error?: string;
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div
          key={idx}
          className="h-44 rounded-2xl border border-white/10 bg-white/5 animate-pulse"
        />
      ))}
    </div>
  );
}

export default function AchievementsPage() {
  const [progress, setProgress] = useState<AchievementProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const [search, setSearch] = useState("");
  const [rarity, setRarity] = useState<AchievementRarity | "ALL">("ALL");
  const [status, setStatus] = useState<"ALL" | "UNLOCKED" | "LOCKED">("ALL");

  const total = progress.length;
  const unlocked = progress.filter((p) => p.isUnlocked).length;
  const completion = total ? Math.round((unlocked / total) * 100) : 0;
  const rarityCounts = useMemo(() => {
    const base: Record<AchievementRarity, { total: number; unlocked: number }> = {
      COMMON: { total: 0, unlocked: 0 },
      RARE: { total: 0, unlocked: 0 },
      EPIC: { total: 0, unlocked: 0 },
      LEGENDARY: { total: 0, unlocked: 0 },
      EXCLUSIVE: { total: 0, unlocked: 0 },
    };
    progress.forEach((p) => {
      const r = p.achievement.rarity as AchievementRarity;
      if (!base[r]) return;
      base[r].total += 1;
      if (p.isUnlocked) base[r].unlocked += 1;
    });
    return base;
  }, [progress]);
  const activeFilters =
    (search?.trim().length ?? 0) > 0
      ? 1
      : 0 + (rarity !== "ALL" ? 1 : 0) + (status !== "ALL" ? 1 : 0);

  const raritySummaryCards = Object.entries(rarityCounts).map(([key, value]) => {
    const k = key as AchievementRarity;
    const percent = value.total ? Math.round((value.unlocked / value.total) * 100) : 0;
    return { key: k, ...value, percent };
  });

  const rarityOrder: Record<string, number> = {
    COMMON: 1,
    RARE: 2,
    EPIC: 3,
    LEGENDARY: 4,
    EXCLUSIVE: 5,
  };

  const filtered = useMemo(() => {
    return progress
      .filter((p) => {
      const matchRarity = rarity === "ALL" || p.achievement.rarity === rarity;
      const text = `${p.achievement.name} ${p.achievement.description}`.toLowerCase();
      const matchSearch = text.includes(search.toLowerCase());
      const matchStatus =
        status === "ALL" ? true : status === "UNLOCKED" ? p.isUnlocked : !p.isUnlocked;
        return matchRarity && matchSearch && matchStatus;
      })
      .sort((a, b) => {
        const ra = rarityOrder[a.achievement.rarity] ?? 99;
        const rb = rarityOrder[b.achievement.rarity] ?? 99;
        if (ra !== rb) return ra - rb;
        return a.achievement.name.localeCompare(b.achievement.name);
      });
  }, [progress, rarity, search, status]);
  const filteredCount = filtered.length;

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        // сначала проверяем/выдаём автоачивки
        await loadData();
      } catch (e: any) {
        setError(e?.message || "Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const refreshProgress = async () => {
    try {
      setChecking(true);
      setError(null);
      // триггерим проверку автоачивок
      const check = await fetch("/api/achievements/user/check", { method: "POST" });
      if (check.status === 401) {
        setUnauthorized(true);
        return;
      }
      await loadData();
    } catch (e: any) {
      setError(e?.message || "Ошибка обновления");
    } finally {
      setChecking(false);
    }
  };

  const loadData = async () => {
    const res = await fetch("/api/achievements/user", { cache: "no-store" });
    if (res.status === 401) {
      setUnauthorized(true);
      return;
    }
    const data: ApiResponse = await res.json();
    if (!res.ok || !data?.data?.progress) {
      throw new Error(data?.error || "Не удалось загрузить достижения");
    }
    setProgress(data.data.progress);
  };

  return (
    <div className="min-h-screen relative">
      <PixelBackground />

      <div className="relative z-10 container mx-auto px-4 py-10 space-y-8">
        {/* Hero */}
        <div className="rounded-[28px] border border-white/10 bg-gradient-to-r from-[#0c332e] via-[#0b2a25] to-[#0a201d] p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)] flex flex-col gap-6">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div className="space-y-3 max-w-3xl w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/8 text-[#abd1c6] text-sm border border-white/10">
                Твои награды и прогресс
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-bold text-[#fffffe] drop-shadow-[0_10px_28px_rgba(0,0,0,0.35)]">
                  Достижения
                </h1>
              </div>
              <p className="text-[#abd1c6] leading-relaxed">
                Витрина всех ачивок платформы. Карточки только для просмотра, без кликов. Фильтруй по редкости и статусу, ищи по названию или описанию.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
              {[
                { label: "Всего", value: total, hint: "Количество всех ачивок" },
                { label: "Получено", value: unlocked, hint: "Уже открытые" },
                { label: "Прогресс", value: `${completion}%`, hint: "Доля открытых" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-4 py-3 text-center shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
                >
                  <div className="text-xs text-[#94a1b2]">{item.label}</div>
                  <div className="text-xl font-semibold text-[#fffffe]">{item.value}</div>
                  {item.hint && <div className="text-[10px] text-[#94a1b2]/80 mt-1">{item.hint}</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-[#abd1c6]">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-3 w-3 rounded-full bg-white/70" />
              Получено
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-3 w-3 rounded-full bg-black/40" />
              Не получено
            </div>
          </div>

          {/* Общий прогресс */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row flex-wrap sm:items-center sm:justify-between gap-3 text-xs text-[#abd1c6]">
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#f9bc60]" />
                Общий прогресс
              </span>
              <span className="text-[#fffffe] font-semibold">{completion}%</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden border border-white/10 bg-white/10">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${completion}%`,
                  background: "linear-gradient(90deg, #f9bc60 0%, #f9d18c 100%)",
                  boxShadow: "0 0 12px rgba(249,188,96,0.45)",
                }}
              />
            </div>
            {/* Редкости мини-сводка */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {raritySummaryCards.map((item) => (
                <div
                  key={item.key}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 flex flex-col gap-1 shadow-[0_10px_25px_rgba(0,0,0,0.18)] min-w-[140px]"
                >
                  <div className="flex items-center justify-between text-[11px] text-[#c7d4d0]">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: RARITY_COLORS[item.key] }} />
                      {RARITY_NAMES[item.key]}
                    </span>
                    <span className="font-semibold text-[#fffffe]">{item.percent}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden bg-white/10">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${item.percent}%`,
                        background: `${RARITY_COLORS[item.key]}`,
                        boxShadow: `0 0 8px ${RARITY_COLORS[item.key]}55`,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#94a1b2]">
                    <span>Всего: {item.total}</span>
                    <span>Открыто: {item.unlocked}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Фильтры */}
        <div className="rounded-[24px] border border-white/10 bg-white/5/60 backdrop-blur-xl p-4 sm:p-5 shadow-[0_18px_48px_rgba(0,0,0,0.28)] space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
            <div className="flex-1">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск по названию или описанию"
                className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-[#fffffe] placeholder:text-[#94a1b2] focus:outline-none focus:border-[#f9bc60] focus:ring-2 focus:ring-[#f9bc60]/40"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "ALL", label: "Все" },
                { key: "COMMON", label: "Обычные" },
                { key: "RARE", label: "Редкие" },
                { key: "EPIC", label: "Эпические" },
                { key: "LEGENDARY", label: "Легендарные" },
                { key: "EXCLUSIVE", label: "Эксклюзивные" },
              ].map((item) => {
                const active = rarity === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => setRarity(item.key as any)}
                    className={`px-3 py-2 rounded-xl text-sm font-semibold transition border ${
                      active
                        ? "bg-[#f9bc60] text-[#0b241f] border-[#f9bc60]"
                        : "bg-white/5 text-[#c7d4d0] border-white/10 hover:border-white/20"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {[
              { key: "ALL", label: "Все статусы" },
              { key: "UNLOCKED", label: "Получено" },
              { key: "LOCKED", label: "Не получено" },
            ].map((item) => {
              const active = status === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setStatus(item.key as any)}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition border ${
                    active
                      ? "bg-emerald-500/80 text-[#0b241f] border-emerald-400/80"
                      : "bg-white/5 text-[#c7d4d0] border-white/10 hover:border-white/20"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <button
              onClick={() => {
                setSearch("");
                setRarity("ALL");
                setStatus("ALL");
              }}
              className="px-3 py-2 rounded-xl text-sm font-semibold transition border bg-white/5 text-[#c7d4d0] border-white/10 hover:border-white/20"
            >
              Сбросить
            </button>
            <button
              onClick={refreshProgress}
              disabled={checking}
              className="px-3 py-2 rounded-xl text-sm font-semibold transition border bg-white/5 text-[#c7d4d0] border-white/10 hover:border-white/20 disabled:opacity-50"
            >
              {checking ? "Обновляем..." : "Обновить прогресс"}
            </button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-[#abd1c6]">
            <div className="flex items-center gap-2 flex-wrap">
              <span>Показано {filteredCount} из {total}</span>
              {activeFilters > 0 && (
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[#f9bc60]/15 border border-[#f9bc60]/30 text-[#f9bc60]">
                  Активно фильтров: {activeFilters}
                </span>
              )}
            </div>
            <span className="text-[#94a1b2]">Отфильтруйте, чтобы сузить список</span>
          </div>
        </div>

        {unauthorized ? (
          <div className="rounded-2xl border border-[#f9bc60]/40 bg-[#0a1f1d] p-6 flex flex-col gap-3 max-w-xl">
            <div className="text-lg font-semibold text-[#fffffe]">
              Нужна авторизация
            </div>
            <p className="text-[#abd1c6]">
              Войдите, чтобы увидеть свои достижения и прогресс.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => (window.location.href = "/?modal=auth")}
                className="px-4 py-2 rounded-xl bg-[#f9bc60] text-[#001e1d] font-semibold hover:bg-[#e8a545] transition-colors"
              >
                Войти
              </button>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-6 text-[#f9bc60] max-w-xl">
            {error}
          </div>
        ) : loading ? (
          <LoadingGrid />
        ) : progress.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-[#abd1c6]">
            Достижения недоступны.
          </div>
        ) : (
          <div className="rounded-[30px] border border-white/10 bg-white/5/60 backdrop-blur-xl p-4 sm:p-6 space-y-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((item) => {
                const unlockedAt = item.unlockedAt ? new Date(item.unlockedAt) : undefined;
                const userAchievement = item.isUnlocked
                  ? {
                      id: item.achievement.id,
                      achievementId: item.achievement.id,
                      userId: "",
                      unlockedAt,
                    }
                  : undefined;

                return (
                  <AchievementCard
                    key={item.achievement.id}
                    achievement={item.achievement}
                    userAchievement={userAchievement as any}
                    showProgress
                    progress={item.progress}
                    maxProgress={item.maxProgress}
                    current={item.current ?? item.progress}
                    target={item.target ?? item.maxProgress}
                    interactive={false}
                    className="h-full"
                  />
                );
              })}
            </div>
            {filtered.length === 0 && (
              <div className="text-center text-[#abd1c6] py-6">Ничего не найдено по фильтрам</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

