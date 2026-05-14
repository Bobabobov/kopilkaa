"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clipboard, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { LucideIcons } from "@/components/ui/LucideIcons";

type ReferralProgramResponse = {
  ok: boolean;
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

  const disabledCopy = !data?.availability.available || loading || !!error;

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card variant="darkGlass" padding="md" className="border-white/[0.08]">
          <div className="flex items-start gap-3 mb-4">
            <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-48 rounded-md" />
              <Skeleton className="h-3 w-full max-w-[280px] rounded-md" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full shrink-0" />
          </div>
          <Separator className="mb-4 bg-white/10" />
          <div className="flex flex-col gap-2 sm:flex-row">
            <Skeleton className="h-10 flex-1 rounded-xl" />
            <Skeleton className="h-10 w-full sm:w-[120px] rounded-xl" />
          </div>
          <div className="mt-4 pt-4 border-t border-[#abd1c6]/10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-3 w-full max-w-[220px] rounded-md" />
            <Skeleton className="h-9 w-full sm:w-28 rounded-md" />
          </div>
        </Card>
      </motion.div>
    );
  }

  if (!data || error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card variant="darkGlass" padding="md" className="border-white/[0.08]">
          <p className="text-sm text-[#abd1c6]">
            {error || "Не удалось загрузить данные"}
          </p>
        </Card>
      </motion.div>
    );
  }

  const { referralUrl, availability } = data;

  async function handleCopy() {
    if (!availability.available) return;
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card variant="darkGlass" padding="md" className="border-white/[0.08]">
        <CardHeader className="!mb-0 flex flex-col gap-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <CardTitle
              icon={
                <LucideIcons.Users className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
              }
            >
              Реферальная программа
            </CardTitle>
            <Badge
              variant={availability.available ? "success" : "secondary"}
              className="shrink-0"
            >
              <Clock className="h-3 w-3" aria-hidden />
              {availability.available ? "Активна" : "Скоро"}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#abd1c6] leading-relaxed">
            {availability.available
              ? "Поделитесь ссылкой. Бонус начисляется после одобрения заявки приглашённого."
              : `Ссылка станет доступна через ${formatRemainingTime(remainingMs)}.`}
          </p>
        </CardHeader>

        <Separator className="my-4 bg-white/10" />

        <CardContent className="space-y-0">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
            <Input
              id="referral-link-input"
              value={referralUrl}
              readOnly
              disabled
              className="min-h-10 font-mono text-xs sm:text-sm"
            />
            <Button
              type="button"
              variant="secondary"
              disabled={disabledCopy}
              onClick={handleCopy}
              className="h-10 shrink-0 gap-2 rounded-xl sm:w-auto w-full"
            >
              <Clipboard className="h-4 w-4" aria-hidden />
              Копировать
            </Button>
          </div>
        </CardContent>

        <CardFooter className="!mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 border-[#abd1c6]/10">
          <p className="text-[11px] sm:text-xs text-[#667a73] leading-snug max-w-md">
            Статистика и список рефералов — в разделе ниже.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full sm:w-auto shrink-0 border-[#abd1c6]/25 bg-transparent text-[#fffffe] hover:bg-white/5 hover:text-[#fffffe]"
            asChild
          >
            <Link href="/profile/referrals">Подробнее</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
