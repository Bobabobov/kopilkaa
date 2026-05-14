"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import {
  ArrowLeft,
  Users,
  MousePointerClick,
  UserPlus,
  CheckCircle2,
  XCircle,
  Sparkles,
  Copy,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { getMessageFromApiJson } from "@/lib/api/parseApiError";

type ReferralAnalyticsResponse = {
  ok: boolean;
  referralUrl: string;
  availability: {
    available: boolean;
    availableAtMs: number;
  };
  stats: {
    transitionsCount: number;
    registrationsCount: number;
    submissionsCount: number;
    approvedCount: number;
    rejectedCount: number;
  };
  referred: {
    items: Array<{
      referredUserId: string;
      registeredAt: string;
      bonusGrantedAt: string | null;
      displayName: string;
      avatar: string | null;
      submissionsCount: number;
      approvedCount: number;
      rejectedCount: number;
    }>;
    limitedTo: number;
  };
  timeline: {
    last30Days: Array<{
      dayKey: string;
      dayLabel: string;
      clicks: number;
      registrations: number;
    }>;
  };
};

const easeOut = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: easeOut },
  },
};

const chartTooltipStyle = {
  background: "rgba(3, 45, 43, 0.96)",
  border: "1px solid rgba(171, 209, 198, 0.22)",
  borderRadius: "12px",
  color: "#fffffe",
  boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
};

function StatKpi({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  accent: "amber" | "emerald" | "rose" | "sky";
}) {
  const ring =
    accent === "amber"
      ? "from-[#f9bc60]/25 to-[#f9bc60]/5 ring-[#f9bc60]/25"
      : accent === "emerald"
        ? "from-[#22c55e]/25 to-[#22c55e]/5 ring-[#22c55e]/25"
        : accent === "rose"
          ? "from-[#ef4444]/25 to-[#ef4444]/5 ring-[#ef4444]/25"
          : "from-[#38bdf8]/25 to-[#38bdf8]/5 ring-[#38bdf8]/25";

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -3, transition: { duration: 0.22, ease: easeOut } }}
      className="group h-full"
    >
      <Card
        variant="darkGlass"
        padding="none"
        hoverable
        className="h-full overflow-hidden border-white/[0.08] bg-[linear-gradient(165deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0.02)_55%,rgba(0,30,29,0.55)_100%)]"
      >
        <div className="p-4 sm:p-5">
          <div
            className={cn(
              "mb-3 inline-flex rounded-xl bg-gradient-to-br p-2.5 ring-1",
              ring,
            )}
          >
            {icon}
          </div>
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#94a1b2]">
            {label}
          </p>
          <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-[#fffffe] transition-transform duration-300 group-hover:scale-[1.02]">
            {value}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}

function formatRemaining(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d} дн ${h} ч`;
  if (h > 0) return `${h} ч ${m} мин`;
  return `${m} мин`;
}

export default function ReferralAnalyticsPageClient() {
  const [data, setData] = useState<ReferralAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const t = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/profile/referral-program", {
          cache: "no-store",
          credentials: "include",
        });
        const raw = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(
            getMessageFromApiJson(raw, "Не удалось загрузить аналитику"),
          );
        }
        setData(raw as ReferralAnalyticsResponse);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const userBars = useMemo(() => {
    const items = data?.referred?.items ?? [];
    return items.map((it) => ({
      name:
        it.displayName.length > 12
          ? `${it.displayName.slice(0, 12)}…`
          : it.displayName,
      submitted: it.submissionsCount,
      approved: it.approvedCount,
      rejected: it.rejectedCount,
    }));
  }, [data]);

  const linkUnlocked = data?.availability.available ?? true;
  const remainingMs = data
    ? Math.max(0, data.availability.availableAtMs - nowMs)
    : 0;

  async function copyReferralUrl() {
    if (!data?.referralUrl) return;
    try {
      await navigator.clipboard.writeText(data.referralUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // noop
    }
  }

  if (loading) {
    return (
      <main className="relative min-h-screen overflow-hidden px-3 sm:px-5 md:px-8 py-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
        >
          <div className="absolute -top-24 right-0 h-80 w-80 rounded-full bg-[#f9bc60]/20 blur-[100px]" />
          <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-[#1f6a4d]/25 blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-6xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-3">
              <div className="h-8 w-48 animate-pulse rounded-xl bg-white/10" />
              <div className="h-4 w-72 max-w-full animate-pulse rounded-lg bg-white/5" />
            </div>
            <div className="h-10 w-40 animate-pulse rounded-xl bg-white/10" />
          </div>
          <div className="h-28 animate-pulse rounded-2xl bg-white/[0.06]" />
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-2xl bg-white/[0.06]"
                style={{ animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="h-[320px] animate-pulse rounded-2xl bg-white/[0.06]" />
            <div className="h-[320px] animate-pulse rounded-2xl bg-white/[0.06]" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="relative min-h-screen px-3 sm:px-5 md:px-8 py-10">
        <div className="mx-auto max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: easeOut }}
          >
            <Card variant="darkGlass" padding="lg" className="text-center">
              <p className="text-lg font-semibold text-[#fffffe]">
                {error || "Не удалось загрузить страницу"}
              </p>
              <Separator className="my-5 bg-white/10" />
              <Button asChild variant="secondary" className="w-full sm:w-auto">
                <Link href="/profile">Вернуться в профиль</Link>
              </Button>
            </Card>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden px-3 sm:px-5 md:px-8 py-6 sm:py-10">
      {/* Фон: мягкие «орбы» как в премиальных дашбордах (shadcn-подобная глубина) */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-[#f9bc60]/18 blur-[110px]" />
        <div className="absolute top-1/2 left-[-15%] h-[380px] w-[380px] -translate-y-1/2 rounded-full bg-[#1f6a4d]/20 blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[10%] h-[360px] w-[360px] rounded-full bg-[#abd1c6]/10 blur-[90px]" />
      </div>

      <motion.div
        className="relative z-10 mx-auto max-w-6xl space-y-6 sm:space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Шапка */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"
        >
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default" className="gap-1.5 pl-2 pr-2.5">
                <Sparkles className="h-3.5 w-3.5" />
                Приглашения
              </Badge>
              {!linkUnlocked && (
                <Badge variant="secondary">
                  Ссылка через {formatRemaining(remainingMs)}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[#fffffe] sm:text-4xl">
              Как идут ваши приглашения
            </h1>
            <div className="max-w-2xl space-y-3 text-sm leading-relaxed text-[#abd1c6] sm:text-base">
              <p>
                Вы дали людям ссылку — здесь видно, что из этого получилось:
                сколько раз по ней заходили, кто завёл аккаунт и кто дошёл до
                заявки.
              </p>
              <p>
                Бонус мы начислим не в момент регистрации, а когда за того, кого
                вы пригласили, одобрят заявку. Так справедливо для всех.
              </p>
            </div>
          </div>
          <motion.div whileTap={{ scale: 0.97 }}>
            <Button
              asChild
              variant="outline"
              className="shrink-0 border-white/15 bg-white/[0.04] text-[#fffffe] hover:bg-white/[0.08] hover:text-[#fffffe]"
            >
              <Link href="/profile" className="inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Назад в профиль
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Ссылка */}
        <motion.div variants={itemVariants}>
          <Card
            variant="darkGlass"
            padding="none"
            className="overflow-hidden border-[#f9bc60]/20 shadow-[0_0_0_1px_rgba(249,188,96,0.12),0_20px_50px_-24px_rgba(0,0,0,0.45)]"
          >
            <div className="relative px-5 py-5 sm:px-6 sm:py-6">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#f9bc60]/10 via-transparent to-transparent" />
              <CardHeader className="relative mb-0">
                <CardTitle
                  icon={<Copy className="h-5 w-5 text-[#f9bc60]" />}
                  className="text-[#fffffe]"
                >
                  Ваша реферальная ссылка
                </CardTitle>
                <p className="mt-2 text-sm text-[#abd1c6]">
                  Поделитесь ссылкой — мы зафиксируем переход и привяжем
                  регистрацию к вам.
                </p>
              </CardHeader>
              <CardContent className="relative mt-4 flex flex-col gap-3 sm:flex-row sm:items-stretch">
                <Input
                  value={data.referralUrl}
                  readOnly
                  className="h-11 flex-1 border-[#abd1c6]/20 bg-[#001e1d]/80 font-mono text-sm"
                />
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={copyReferralUrl}
                    disabled={!linkUnlocked}
                    className="h-11 min-w-[132px] shrink-0 bg-[#f9bc60] text-[#001e1d] hover:bg-[#e8a545]"
                  >
                    {copied ? "Скопировано ✓" : "Копировать"}
                  </Button>
                </motion.div>
              </CardContent>
            </div>
          </Card>
        </motion.div>

        {/* KPI */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5"
        >
          <StatKpi
            label="Переходы"
            value={data.stats.transitionsCount}
            accent="amber"
            icon={<MousePointerClick className="h-5 w-5 text-[#f9bc60]" />}
          />
          <StatKpi
            label="Регистрации"
            value={data.stats.registrationsCount}
            accent="emerald"
            icon={<UserPlus className="h-5 w-5 text-[#22c55e]" />}
          />
          <StatKpi
            label="Подали заявки"
            value={data.stats.submissionsCount}
            accent="sky"
            icon={<Users className="h-5 w-5 text-[#38bdf8]" />}
          />
          <StatKpi
            label="Одобрено"
            value={data.stats.approvedCount}
            accent="emerald"
            icon={<CheckCircle2 className="h-5 w-5 text-[#22c55e]" />}
          />
          <StatKpi
            label="Отклонено"
            value={data.stats.rejectedCount}
            accent="rose"
            icon={<XCircle className="h-5 w-5 text-[#ef4444]" />}
          />
        </motion.div>

        {/* Графики */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 xl:gap-6">
          <motion.div variants={itemVariants}>
            <Card
              variant="darkGlass"
              padding="none"
              className="overflow-hidden border-white/[0.08]"
            >
              <div className="border-b border-white/[0.06] px-5 py-4 sm:px-6">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-[#f9bc60]/15 p-2 ring-1 ring-[#f9bc60]/25">
                    <BarChart3 className="h-5 w-5 text-[#f9bc60]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[#fffffe]">
                      Динамика за 30 дней
                    </h2>
                    <p className="mt-0.5 text-xs text-[#94a1b2] sm:text-sm">
                      Переходы и новые регистрации по дням
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[#001e1d]/30 px-2 pb-4 pt-2 sm:px-4">
                <div className="h-[300px] sm:h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data.timeline.last30Days}>
                      <defs>
                        <linearGradient
                          id="fillClicks"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#f9bc60"
                            stopOpacity={0.35}
                          />
                          <stop
                            offset="100%"
                            stopColor="#f9bc60"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="fillRegs"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#22c55e"
                            stopOpacity={0.28}
                          />
                          <stop
                            offset="100%"
                            stopColor="#22c55e"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(171,209,198,0.12)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="dayLabel"
                        stroke="#94a1b2"
                        tick={{ fontSize: 11, fill: "#94a1b2" }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#94a1b2"
                        tick={{ fontSize: 11, fill: "#94a1b2" }}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip contentStyle={chartTooltipStyle} />
                      <Legend
                        wrapperStyle={{ paddingTop: 8 }}
                        formatter={(v) => (
                          <span className="text-xs text-[#abd1c6]">{v}</span>
                        )}
                      />
                      <Area
                        type="monotone"
                        dataKey="clicks"
                        name="Переходы"
                        stroke="#f9bc60"
                        strokeWidth={2}
                        fill="url(#fillClicks)"
                        dot={false}
                        activeDot={{ r: 5, strokeWidth: 0, fill: "#f9bc60" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="registrations"
                        name="Регистрации"
                        stroke="#22c55e"
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 5, strokeWidth: 0, fill: "#22c55e" }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card
              variant="darkGlass"
              padding="none"
              className="overflow-hidden border-white/[0.08]"
            >
              <div className="border-b border-white/[0.06] px-5 py-4 sm:px-6">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-[#38bdf8]/15 p-2 ring-1 ring-[#38bdf8]/25">
                    <Users className="h-5 w-5 text-[#38bdf8]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[#fffffe]">
                      Заявки по рефералам
                    </h2>
                    <p className="mt-0.5 text-xs text-[#94a1b2] sm:text-sm">
                      Сравнение по каждому приглашённому пользователю
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[#001e1d]/30 px-2 pb-4 pt-2 sm:px-4">
                {userBars.length === 0 ? (
                  <div className="flex h-[300px] flex-col items-center justify-center gap-2 text-center sm:h-[320px]">
                    <p className="text-sm font-medium text-[#abd1c6]">
                      Пока нет рефералов для графика
                    </p>
                    <p className="max-w-xs text-xs text-[#667a73]">
                      Как только кто-то зарегистрируется по ссылке, здесь
                      появится сравнение заявок.
                    </p>
                  </div>
                ) : (
                  <div className="h-[300px] sm:h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={userBars} barGap={4}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(171,209,198,0.12)"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="name"
                          stroke="#94a1b2"
                          tick={{ fontSize: 11, fill: "#94a1b2" }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#94a1b2"
                          tick={{ fontSize: 11, fill: "#94a1b2" }}
                          tickLine={false}
                          axisLine={false}
                          allowDecimals={false}
                        />
                        <Tooltip contentStyle={chartTooltipStyle} />
                        <Legend />
                        <Bar
                          dataKey="submitted"
                          name="Подали"
                          fill="#f9bc60"
                          radius={[6, 6, 0, 0]}
                          maxBarSize={36}
                        />
                        <Bar
                          dataKey="approved"
                          name="Одобрено"
                          fill="#22c55e"
                          radius={[6, 6, 0, 0]}
                          maxBarSize={36}
                        />
                        <Bar
                          dataKey="rejected"
                          name="Отклонено"
                          fill="#ef4444"
                          radius={[6, 6, 0, 0]}
                          maxBarSize={36}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Таблица */}
        <motion.div variants={itemVariants}>
          <Card
            variant="darkGlass"
            padding="none"
            className="overflow-hidden border-white/[0.08]"
          >
            <div className="flex flex-col gap-1 border-b border-white/[0.06] px-5 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
              <div>
                <h2 className="text-lg font-semibold text-[#fffffe]">
                  Рефералы
                </h2>
                <p className="text-xs text-[#94a1b2] sm:text-sm">
                  До {data.referred.limitedTo} последних регистраций
                </p>
              </div>
              <Badge variant="muted" className="w-fit">
                Всего: {data.referred.items.length}
              </Badge>
            </div>

            {data.referred.items.length === 0 ? (
              <div className="px-5 py-12 text-center sm:px-6">
                <p className="text-sm text-[#abd1c6]">
                  Пока никто не зарегистрировался по вашей ссылке.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06] bg-[#001e1d]/40 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94a1b2]">
                      <th className="px-5 py-3 sm:px-6">Пользователь</th>
                      <th className="px-3 py-3">Регистрация</th>
                      <th className="px-3 py-3 text-center">Подали</th>
                      <th className="px-3 py-3 text-center">Одобрено</th>
                      <th className="px-3 py-3 text-center">Отклонено</th>
                      <th className="px-5 py-3 text-right sm:px-6">Бонус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.referred.items.map((it, idx) => (
                      <motion.tr
                        key={it.referredUserId}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.04 * idx,
                          duration: 0.35,
                          ease: easeOut,
                        }}
                        className="border-b border-white/[0.04] text-[#fffffe] transition-colors hover:bg-white/[0.04]"
                      >
                        <td className="px-5 py-3.5 sm:px-6">
                          <div className="flex items-center gap-3">
                            {it.avatar ? (
                              <img
                                src={it.avatar}
                                alt=""
                                className="h-9 w-9 rounded-full border border-white/10 object-cover"
                              />
                            ) : (
                              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-xs font-bold text-[#abd1c6]">
                                {it.displayName.slice(0, 1).toUpperCase()}
                              </div>
                            )}
                            <span className="font-medium">
                              {it.displayName}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-3.5 text-[#abd1c6] tabular-nums">
                          {new Date(it.registeredAt).toLocaleDateString(
                            "ru-RU",
                          )}
                        </td>
                        <td className="px-3 py-3.5 text-center tabular-nums">
                          {it.submissionsCount}
                        </td>
                        <td className="px-3 py-3.5 text-center tabular-nums text-[#4ade80]">
                          {it.approvedCount}
                        </td>
                        <td className="px-3 py-3.5 text-center tabular-nums text-[#f87171]">
                          {it.rejectedCount}
                        </td>
                        <td className="px-5 py-3.5 text-right sm:px-6">
                          {it.bonusGrantedAt ? (
                            <Badge variant="success">Выдан</Badge>
                          ) : (
                            <Badge variant="secondary">Ожидает</Badge>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </main>
  );
}
