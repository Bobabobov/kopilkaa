"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clipboard, Clock, PauseCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileSectionTitle } from "@/components/profile/ProfileSectionTitle";
import {
  PROFILE_EMERALD_INPUT,
  PROFILE_EMERALD_PANEL,
  normalizePublicReferralUrl,
} from "@/components/profile/profileEmerald";

type ReferralProgramResponse = {
  ok: boolean;
  paused?: boolean;
  pausedMessage?: string | null;
  referralUrl: string;
  availability: {
    available: boolean;
    availableAtMs: number;
  };
};

function formatRemainingTime(ms: number): string {
  const clamped = Math.max(0, ms);
  const totalSeconds = Math.floor(clamped / 1000);
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);

  if (days > 0) return `${days} дн ${hours} ч`;
  if (hours > 0) return `${hours} ч ${minutes} мин`;
  return `${minutes} мин`;
}

export default function ProfileReferralProgramCard() {
  const [data, setData] = useState<ReferralProgramResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const t = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    const fetchReferralProgram = async () => {
      try {
        setError(null);
        setLoading(true);

        const res = await fetch("/api/profile/referral-program", {
          method: "GET",
          cache: "no-store",
        });

        const raw = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(
            raw?.error || "Не удалось загрузить реферальную программу",
          );
        }

        setData(raw as ReferralProgramResponse);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Неизвестная ошибка");
      } finally {
        setLoading(false);
      }
    };

    fetchReferralProgram();
  }, []);

  const remainingMs = useMemo(() => {
    if (!data) return 0;
    return data.availability.availableAtMs - nowMs;
  }, [data, nowMs]);

  const referralUrl = data
    ? normalizePublicReferralUrl(data.referralUrl)
    : "";

  const disabledCopy =
    data?.paused || !data?.availability.available || loading || !!error;

  if (loading) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={PROFILE_EMERALD_PANEL}
      >
        <Skeleton className="mb-4 h-8 w-48 rounded-lg bg-emerald-950/50" />
        <Skeleton className="mb-4 h-3 w-full max-w-[280px] rounded-md bg-emerald-950/50" />
        <div className="flex flex-col gap-2 sm:flex-row">
          <Skeleton className="h-10 flex-1 rounded-xl bg-emerald-950/50" />
          <Skeleton className="h-10 w-full rounded-xl bg-emerald-950/50 sm:w-[120px]" />
        </div>
      </motion.article>
    );
  }

  if (!data || error) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={PROFILE_EMERALD_PANEL}
      >
        <p className="text-sm text-zinc-400">
          {error || "Не удалось загрузить данные"}
        </p>
      </motion.article>
    );
  }

  const { availability, paused, pausedMessage } = data;

  async function handleCopy() {
    if (paused || !availability.available) return;
    try {
      await navigator.clipboard.writeText(referralUrl);
    } catch {
      const input = document.getElementById(
        "referral-link-input",
      ) as HTMLInputElement | null;
      input?.select?.();
      document.execCommand?.("copy");
    }
  }

  return (
    <motion.article
      id="profile-referral"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={PROFILE_EMERALD_PANEL}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <ProfileSectionTitle
          imageSrc="/icon/pig15.png"
          imageAlt="Реферальная программа"
          title="Реферальная программа"
          className="mb-0"
        />
        <Badge
          variant={paused ? "secondary" : availability.available ? "success" : "secondary"}
          className="shrink-0 border-emerald-500/20"
        >
          {paused ? (
            <PauseCircle className="h-3 w-3" aria-hidden />
          ) : (
            <Clock className="h-3 w-3" aria-hidden />
          )}
          {paused
            ? "Временно недоступна"
            : availability.available
              ? "Активна"
              : "Скоро"}
        </Badge>
      </div>

      {paused ? (
        <p className="mb-4 rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2.5 text-xs leading-relaxed text-amber-100/90 sm:text-sm">
          {pausedMessage ||
            "Реферальная программа временно не работает. Мы вернём её позже."}
        </p>
      ) : null}

      <p className="mb-4 text-xs leading-relaxed text-zinc-400 sm:text-sm">
        {paused
          ? "Копирование ссылки и начисление бонусов за приглашения сейчас отключены."
          : availability.available
            ? "Поделитесь ссылкой. Бонус начисляется после одобрения заявки приглашённого."
            : `Ссылка станет доступна через ${formatRemainingTime(remainingMs)}.`}
      </p>

      <Separator className="mb-4 bg-emerald-500/10" />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
        <Input
          id="referral-link-input"
          value={paused ? "Реферальная программа временно не работает" : referralUrl}
          readOnly
          disabled
          className={`min-h-10 font-mono text-xs sm:text-sm ${PROFILE_EMERALD_INPUT}`}
        />
        <Button
          type="button"
          disabled={disabledCopy}
          onClick={handleCopy}
          className="h-10 shrink-0 gap-2 rounded-xl border border-emerald-500/30 bg-emerald-600/80 text-white hover:bg-emerald-500 sm:w-auto w-full"
        >
          <Clipboard className="h-4 w-4" aria-hidden />
          Копировать
        </Button>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-emerald-500/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-[11px] leading-snug text-zinc-500 sm:text-xs">
          Статистика и список рефералов — в разделе ниже.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full shrink-0 border-emerald-500/20 bg-transparent text-zinc-300 hover:bg-emerald-950/40 hover:text-emerald-400 sm:w-auto"
          asChild
        >
          <Link href="/profile/referrals">Подробнее</Link>
        </Button>
      </div>
    </motion.article>
  );
}
