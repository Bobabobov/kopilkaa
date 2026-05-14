"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { GOOD_DEED_FIRST_IN_FEED_BONUS_BONUSES } from "@/lib/goodDeedsFirstFeedBonus";
import { throwIfApiFailed } from "@/lib/api/parseApiError";
import type { ModerationItem, Notice, SortBy, StatusFilter } from "./types";

export function useGoodDeedsModeration() {
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rejectCommentById, setRejectCommentById] = useState<
    Record<string, string>
  >({});
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("PENDING");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("created_desc");

  const load = useCallback(async () => {
    setLoading(true);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/good-deeds/submissions", {
        cache: "no-store",
      });
      const json = await res.json();
      throwIfApiFailed(res, json, "Ошибка загрузки модерации");
      setItems(Array.isArray(json?.items) ? json.items : []);
    } catch (error) {
      console.error(error);
      setItems([]);
      setNotice({
        type: "error",
        text: error instanceof Error ? error.message : "Ошибка загрузки",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load().catch(console.error);
  }, [load]);

  const copyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setNotice({ type: "success", text: `ID скопирован: ${id}` });
    } catch {
      setNotice({ type: "error", text: "Не удалось скопировать ID" });
    }
  };

  const processStatus = async (
    id: string,
    action: "approve" | "reject",
    options?: { silent?: boolean },
  ) => {
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
      throwIfApiFailed(res, json, "Не удалось обновить статус");
      const bonusGranted =
        action === "approve" && Boolean(json?.firstFeedBonusGranted);
      const categoryCompletionBonus =
        action === "approve" ? Number(json?.categoryCompletionBonus || 0) : 0;
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: action === "approve" ? "APPROVED" : "REJECTED",
                reward:
                  item.reward +
                  (bonusGranted ? GOOD_DEED_FIRST_IN_FEED_BONUS_BONUSES : 0) +
                  categoryCompletionBonus,
                adminComment:
                  action === "reject" ? rejectCommentById[id] || null : null,
                reviewedAt: new Date().toISOString(),
              }
            : item,
        ),
      );
      setSelectedIds((prev) => prev.filter((x) => x !== id));

      if (!options?.silent) {
        setNotice({
          type: "success",
          text:
            action === "approve"
              ? bonusGranted || categoryCompletionBonus > 0
                ? `Задание подтверждено. Доп. бонус: +${
                    (bonusGranted ? GOOD_DEED_FIRST_IN_FEED_BONUS_BONUSES : 0) +
                    categoryCompletionBonus
                  }.`
                : "Задание подтверждено."
              : "Задание отклонено.",
        });
      }
      if (!options?.silent && bonusGranted) {
        alert(
          `Начислен бонус «первый в ленте»: +${GOOD_DEED_FIRST_IN_FEED_BONUS_BONUSES} бонусов к сумме отчёта.`,
        );
      }
      if (!options?.silent && categoryCompletionBonus > 0) {
        alert(
          `Начислен бонус за закрытие категории 3/3: +${categoryCompletionBonus} бонусов.`,
        );
      }
      return { ok: true as const };
    } catch (error) {
      console.error(error);
      if (!options?.silent) {
        setNotice({
          type: "error",
          text: error instanceof Error ? error.message : "Ошибка",
        });
      }
      return { ok: false as const, error };
    }
  };

  const updateStatus = async (id: string, action: "approve" | "reject") => {
    setBusyId(id);
    try {
      await processStatus(id, action);
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
      throwIfApiFailed(res, json, "Не удалось удалить");
      setItems((prev) => prev.filter((item) => item.id !== id));
      setNotice({ type: "success", text: "Заявка удалена." });
    } catch (error) {
      console.error(error);
      setNotice({
        type: "error",
        text: error instanceof Error ? error.message : "Ошибка",
      });
    } finally {
      setBusyId(null);
    }
  };

  const stats = useMemo(() => {
    const pending = items.filter((item) => item.status === "PENDING").length;
    const approved = items.filter((item) => item.status === "APPROVED").length;
    const rejected = items.filter((item) => item.status === "REJECTED").length;
    return {
      total: items.length,
      pending,
      approved,
      rejected,
    };
  }, [items]);

  const visibleItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = items.filter((item) => {
      if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
      if (!q) return true;
      return (
        item.taskTitle.toLowerCase().includes(q) ||
        item.taskDescription.toLowerCase().includes(q) ||
        item.weekKey.toLowerCase().includes(q) ||
        item.user.name.toLowerCase().includes(q) ||
        (item.user.username || "").toLowerCase().includes(q) ||
        item.storyText.toLowerCase().includes(q)
      );
    });

    list = list.sort((a, b) => {
      if (sortBy === "created_asc")
        return +new Date(a.createdAt) - +new Date(b.createdAt);
      if (sortBy === "reward_desc") return b.reward - a.reward;
      if (sortBy === "story_desc")
        return b.storyText.length - a.storyText.length;
      return +new Date(b.createdAt) - +new Date(a.createdAt);
    });

    return list;
  }, [items, query, sortBy, statusFilter]);

  const visiblePendingIds = useMemo(
    () =>
      visibleItems
        .filter((item) => item.status === "PENDING")
        .map((item) => item.id),
    [visibleItems],
  );

  const selectedPendingCount = useMemo(
    () =>
      selectedIds.filter((id) =>
        items.some((item) => item.id === id && item.status === "PENDING"),
      ).length,
    [items, selectedIds],
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const clearSelection = () => setSelectedIds([]);

  const selectAllVisiblePending = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const id of visiblePendingIds) next.add(id);
      return Array.from(next);
    });
  };

  const bulkApproveSelected = async () => {
    const targetIds = selectedIds.filter((id) =>
      items.some((item) => item.id === id && item.status === "PENDING"),
    );
    if (targetIds.length === 0) {
      setNotice({ type: "error", text: "Нет выбранных заявок на проверке." });
      return;
    }
    setBulkBusy(true);
    let okCount = 0;
    let failCount = 0;
    for (const id of targetIds) {
      const res = await processStatus(id, "approve", { silent: true });
      if (res.ok) okCount += 1;
      else failCount += 1;
    }
    setBulkBusy(false);
    if (failCount === 0) {
      setNotice({
        type: "success",
        text: `Подтверждено заявок: ${okCount}.`,
      });
    } else {
      setNotice({
        type: "error",
        text: `Подтверждено: ${okCount}, с ошибкой: ${failCount}.`,
      });
    }
  };

  const applyRejectTemplate = (id: string, text: string) => {
    setRejectCommentById((prev) => ({ ...prev, [id]: text }));
  };

  return {
    items,
    loading,
    busyId,
    bulkBusy,
    notice,
    selectedIds,
    selectedPendingCount,
    rejectCommentById,
    statusFilter,
    query,
    sortBy,
    stats,
    visibleItems,
    setRejectCommentById,
    setStatusFilter,
    setQuery,
    setSortBy,
    toggleSelect,
    clearSelection,
    selectAllVisiblePending,
    load,
    updateStatus,
    bulkApproveSelected,
    deleteItem,
    copyId,
    applyRejectTemplate,
  };
}
