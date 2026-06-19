'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useBeautifulToast } from '@/components/ui/BeautifulToast';
import { Button } from '@/components/ui/button';
import { throwIfApiFailed, logRouteCatchError } from '@/lib/api/parseApiError';
import type { TontineStatusResponse } from '../types';
import { VyzhivanieStartOverlay } from './VyzhivanieStartOverlay';
import { VyzhivanieWorld } from './VyzhivanieWorld';
import { VyzhivanieTopBar } from './VyzhivanieTopBar';

export function VyzhivaniePageClient() {
  const [data, setData] = useState<TontineStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [startOpen, setStartOpen] = useState(true);
  const [rulesOpenOnStart, setRulesOpenOnStart] = useState(false);
  const [focusMyGraveToken, setFocusMyGraveToken] = useState(0);
  const { showToast, ToastComponent } = useBeautifulToast();
  const showToastRef = useRef(showToast);

  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, []);

  const loadSilent = useCallback(async () => {
    try {
      const res = await fetch('/api/tontine', { cache: 'no-store' });
      const json = await res.json();
      throwIfApiFailed(res, json, 'Не удалось загрузить игру');
      setData(json.data as TontineStatusResponse);
    } catch (error) {
      logRouteCatchError('[VyzhivaniePage] loadSilent', error);
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tontine', { cache: 'no-store' });
      const json = await res.json();
      throwIfApiFailed(res, json, 'Не удалось загрузить игру');
      setData(json.data as TontineStatusResponse);
    } catch (error) {
      logRouteCatchError('[VyzhivaniePage] load', error);
      showToastRef.current('error', 'Ошибка', 'Не удалось загрузить игру');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load().catch((error) =>
      logRouteCatchError('[VyzhivaniePage] load (effect)', error),
    );
  }, [load]);

  const handleJoin = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/tontine/join', { method: 'POST' });
      const json = await res.json();
      throwIfApiFailed(res, json, 'Не удалось вступить в раунд');
      setData(json.data as TontineStatusResponse);
      showToast('success', 'Вы в игре', 'Сегодня зачтено. Завтра не забудьте.');
    } catch (error) {
      logRouteCatchError('[VyzhivaniePage] join', error);
      showToast(
        'error',
        'Не вышло',
        error instanceof Error ? error.message : 'Не удалось вступить в раунд',
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/tontine/check-in', { method: 'POST' });
      const json = await res.json();
      throwIfApiFailed(res, json, 'Не удалось подтвердить жизнь');
      setData(json.data as TontineStatusResponse);
      showToast('success', 'Вы живы', 'На сегодня всё. Приходите завтра.');
    } catch (error) {
      logRouteCatchError('[VyzhivaniePage] check-in', error);
      showToast(
        'error',
        'Не вышло',
        error instanceof Error ? error.message : 'Не удалось подтвердить жизнь',
      );
      await loadSilent();
    } finally {
      setActionLoading(false);
    }
  };

  const handleCloseStart = () => {
    setStartOpen(false);
    setRulesOpenOnStart(false);
  };

  const handleFocusMyGrave = () => {
    handleCloseStart();
    setFocusMyGraveToken((token) => token + 1);
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-[#0a0f0d] text-[#e8fff4]">
      <VyzhivanieTopBar data={data} />

      <div className="relative min-h-0 flex-1">
        {loading ? (
          <div className="absolute inset-0 animate-pulse bg-white/5" aria-busy="true" />
        ) : data ? (
          <>
            <VyzhivanieWorld
              data={data}
              loading={actionLoading}
              onJoin={handleJoin}
              onCheckIn={handleCheckIn}
              onOpenStart={() => {
                setRulesOpenOnStart(true);
                setStartOpen(true);
              }}
              onRefreshGraves={loadSilent}
              hideHud={startOpen}
              focusMyGraveToken={focusMyGraveToken}
              onFocusMyGrave={handleFocusMyGrave}
            />
            {startOpen ? (
              <VyzhivanieStartOverlay
                data={data}
                loading={actionLoading}
                onJoin={handleJoin}
                onCheckIn={handleCheckIn}
                initialRulesOpen={rulesOpenOnStart}
                onClose={handleCloseStart}
                onFocusMyGrave={handleFocusMyGrave}
              />
            ) : null}
          </>
        ) : (
          <div className="flex h-full items-center justify-center p-6">
            <div className="max-w-sm rounded-2xl border border-red-400/30 bg-red-500/10 p-6 text-center">
              <p className="text-sm text-red-100">Не удалось загрузить игру.</p>
              <Button
                type="button"
                variant="outline"
                className="mt-4 border-white/20"
                onClick={() => load()}
              >
                Повторить
              </Button>
            </div>
          </div>
        )}
      </div>

      <ToastComponent />
    </div>
  );
}
