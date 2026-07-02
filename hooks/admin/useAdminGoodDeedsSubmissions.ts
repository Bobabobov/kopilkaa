'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GOOD_DEED_FIRST_IN_FEED_BONUS_BONUSES } from '@/lib/goodDeedsFirstFeedBonus';
import { throwIfApiFailed } from '@/lib/api/parseApiError';
import type { GoodDeedSubmissionListItemDto } from '@/lib/admin/goodDeedSubmissions';
import type { Notice, SortBy, StatusFilter } from '@/app/admin/good-deeds/_lib/types';

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 300;

type Stats = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
};

export function useAdminGoodDeedsSubmissions(initialStatus: StatusFilter = 'PENDING') {
  const [items, setItems] = useState<GoodDeedSubmissionListItemDto[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPageState] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(initialStatus);
  const [sortBy, setSortBy] = useState<SortBy>('created_desc');

  const [busyId, setBusyId] = useState<string | null>(null);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const pageRef = useRef(page);
  const isSearchPending = q.trim() !== debouncedQ.trim();

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedQ(q.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [q]);

  const fetchStats = useCallback(async () => {
    const res = await fetch('/api/admin/good-deeds/submissions/stats', {
      cache: 'no-store',
    });
    const json = await res.json();
    throwIfApiFailed(res, json, 'Не удалось загрузить статистику');
    setStats(json?.data ?? null);
  }, []);

  const fetchList = useCallback(async (targetPage: number) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(targetPage),
        limit: String(PAGE_SIZE),
        sortBy,
        ...(debouncedQ ? { q: debouncedQ } : {}),
        ...(statusFilter !== 'ALL' ? { status: statusFilter } : {}),
      });
      const res = await fetch(`/api/admin/good-deeds/submissions?${params}`, {
        cache: 'no-store',
      });
      const json = await res.json();
      throwIfApiFailed(res, json, 'Ошибка загрузки модерации');
      const data = json?.data;
      setItems(Array.isArray(data?.items) ? data.items : []);
      setTotal(Number(data?.total) || 0);
      setTotalPages(Math.max(1, Number(data?.totalPages) || 1));
      setPageState(Number(data?.page) || targetPage);
    } catch (err) {
      console.error(err);
      setItems([]);
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }, [debouncedQ, sortBy, statusFilter]);

  const reload = useCallback(async () => {
    await Promise.all([fetchList(pageRef.current), fetchStats()]);
  }, [fetchList, fetchStats]);

  useEffect(() => {
    fetchList(1).catch(console.error);
    fetchStats().catch(console.error);
  }, [debouncedQ, sortBy, statusFilter, fetchList, fetchStats]);

  const setPage = (next: number) => {
    const safe = Math.max(1, Math.min(next, totalPages));
    fetchList(safe).catch(console.error);
  };

  const copyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setNotice({ type: 'success', text: `ID скопирован: ${id}` });
    } catch {
      setNotice({ type: 'error', text: 'Не удалось скопировать ID' });
    }
  };

  const processStatus = async (
    id: string,
    action: 'approve' | 'reject',
    adminComment: string,
    options?: { silent?: boolean },
  ) => {
    try {
      const res = await fetch(`/api/admin/good-deeds/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, adminComment }),
      });
      const json = await res.json();
      throwIfApiFailed(res, json, 'Не удалось обновить статус');
      const bonusGranted =
        action === 'approve' && Boolean(json?.firstFeedBonusGranted);
      const categoryCompletionBonus =
        action === 'approve' ? Number(json?.categoryCompletionBonus || 0) : 0;

      setSelectedIds((prev) => prev.filter((x) => x !== id));

      if (!options?.silent) {
        setNotice({
          type: 'success',
          text:
            action === 'approve'
              ? bonusGranted || categoryCompletionBonus > 0
                ? `Задание подтверждено. Доп. бонус: +${
                    (bonusGranted ? GOOD_DEED_FIRST_IN_FEED_BONUS_BONUSES : 0) +
                    categoryCompletionBonus
                  }.`
                : 'Задание подтверждено.'
              : 'Задание отклонено.',
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
    } catch (err) {
      console.error(err);
      if (!options?.silent) {
        setNotice({
          type: 'error',
          text: err instanceof Error ? err.message : 'Ошибка',
        });
      }
      return { ok: false as const, error: err };
    }
  };

  const deleteItem = async (id: string) => {
    if (!window.confirm('Удалить это задание безвозвратно?')) return false;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/good-deeds/submissions/${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      throwIfApiFailed(res, json, 'Не удалось удалить');
      setNotice({ type: 'success', text: 'Заявка удалена.' });
      await reload();
      return true;
    } catch (err) {
      console.error(err);
      setNotice({
        type: 'error',
        text: err instanceof Error ? err.message : 'Ошибка',
      });
      return false;
    } finally {
      setBusyId(null);
    }
  };

  const selectedPendingCount = useMemo(
    () =>
      selectedIds.filter((id) =>
        items.some((item) => item.id === id && item.status === 'PENDING'),
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
    const pendingIds = items
      .filter((item) => item.status === 'PENDING')
      .map((item) => item.id);
    setSelectedIds((prev) => Array.from(new Set([...prev, ...pendingIds])));
  };

  const bulkApproveSelected = async () => {
    const targetIds = selectedIds.filter((id) =>
      items.some((item) => item.id === id && item.status === 'PENDING'),
    );
    if (targetIds.length === 0) {
      setNotice({ type: 'error', text: 'Нет выбранных заявок на проверке.' });
      return;
    }
    setBulkBusy(true);
    let okCount = 0;
    let failCount = 0;
    for (const id of targetIds) {
      const res = await processStatus(id, 'approve', '', { silent: true });
      if (res.ok) okCount += 1;
      else failCount += 1;
    }
    setBulkBusy(false);
    await reload();
    if (failCount === 0) {
      setNotice({ type: 'success', text: `Подтверждено заявок: ${okCount}.` });
    } else {
      setNotice({
        type: 'error',
        text: `Подтверждено: ${okCount}, с ошибкой: ${failCount}.`,
      });
    }
  };

  const resetFilters = () => {
    setQ('');
    setStatusFilter('PENDING');
    setSortBy('created_desc');
  };

  return {
    items,
    stats,
    loading,
    error,
    isSearchPending,
    page,
    total,
    totalPages,
    q,
    setQ,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    busyId,
    bulkBusy,
    notice,
    setNotice,
    selectedIds,
    selectedPendingCount,
    toggleSelect,
    clearSelection,
    selectAllVisiblePending,
    bulkApproveSelected,
    setPage,
    reload,
    copyId,
    processStatus,
    deleteItem,
    resetFilters,
  };
}
