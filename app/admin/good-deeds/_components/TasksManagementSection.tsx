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
  lastRotatedAt: string;
};

type LoadOptions = {
  showSpinner?: boolean;
  clearNotice?: boolean;
};

function getDifficultyLabel(difficulty: Difficulty): string {
  if (difficulty === "EASY") return "Лёгкие";
  if (difficulty === "MEDIUM") return "Средние";
  return "Тяжёлые";
}

function formatRotationDate(iso: string): string {
  return new Date(iso).toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function TasksManagementSection() {
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [rotating, setRotating] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [tasks, setTasks] = useState<ManagedTask[]>([]);
  const [rotation, setRotation] = useState<RotationPayload | null>(null);

  const load = async (options: LoadOptions = {}) => {
    const { showSpinner = true, clearNotice = true } = options;
    if (showSpinner) {
      setLoading(true);
    }
    if (clearNotice) {
      setNotice(null);
    }
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
      if (showSpinner) {
        setLoading(false);
      }
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
      if (json?.task) {
        setTasks((prev) =>
          prev.map((item) => (item.id === task.id ? json.task : item)),
        );
      }
      setNotice(`Задание «${task.title}» сохранено`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Ошибка сохранения");
    } finally {
      setSavingId(null);
    }
  };

  const rotateNow = async () => {
    if (
      !window.confirm(
        "Сменить набор заданий на сайте? Участникам откроется новый цикл отчётов.",
      )
    ) {
      return;
    }

    setRotating(true);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/good-deeds/tasks/rotate", {
        method: "POST",
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || "Не удалось сменить набор заданий");
      }
      setRotation(json?.rotation || null);
      await load({ showSpinner: false, clearNotice: false });
      setNotice("Набор заданий обновлён вручную");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Ошибка смены набора");
    } finally {
      setRotating(false);
    }
  };

  return (
    <Card variant="darkGlass" className="mb-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-[#fffffe]">Текущие задания</h3>
          <p className="text-sm text-[#abd1c6]">
            На публичной странице показывается по одному заданию каждого уровня.
            Смена набора — только вручную, автоматической ротации нет.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 text-right">
          {rotation ? (
            <p className="text-xs text-[#abd1c6]">
              Цикл v{rotation.version}
              <br />
              <span className="text-[#94a1b2]">
                с {formatRotationDate(rotation.lastRotatedAt)}
              </span>
            </p>
          ) : null}
          <Button
            type="button"
            size="sm"
            disabled={rotating}
            onClick={rotateNow}
            className="rounded-lg bg-[#f9bc60] text-[#001e1d] hover:bg-[#ffca7a]"
          >
            {rotating ? "Смена…" : "Сменить набор заданий"}
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
                      {grouped[difficulty].length ? "текущее" : "нет активного"}
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
                              onChange={(e) => {
                                const nextTask = {
                                  ...task,
                                  isActive: e.target.checked,
                                };
                                setTasks((prev) =>
                                  prev.map((item) =>
                                    item.id === task.id ? nextTask : item,
                                  ),
                                );
                                void patchTask(nextTask);
                              }}
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
                            onBlur={() => void patchTask(task)}
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
                                    ? {
                                        ...item,
                                        reward: Number(e.target.value || 0),
                                      }
                                    : item,
                                ),
                              )
                            }
                            onBlur={() => void patchTask(task)}
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
                          onBlur={() => void patchTask(task)}
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
