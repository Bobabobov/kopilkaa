"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ExternalLink, XCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { AdminHeader } from "../../_components/AdminHeader";

type WithdrawItem = {
  id: string;
  amountBonuses: number;
  bankName: string;
  details: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminComment?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    username?: string | null;
    email?: string | null;
  };
};

export default function AdminGoodDeedWithdrawalsClient() {
  const [items, setItems] = useState<WithdrawItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [commentById, setCommentById] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/good-deeds/withdrawals", {
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Ошибка загрузки");
      setItems(Array.isArray(json?.items) ? json.items : []);
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load().catch(console.error);
  }, []);

  const profileHref = (userId: string) => `/profile/${userId}`;

  const patch = async (id: string, action: "approve" | "reject") => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/good-deeds/withdrawals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          adminComment: commentById[id]?.trim() || "",
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error || "Не удалось обновить заявку");
      }
      setItems((prev) =>
        prev.map((it) =>
          it.id === id
            ? {
                ...it,
                status:
                  action === "approve"
                    ? ("APPROVED" as const)
                    : ("REJECTED" as const),
                adminComment: commentById[id]?.trim() || null,
                reviewedAt: new Date().toISOString(),
              }
            : it,
        ),
      );
      setCommentById((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch (e) {
      alert(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setBusyId(null);
    }
  };

  const pending = items.filter((x) => x.status === "PENDING");
  const processed = items.filter((x) => x.status !== "PENDING");

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 container mx-auto px-4 pb-10 pt-16 sm:px-6 sm:pt-20 md:pt-24 lg:px-8">
        <AdminHeader />

        <Card variant="darkGlass" className="mb-6">
          <h2 className="mb-2 text-2xl font-bold text-[#fffffe]">
            Вывод бонусов за добрые дела
          </h2>
          <p className="text-[#abd1c6]/90">
            Пользователи подают заявку от 100 бонусов (1 бонус = 1 ₽). После
            одобрения переведите средства на указанные реквизиты.
          </p>
        </Card>

        {loading ? (
          <Card variant="default">
            <p className="text-[#abd1c6]">Загрузка...</p>
          </Card>
        ) : (
          <>
            <h3 className="mb-3 text-lg font-bold text-[#fffffe]">
              На проверке ({pending.length})
            </h3>
            {pending.length === 0 ? (
              <Card variant="default" className="mb-10">
                <p className="text-[#abd1c6]">Нет активных заявок.</p>
              </Card>
            ) : (
              <div className="mb-10 space-y-4">
                {pending.map((item) => (
                  <Card key={item.id} variant="darkGlass" className="space-y-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-2xl font-black text-[#f9bc60]">
                          {item.amountBonuses}{" "}
                          <span className="text-base font-semibold text-[#abd1c6]">
                            бонусов (~{item.amountBonuses} ₽)
                          </span>
                        </p>
                        <p className="mt-1 text-sm text-[#abd1c6]">
                          {new Date(item.createdAt).toLocaleString("ru-RU")}
                        </p>
                      </div>
                      <span className="rounded-full border border-[#f9bc60]/40 bg-[#f9bc60]/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#f9bc60]">
                        На проверке
                      </span>
                    </div>

                    <div className="rounded-xl border border-[#abd1c6]/20 bg-black/15 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-[#94a1b2]">
                            Пользователь
                          </p>
                          <Link
                            href={profileHref(item.user.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-flex items-center gap-1.5 font-medium text-[#fffffe] underline-offset-4 transition hover:text-[#f9bc60] hover:underline"
                          >
                            {item.user.name}
                            {item.user.username ? ` (@${item.user.username})` : ""}
                            <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
                          </Link>
                          {item.user.email && (
                            <p className="mt-1 text-xs text-[#abd1c6]/90">
                              {item.user.email}
                            </p>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="shrink-0 rounded-xl border-[#abd1c6]/35 text-[#abd1c6] hover:border-[#f9bc60]/50 hover:bg-[#f9bc60]/10 hover:text-[#fffffe]"
                          asChild
                        >
                          <Link
                            href={profileHref(item.user.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-1.5 h-4 w-4" />
                            Профиль
                          </Link>
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-xl border border-[#abd1c6]/20 bg-black/15 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#94a1b2]">
                        Банк
                      </p>
                      <p className="mt-1 text-[#fffffe]">{item.bankName}</p>
                    </div>

                    <div className="rounded-xl border border-[#f9bc60]/25 bg-[#f9bc60]/8 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#f9bc60]">
                        Реквизиты
                      </p>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#fffffe]/95">
                        {item.details}
                      </p>
                    </div>

                    <textarea
                      value={commentById[item.id] || ""}
                      onChange={(e) =>
                        setCommentById((prev) => ({
                          ...prev,
                          [item.id]: e.target.value,
                        }))
                      }
                      placeholder="Комментарий к решению (виден при отклонении или для заметки)"
                      rows={2}
                      className="w-full resize-y rounded-xl border border-[#abd1c6]/25 bg-[#001e1d]/50 px-3 py-2 text-sm text-[#fffffe] outline-none placeholder:text-[#5c6d7a] focus:border-[#f9bc60]/45"
                    />

                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        disabled={busyId === item.id}
                        className="rounded-xl bg-emerald-600 font-semibold text-white hover:bg-emerald-500"
                        onClick={() => patch(item.id, "approve")}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Одобрить (выплачено)
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={busyId === item.id}
                        className="rounded-xl border-rose-400/50 text-rose-200 hover:bg-rose-950/40"
                        onClick={() => patch(item.id, "reject")}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Отклонить
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            <h3 className="mb-3 text-lg font-bold text-[#fffffe]">
              Обработанные ({processed.length})
            </h3>
            {processed.length === 0 ? (
              <Card variant="default">
                <p className="text-[#abd1c6]">Пока нет записей.</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {processed.map((item) => (
                  <Card
                    key={item.id}
                    variant="darkGlass"
                    className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[#fffffe]">
                        {item.amountBonuses} бон. ·{" "}
                        <Link
                          href={profileHref(item.user.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#f9bc60] underline-offset-2 hover:underline"
                        >
                          {item.user.name}
                          <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
                        </Link>
                      </p>
                      <p className="text-xs text-[#94a1b2]">
                        {item.bankName} ·{" "}
                        {new Date(item.createdAt).toLocaleString("ru-RU")}
                      </p>
                      {item.adminComment && (
                        <p className="mt-1 text-xs text-[#abd1c6]">
                          {item.adminComment}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-[#abd1c6]/35 text-[#abd1c6] hover:border-[#f9bc60]/50 hover:bg-[#f9bc60]/10 hover:text-[#fffffe]"
                        asChild
                      >
                        <Link
                          href={profileHref(item.user.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Профиль
                        </Link>
                      </Button>
                      <span
                        className={
                          item.status === "APPROVED"
                            ? "text-emerald-400"
                            : "text-rose-400"
                        }
                      >
                        {item.status === "APPROVED"
                          ? "Одобрено"
                          : "Отклонено"}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
