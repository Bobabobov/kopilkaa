"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Difficulty = "EASY" | "MEDIUM" | "HARD";

type ManagedTask = {
  id: string;
  difficulty: Difficulty;
  title: string;
  description: string;
  reward: number;
  isActive: boolean;
  sortOrder: number;
};

type RotationPayload = {
  version: number;
  nextRotationAt: string;
  lastRotatedAt: string;
};

function getDifficultyLabel(difficulty: Difficulty): string {
  if (difficulty === "EASY") return "Лёгкие";
  if (difficulty === "MEDIUM") return "Средние";
  return "Тяжёлые";
}

function formatMsLeft(ms: number): string {
  if (ms <= 0) return "идёт обновление...";
  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  return `${days}д ${hours}ч ${minutes}м`;
}

export function TasksManagementSection() {
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [rotating, setRotating] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [tasks, setTasks] = useState<ManagedTask[]>([]);
  const [rotation, setRotation] = useState<RotationPayload | null>(null);
  const [nowTs, setNowTs] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNowTs(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const load = async () => {
    setLoading(true);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/good-deeds/tasks", {
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || "Не удалось загрузить задания");
      }
      setTasks(Array.isArray(json?.tasks) ? json.tasks : []);
      setRotation(json?.rotation || null);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load().catch(console.error);
  }, []);

  const grouped = useMemo(() => {
    return {
      EASY: tasks.filter((task) => task.difficulty === "EASY"),
      MEDIUM: tasks.filter((task) => task.difficulty === "MEDIUM"),
      HARD: tasks.filter((task) => task.difficulty === "HARD"),
    };
  }, [tasks]);

  const msLeft = useMemo(() => {
    if (!rotation?.nextRotationAt) return 0;
    return Math.max(0, new Date(rotation.nextRotationAt).getTime() - nowTs);
  }, [rotation?.nextRotationAt, nowTs]);

  const patchTask = async (task: ManagedTask) => {
    setSavingId(task.id);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/good-deeds/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: task.id,
          title: task.title,
          description: task.description,
          reward: task.reward,
          isActive: task.isActive,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || "Не удалось сохранить задание");
      }
      setNotice(`Задание «${task.title}» обновлено`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Ошибка сохранения");
    } finally {
      setSavingId(null);
    }
  };

  const rotateNow = async () => {
    setRotating(true);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/good-deeds/tasks/rotate", {
        method: "POST",
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || "Не удалось сменить цикл заданий");
      }
      setRotation(json?.rotation || null);
      setNotice("Цикл заданий переключён вручную");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Ошибка смены цикла");
    } finally {
      setRotating(false);
    }
  };

  return (
    <Card variant="darkGlass" className="mb-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-[#fffffe]">
            Управление заданиями
          </h3>
          <p className="text-sm text-[#abd1c6]">
            Редактируйте задания, цену и включение. Ротация влияет на текущий
            цикл.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 text-right">
          <p className="text-sm text-[#abd1c6]">
            До авто-смены:{" "}
            <span className="font-bold text-[#f9bc60]">{formatMsLeft(msLeft)}</span>
          </p>
          <Button
            type="button"
            size="sm"
            disabled={rotating}
            onClick={rotateNow}
            className="rounded-lg bg-[#f9bc60] text-[#001e1d] hover:bg-[#ffca7a]"
          >
            Сменить задания сейчас
          </Button>
        </div>
      </div>

      {notice ? <p className="mb-3 text-sm text-[#abd1c6]">{notice}</p> : null}
      {loading ? <p className="text-[#abd1c6]">Загрузка заданий...</p> : null}

      {!loading &&
        (["EASY", "MEDIUM", "HARD"] as Difficulty[]).map((difficulty) => (
          <div key={difficulty} className="mb-5">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                value={`difficulty-${difficulty}`}
                className="rounded-xl border border-[#abd1c6]/20 bg-[#001e1d]/35 px-3"
              >
                <AccordionTrigger className="py-3 text-base">
                  <div className="flex items-center gap-3">
                    <span>{getDifficultyLabel(difficulty)}</span>
                    <span className="rounded bg-[#f9bc60]/20 px-2 py-0.5 text-xs text-[#f9bc60]">
                      {grouped[difficulty].length} шт.
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {grouped[difficulty].map((task) => (
                      <div
                        key={task.id}
                        className="rounded-xl border border-[#abd1c6]/20 bg-[#001e1d]/40 p-3"
                      >
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="rounded bg-[#f9bc60]/20 px-2 py-0.5 text-xs text-[#f9bc60]">
                            {task.id}
                          </span>
                          <label className="ml-auto flex items-center gap-2 text-xs text-[#abd1c6]">
                            <input
                              type="checkbox"
                              checked={task.isActive}
                              onChange={(e) =>
                                setTasks((prev) =>
                                  prev.map((item) =>
                                    item.id === task.id
                                      ? { ...item, isActive: e.target.checked }
                                      : item,
                                  ),
                                )
                              }
                            />
                            активно
                          </label>
                        </div>
                        <div className="grid gap-2 md:grid-cols-2">
                          <Input
                            value={task.title}
                            onChange={(e) =>
                              setTasks((prev) =>
                                prev.map((item) =>
                                  item.id === task.id
                                    ? { ...item, title: e.target.value }
                                    : item,
                                ),
                              )
                            }
                            className="border-[#abd1c6]/30 bg-[#001e1d]/60 text-[#fffffe]"
                          />
                          <Input
                            type="number"
                            min={1}
                            value={task.reward}
                            onChange={(e) =>
                              setTasks((prev) =>
                                prev.map((item) =>
                                  item.id === task.id
                                    ? { ...item, reward: Number(e.target.value || 0) }
                                    : item,
                                ),
                              )
                            }
                            className="border-[#abd1c6]/30 bg-[#001e1d]/60 text-[#fffffe]"
                          />
                        </div>
                        <textarea
                          value={task.description}
                          onChange={(e) =>
                            setTasks((prev) =>
                              prev.map((item) =>
                                item.id === task.id
                                  ? { ...item, description: e.target.value }
                                  : item,
                              ),
                            )
                          }
                          rows={3}
                          className="mt-2 w-full rounded-md border border-[#abd1c6]/30 bg-[#001e1d]/60 px-3 py-2 text-sm text-[#fffffe] outline-none focus:border-[#f9bc60]/60"
                        />
                        <div className="mt-2 flex justify-end">
                          <Button
                            type="button"
                            size="sm"
                            disabled={savingId === task.id}
                            onClick={() => void patchTask(task)}
                          >
                            Сохранить
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ))}
    </Card>
  );
}
