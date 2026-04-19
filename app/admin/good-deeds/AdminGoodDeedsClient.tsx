"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { AdminHeader } from "../_components/AdminHeader";
import { GOOD_DEED_FIRST_IN_FEED_BONUS_BONUSES } from "@/lib/goodDeedsFirstFeedBonus";

type ModerationItem = {
  id: string;
  taskTitle: string;
  taskDescription: string;
  storyText: string;
  reward: number;
  weekKey: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminComment?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  media: { url: string; type: "IMAGE" | "VIDEO" }[];
  user: {
    id: string;
    name: string;
    username?: string | null;
    avatar?: string | null;
    email?: string | null;
    vkLink?: string | null;
    telegramLink?: string | null;
    youtubeLink?: string | null;
  };
};

export default function AdminGoodDeedsClient() {
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rejectCommentById, setRejectCommentById] = useState<
    Record<string, string>
  >({});

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/good-deeds/submissions", {
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || "Ошибка загрузки модерации");
      }
      setItems(Array.isArray(json?.items) ? json.items : []);
    } catch (error) {
      console.error(error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load().catch(console.error);
  }, []);

  const updateStatus = async (id: string, action: "approve" | "reject") => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/good-deeds/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          adminComment: rejectCommentById[id] || "",
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || "Не удалось обновить статус");
      }
      const bonusGranted =
        action === "approve" && Boolean(json?.firstFeedBonusGranted);
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: action === "approve" ? "APPROVED" : "REJECTED",
                reward: bonusGranted
                  ? item.reward + GOOD_DEED_FIRST_IN_FEED_BONUS_BONUSES
                  : item.reward,
                adminComment:
                  action === "reject" ? rejectCommentById[id] || null : null,
                reviewedAt: new Date().toISOString(),
              }
            : item,
        ),
      );
      if (bonusGranted) {
        alert(
          `Начислен бонус «первый в ленте»: +${GOOD_DEED_FIRST_IN_FEED_BONUS_BONUSES} бонусов к сумме отчёта.`,
        );
      }
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Ошибка");
    } finally {
      setBusyId(null);
    }
  };

  const deleteItem = async (id: string) => {
    if (!window.confirm("Удалить это задание безвозвратно?")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/good-deeds/submissions/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || "Не удалось удалить");
      }
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Ошибка");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-24 pb-10">
        <AdminHeader />

        <Card variant="darkGlass" className="mb-6">
          <h2 className="text-2xl font-bold text-[#fffffe] mb-2">
            Модерация добрых дел
          </h2>
          <p className="text-[#abd1c6]/90">
            Проверяйте рассказ и материалы (фото/видео), затем подтверждайте или
            отклоняйте выполнение заданий.
          </p>
        </Card>

        {loading ? (
          <Card variant="default">
            <p className="text-[#abd1c6]">Загрузка...</p>
          </Card>
        ) : items.length === 0 ? (
          <Card variant="default">
            <p className="text-[#abd1c6]">Список пуст.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id} variant="darkGlass" className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold text-[#fffffe]">
                      {item.taskTitle}
                    </h3>
                    <p className="text-sm text-[#abd1c6]">
                      Награда: +{item.reward} бонусов | Неделя: {item.weekKey}
                    </p>
                    <p className="text-xs mt-1">
                      <span className="text-[#94a1b2]">Статус: </span>
                      <span
                        className={
                          item.status === "APPROVED"
                            ? "text-[#10B981]"
                            : item.status === "REJECTED"
                              ? "text-[#e16162]"
                              : "text-[#f9bc60]"
                        }
                      >
                        {item.status === "APPROVED"
                          ? "Подтверждено"
                          : item.status === "REJECTED"
                            ? "Отклонено"
                            : "На проверке"}
                      </span>
                    </p>
                  </div>
                  <p className="text-xs text-[#94a1b2]">
                    {new Date(item.createdAt).toLocaleString("ru-RU")}
                  </p>
                </div>

                <p className="text-[#abd1c6]/90">{item.taskDescription}</p>

                {item.storyText?.trim() && (
                  <div className="rounded-xl border border-[#f9bc60]/25 bg-[#f9bc60]/8 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#f9bc60] mb-2">
                      Рассказ участника
                    </p>
                    <p className="text-sm text-[#fffffe]/95 whitespace-pre-wrap leading-relaxed">
                      {item.storyText}
                    </p>
                  </div>
                )}

                {item.adminComment && (
                  <div className="rounded-xl border border-[#abd1c6]/20 bg-black/10 p-3 text-sm text-[#abd1c6]">
                    Комментарий администратора: {item.adminComment}
                  </div>
                )}

                <div className="rounded-xl border border-[#abd1c6]/20 bg-black/10 p-3">
                  <p className="text-sm text-[#fffffe] font-medium">
                    Отправитель: {item.user.name}
                    {item.user.username ? ` (@${item.user.username})` : ""}
                  </p>
                  {item.user.email && (
                    <p className="text-xs text-[#94a1b2] mt-1">{item.user.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {item.media.map((media) => (
                    <div
                      key={`${item.id}-${media.url}`}
                      className="rounded-xl overflow-hidden border border-white/10 bg-black/20"
                    >
                      {media.type === "VIDEO" ? (
                        <video src={media.url} controls className="w-full h-52 object-cover" />
                      ) : (
                        <img
                          src={media.url}
                          alt="Отчёт по доброму делу"
                          className="w-full h-52 object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <textarea
                  value={rejectCommentById[item.id] || ""}
                  onChange={(e) =>
                    setRejectCommentById((prev) => ({
                      ...prev,
                      [item.id]: e.target.value,
                    }))
                  }
                  placeholder="Комментарий для пользователя (обязательно при отклонении)"
                  className="w-full min-h-[84px] rounded-xl border border-[#abd1c6]/30 bg-[#003b3a]/70 text-[#fffffe] placeholder:text-[#94a1b2] p-3 text-sm outline-none focus:border-[#f9bc60]"
                />

                <div className="flex flex-col sm:flex-row gap-2">
                  {item.status === "PENDING" && (
                    <>
                      <Button
                        onClick={() => updateStatus(item.id, "approve")}
                        disabled={busyId === item.id}
                        className="bg-[#10B981] hover:bg-[#0fa372] text-white"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Подтвердить
                      </Button>
                      <Button
                        onClick={() => updateStatus(item.id, "reject")}
                        disabled={busyId === item.id}
                        className="bg-[#e16162] hover:bg-[#cf5253] text-white"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Отклонить
                      </Button>
                    </>
                  )}
                  <Button
                    onClick={() => deleteItem(item.id)}
                    disabled={busyId === item.id}
                    className="bg-[#343d49] hover:bg-[#2d3440] text-white"
                  >
                    Удалить
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
