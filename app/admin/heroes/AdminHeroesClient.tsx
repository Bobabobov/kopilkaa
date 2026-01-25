"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AdminHeader } from "../components/AdminHeader";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import Link from "next/link";
import { getPublicProfilePath } from "@/lib/profileUrl";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { useBeautifulNotifications } from "@/components/ui/BeautifulNotificationsProvider";

type ResultUser = {
  id: string;
  username: string | null;
  name: string | null;
  email: string | null;
};

export default function AdminHeroesClient() {
  const { showToast } = useBeautifulToast();
  const { confirm } = useBeautifulNotifications();
  const [identifier, setIdentifier] = useState("");
  const [totalAmount, setTotalAmount] = useState("500");
  const [paymentsCount, setPaymentsCount] = useState("1");
  const [source, setSource] = useState("dalink");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [result, setResult] = useState<{
    user: ResultUser;
    created: { id: string; amount: number }[];
  } | null>(null);
  const [visibilityUser, setVisibilityUser] = useState<
    (ResultUser & { hideFromHeroes: boolean }) | null
  >(null);

  const parsed = useMemo(() => {
    const amount = Math.floor(Number(totalAmount));
    const count = Math.floor(Number(paymentsCount));
    return {
      amount: Number.isFinite(amount) ? amount : 0,
      count: Number.isFinite(count) ? count : 0,
      identifier: identifier.trim(),
    };
  }, [identifier, totalAmount, paymentsCount]);

  const canSubmit =
    !!parsed.identifier &&
    parsed.amount > 0 &&
    parsed.count > 0 &&
    parsed.count <= 50 &&
    parsed.amount >= parsed.count;

  async function submit() {
    if (!canSubmit) {
      showToast(
        "error",
        "Проверьте данные",
        "Укажите пользователя, сумму и количество платежей (count ≤ amount).",
      );
      return;
    }
    setSubmitting(true);
    setResult(null);
    try {
      const r = await fetch("/api/admin/heroes/manual-support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: parsed.identifier,
          totalAmount: parsed.amount,
          paymentsCount: parsed.count,
          source,
          note,
        }),
      });
      const data = await r.json().catch(() => null);
      if (!r.ok) {
        showToast(
          "error",
          "Ошибка",
          data?.error || "Не удалось добавить поддержку",
        );
        return;
      }
      setResult(data?.data ?? null);
      const u = data?.data?.user as ResultUser | undefined;
      showToast(
        "success",
        "Готово",
        `Поддержка добавлена для ${u?.username ? `@${u.username}` : u?.id || "пользователя"}`,
      );
    } catch {
      showToast("error", "Ошибка", "Не удалось выполнить запрос");
    } finally {
      setSubmitting(false);
    }
  }

  async function setVisibility(hide: boolean) {
    const id = parsed.identifier;
    if (!id) {
      showToast(
        "error",
        "Проверьте данные",
        "Укажите пользователя (@username или userId).",
      );
      return;
    }
    const ok = await confirm(
      hide
        ? `Скрыть пользователя ${id} из /heroes? История поддержек сохранится.`
        : `Вернуть пользователя ${id} в /heroes?`,
      hide ? "Скрыть из героев" : "Вернуть в герои",
    );
    if (!ok) return;

    setToggling(true);
    try {
      const r = await fetch("/api/admin/heroes/visibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: id, hide }),
      });
      const data = await r.json().catch(() => null);
      if (!r.ok) {
        showToast(
          "error",
          "Ошибка",
          data?.error || "Не удалось обновить видимость",
        );
        return;
      }
      const user = data?.data?.user as
        | (ResultUser & { hideFromHeroes: boolean })
        | undefined;
      if (user) setVisibilityUser(user);
      showToast(
        "success",
        "Готово",
        hide
          ? "Пользователь скрыт из /heroes"
          : "Пользователь возвращён в /heroes",
      );
    } catch {
      showToast("error", "Ошибка", "Не удалось выполнить запрос");
    } finally {
      setToggling(false);
    }
  }

  const profilePath = result?.user ? getPublicProfilePath(result.user) : null;

  return (
    <div className="min-h-screen relative">
      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12">
          <AdminHeader />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#001e1d] via-[#004643]/90 to-[#001e1d] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-[#abd1c6]/20"
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#fffffe]">
                  Герои — ручное добавление
                </h2>
                <p className="mt-2 text-sm text-[#abd1c6] leading-relaxed max-w-2xl">
                  Добавляйте поддержавших вручную, чтобы они появились в{" "}
                  <Link
                    className="text-[#f9bc60] hover:underline font-semibold"
                    href="/heroes"
                  >
                    /heroes
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#abd1c6]">
                  Пользователь
                </label>
                <input
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="@username или userId"
                  className="w-full px-4 py-3 bg-[#001e1d]/60 border border-[#abd1c6]/30 rounded-xl focus:ring-2 focus:ring-[#f9bc60] focus:border-[#f9bc60] transition-all text-[#fffffe] placeholder:text-[#abd1c6]/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#abd1c6]">
                    Сумма (₽)
                  </label>
                  <input
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                    inputMode="numeric"
                    className="w-full px-4 py-3 bg-[#001e1d]/60 border border-[#abd1c6]/30 rounded-xl focus:ring-2 focus:ring-[#f9bc60] focus:border-[#f9bc60] transition-all text-[#fffffe] placeholder:text-[#abd1c6]/60"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#abd1c6]">
                    Кол-во платежей
                  </label>
                  <input
                    value={paymentsCount}
                    onChange={(e) => setPaymentsCount(e.target.value)}
                    inputMode="numeric"
                    className="w-full px-4 py-3 bg-[#001e1d]/60 border border-[#abd1c6]/30 rounded-xl focus:ring-2 focus:ring-[#f9bc60] focus:border-[#f9bc60] transition-all text-[#fffffe] placeholder:text-[#abd1c6]/60"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#abd1c6]">
                  Источник
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full px-4 py-3 bg-[#001e1d]/60 border border-[#abd1c6]/30 rounded-xl focus:ring-2 focus:ring-[#f9bc60] focus:border-[#f9bc60] transition-all text-[#fffffe]"
                >
                  <option value="dalink">dalink.to</option>
                  <option value="donationalerts">DonationAlerts</option>
                  <option value="manual">manual</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#abd1c6]">
                  Комментарий (опционально)
                </label>
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Например: донат от 03.01.2026, чек #123"
                  className="w-full px-4 py-3 bg-[#001e1d]/60 border border-[#abd1c6]/30 rounded-xl focus:ring-2 focus:ring-[#f9bc60] focus:border-[#f9bc60] transition-all text-[#fffffe] placeholder:text-[#abd1c6]/60"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={submit}
                disabled={!canSubmit || submitting}
                className="px-5 py-3 rounded-xl bg-[#f9bc60] hover:bg-[#e8a545] disabled:bg-[#6B7280] text-[#001e1d] font-bold transition-colors inline-flex items-center justify-center gap-2"
              >
                <LucideIcons.Plus size="sm" />
                {submitting ? "Добавляем..." : "Добавить поддержку"}
              </button>

              {profilePath && (
                <Link
                  href={profilePath}
                  className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-[#fffffe] font-semibold border border-white/10 transition-colors inline-flex items-center justify-center gap-2"
                >
                  <LucideIcons.User size="sm" />
                  Открыть профиль
                </Link>
              )}

              <Link
                href="/heroes"
                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-[#fffffe] font-semibold border border-white/10 transition-colors inline-flex items-center justify-center gap-2"
              >
                <LucideIcons.Trophy size="sm" />
                Открыть /heroes
              </Link>
            </div>

            {result && (
              <div className="mt-6 rounded-2xl border border-[#abd1c6]/20 bg-[#001e1d]/40 p-4">
                <div className="text-sm font-bold text-[#fffffe] mb-2">
                  Результат
                </div>
                <div className="text-sm text-[#abd1c6]">
                  Пользователь:{" "}
                  <span className="text-[#f9bc60] font-semibold">
                    {result.user.username
                      ? `@${result.user.username}`
                      : result.user.id}
                  </span>{" "}
                  ({result.user.name || result.user.email || "без имени"})
                </div>
                <div className="mt-2 text-xs text-[#abd1c6]/90">
                  Создано записей: {result.created.length}. Сумма:{" "}
                  {result.created.reduce((s, it) => s + it.amount, 0)}₽.
                </div>
              </div>
            )}

            <div className="mt-8 rounded-2xl border border-[#abd1c6]/20 bg-[#001e1d]/30 p-4 sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm sm:text-base font-black text-[#fffffe]">
                    Видимость в /heroes
                  </div>
                  <div className="mt-1 text-xs sm:text-sm text-[#abd1c6]">
                    Скрывает/возвращает пользователя в витрину героев без
                    удаления истории.
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => setVisibility(true)}
                  disabled={!parsed.identifier || toggling}
                  className="px-4 py-2.5 rounded-2xl bg-transparent hover:bg-white/5 text-[#fffffe] text-sm font-medium transition-colors inline-flex items-center justify-center gap-2 border border-white/15 disabled:opacity-50"
                >
                  <LucideIcons.EyeOff size="sm" />
                  Скрыть из /heroes
                </button>
                <button
                  type="button"
                  onClick={() => setVisibility(false)}
                  disabled={!parsed.identifier || toggling}
                  className="px-4 py-2.5 rounded-2xl bg-transparent hover:bg-white/5 text-[#fffffe] text-sm font-medium transition-colors inline-flex items-center justify-center gap-2 border border-white/15 disabled:opacity-50"
                >
                  <LucideIcons.Eye size="sm" />
                  Вернуть в /heroes
                </button>

                {visibilityUser && (
                  <div className="sm:ml-auto text-xs sm:text-sm text-[#abd1c6] flex items-center gap-2">
                    Статус:{" "}
                    <span className="text-[#f9bc60] font-semibold">
                      {visibilityUser.hideFromHeroes ? "скрыт" : "виден"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
