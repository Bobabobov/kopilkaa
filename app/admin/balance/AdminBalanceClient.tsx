// app/admin/balance/AdminBalanceClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminPage } from '../_components/AdminPage';
import {
  AdminPanel,
  adminFieldClass,
} from '../_components/admin-ui';
import { throwIfApiFailed } from "@/lib/api/parseApiError";

type BalanceData = {
  totalSupport: number;
  totalPayout: number;
  totalAdjust: number;
  balance: number;
};

export default function AdminBalanceClient() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<BalanceData | null>(null);
  const [desired, setDesired] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);

  const formattedBalance = useMemo(() => {
    if (!data) return "—";
    return `₽ ${data.balance.toLocaleString("ru-RU")}`;
  }, [data]);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);
      const r = await fetch("/api/admin/balance", { cache: "no-store" });
      const j = await r.json().catch(() => null);
      throwIfApiFailed(r, j, "Не удалось загрузить баланс копилки");
      setData(j?.data ?? null);
      if (typeof j?.data?.balance === "number") {
        setDesired(String(Math.trunc(j.data.balance)));
      }
    } catch (e: any) {
      setError(e?.message || "Ошибка загрузки баланса");
    } finally {
      setLoading(false);
    }
  }

  async function applyDesired() {
    const desiredNum = Number(desired);
    if (!Number.isFinite(desiredNum)) {
      setError("Введите число");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setMessage(null);
      const r = await fetch("/api/admin/balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ desiredBalance: Math.trunc(desiredNum) }),
      });
      const j = await r.json().catch(() => null);
      throwIfApiFailed(r, j, "Не удалось сохранить баланс");
      if (j?.data) setData(j.data as BalanceData);
      if (j?.message) setMessage(String(j.message));
      else setMessage("Готово: баланс обновлён через корректировку (ADJUST)");
    } catch (e: any) {
      setError(e?.message || "Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminPage
      title="Баланс копилки"
      description='Значение «Всего в копилке» на главной. Меняется через Donation(type=ADJUST).'
      actions={
        <button
          onClick={load}
          disabled={loading || saving}
          className="rounded-lg border border-[#abd1c6]/20 px-3 py-1.5 text-sm text-[#abd1c6] hover:bg-[#004643]/40 disabled:opacity-60 transition-colors"
        >
          Обновить
        </button>
      }
    >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <AdminPanel title="Текущее значение" accent="gold">
              <div className="text-3xl font-black text-[#f9bc60] sm:text-4xl">
                {loading ? "…" : formattedBalance}
              </div>
              {data && (
                <div className="mt-3 space-y-1 text-xs text-[#abd1c6]/80 sm:text-sm">
                  <div>
                    SUPPORT: ₽ {data.totalSupport.toLocaleString("ru-RU")}
                  </div>
                  <div>
                    PAYOUT: ₽ {data.totalPayout.toLocaleString("ru-RU")}
                  </div>
                  <div>
                    ADJUST: ₽ {data.totalAdjust.toLocaleString("ru-RU")}
                  </div>
                </div>
              )}
            </AdminPanel>

            <AdminPanel
              title="Установить вручную"
              subtitle="Целое число ₽"
              accent="neutral"
            >
              <div className="flex gap-3">
                <input
                  type="number"
                  inputMode="numeric"
                  className={adminFieldClass}
                  value={desired}
                  onChange={(e) => setDesired(e.target.value)}
                  placeholder="Например, 125000"
                />
                <button
                  onClick={applyDesired}
                  disabled={saving || loading}
                  className="shrink-0 rounded-xl bg-[#f9bc60] px-5 py-3 font-black text-[#001e1d] transition-all hover:bg-[#e8a545] disabled:opacity-60"
                >
                  {saving ? "…" : "Применить"}
                </button>
              </div>

              {message && (
                <div className="mt-3 text-sm text-[#abd1c6]">{message}</div>
              )}
              {error && (
                <div className="mt-3 text-sm text-red-300">{error}</div>
              )}

              <div className="mt-4 text-xs leading-relaxed text-[#abd1c6]/70">
                Под капотом мы считаем текущий баланс по формуле{" "}
                <span className="font-mono">SUPPORT - PAYOUT + ADJUST</span> и
                создаём новую корректировку на разницу.
              </div>
            </AdminPanel>
          </div>
    </AdminPage>
  );
}
