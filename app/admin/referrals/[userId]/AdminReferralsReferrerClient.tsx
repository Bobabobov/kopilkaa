"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AdminHeader } from "../../_components/AdminHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface ReferrerInfo {
  userId: string;
  displayName: string;
  email: string | null;
  username: string | null;
  referralCode: string | null;
  createdAt: string;
}

interface ReferredRow {
  userId: string;
  displayName: string;
  email: string | null;
  username: string | null;
  registeredAt: string;
  accountCreatedAt: string;
  bonusGrantedAt: string | null;
}

interface Props {
  userId: string;
}

export default function AdminReferralsReferrerClient({ userId }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [referrer, setReferrer] = useState<ReferrerInfo | null>(null);
  const [referred, setReferred] = useState<ReferredRow[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/referrals/${userId}`, {
        cache: "no-store",
        credentials: "include",
      });
      const raw = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(raw?.error || "Ошибка загрузки");
      }
      setReferrer(raw.referrer as ReferrerInfo);
      setReferred(raw.referred as ReferredRow[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
      setReferrer(null);
      setReferred([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="min-h-screen relative">
      <div className="relative z-10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12">
          <AdminHeader />

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              asChild
              className="w-fit border-[#abd1c6]/25 text-[#abd1c6] hover:text-[#fffffe]"
            >
              <Link href="/admin/referrals">← К сводке рефералов</Link>
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner className="h-10 w-10 text-[#f9bc60]" />
            </div>
          ) : null}

          {error ? (
            <Card
              variant="glass"
              padding="md"
              className="mb-6 border-red-500/30 text-red-200"
            >
              {error}
            </Card>
          ) : null}

          {referrer && !loading ? (
            <>
              <Card
                variant="glass"
                padding="md"
                className="mb-6 border-[#abd1c6]/15"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-[#667a73]">
                  Реферер
                </p>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-xl font-black text-[#fffffe] sm:text-2xl">
                      {referrer.displayName}
                    </h2>
                    <p className="mt-1 text-sm text-[#abd1c6]">
                      {referrer.email ?? "—"}
                      {referrer.username ? (
                        <span className="ml-2">@{referrer.username}</span>
                      ) : null}
                    </p>
                    <p className="mt-1 font-mono text-xs text-[#667a73]">
                      {referrer.userId}
                    </p>
                    {referrer.referralCode ? (
                      <p className="mt-2 text-sm text-[#abd1c6]">
                        Код:{" "}
                        <code className="text-[#f9bc60]">
                          {referrer.referralCode}
                        </code>
                      </p>
                    ) : null}
                  </div>
                  <Button
                    type="button"
                    asChild
                    className="shrink-0 bg-[#f9bc60] text-[#001e1d] hover:bg-[#e8a545]"
                  >
                    <Link href={`/profile/${referrer.userId}`}>
                      Профиль реферера
                    </Link>
                  </Button>
                </div>
              </Card>

              <h3 className="mb-3 text-lg font-bold text-[#fffffe]">
                Зарегистрировались по ссылке ({referred.length})
              </h3>

              {referred.length === 0 ? (
                <Card
                  variant="glass"
                  padding="lg"
                  className="border-[#abd1c6]/15 text-center text-[#abd1c6]"
                >
                  Пока никто не зарегистрировался по этой реферальной ссылке.
                </Card>
              ) : (
                <Card
                  variant="glass"
                  padding="none"
                  className="overflow-hidden border-[#abd1c6]/15"
                >
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-[#abd1c6]/15 bg-[#001e1d]/50">
                          <th className="px-4 py-3 font-bold text-[#abd1c6]">
                            Пользователь
                          </th>
                          <th className="px-4 py-3 font-bold text-[#abd1c6]">
                            Регистрация по ссылке
                          </th>
                          <th className="px-4 py-3 font-bold text-[#abd1c6]">
                            Бонус
                          </th>
                          <th className="px-4 py-3 text-right font-bold text-[#abd1c6]">
                            Действия
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {referred.map((row) => (
                          <tr
                            key={row.userId}
                            className="border-b border-[#abd1c6]/10 hover:bg-[#001e1d]/40"
                          >
                            <td className="px-4 py-3 align-top">
                              <Link
                                href={`/profile/${row.userId}`}
                                className="font-semibold text-[#38bdf8] hover:underline"
                              >
                                {row.displayName}
                              </Link>
                              <div className="mt-0.5 text-xs text-[#94a1b2]">
                                {row.email ?? "—"}
                              </div>
                              <div className="mt-1 font-mono text-[10px] text-[#667a73]">
                                {row.userId}
                              </div>
                            </td>
                            <td className="px-4 py-3 align-top text-[#abd1c6]">
                              {new Date(row.registeredAt).toLocaleString(
                                "ru-RU",
                              )}
                            </td>
                            <td className="px-4 py-3 align-top">
                              {row.bonusGrantedAt ? (
                                <span className="inline-flex rounded-full border border-[#22c55e]/35 bg-[#22c55e]/10 px-2 py-0.5 text-xs font-semibold text-[#86efac]">
                                  Выдан{" "}
                                  {new Date(row.bonusGrantedAt).toLocaleDateString(
                                    "ru-RU",
                                  )}
                                </span>
                              ) : (
                                <span className="text-xs text-[#94a1b2]">
                                  Ожидает одобрения заявки
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right align-top">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                asChild
                                className="border-[#abd1c6]/25 text-[#fffffe]"
                              >
                                <Link href={`/profile/${row.userId}`}>
                                  Профиль
                                </Link>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
