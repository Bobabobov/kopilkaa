// app/admin/balance/AdminBalanceClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminHeader } from "../_components/AdminHeader";

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
      if (!r.ok) throw new Error(j?.error || "Ошибка загрузки баланса");
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
      if (!r.ok) throw new Error(j?.error || "Ошибка сохранения");
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
    <div className="min-h-screen relative">
      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12">
          <AdminHeader />

          <div className="relative overflow-hidden bg-gradient-to-br from-[#001e1d] via-[#004643]/90 to-[#001e1d] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-[#abd1c6]/20">
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#fffffe]">
                    💰 Баланс на главной (“Всего в копилке”)
                  </h2>
                  <p className="text-sm sm:text-base text-[#abd1c6] mt-1">
                    Меняется через запись корректировки{" "}
                    <span className="font-bold">Donation(type=ADJUST)</span>.
                  </p>
                </div>

                <button
                  onClick={load}
                  disabled={loading || saving}
                  className="px-4 sm:px-5 py-2.5 bg-[#001e1d]/60 hover:bg-[#001e1d]/80 text-[#abd1c6] hover:text-[#fffffe] font-bold rounded-xl transition-all duration-300 border border-[#abd1c6]/20 disabled:opacity-60"
                >
                  Обновить
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-[#abd1c6]/20 bg-[#001e1d]/40 p-5">
                  <div className="text-sm font-bold text-[#abd1c6]">
                    Текущее значение
                  </div>
                  <div className="mt-2 text-3xl sm:text-4xl font-black text-[#f9bc60]">
                    {loading ? "…" : formattedBalance}
                  </div>
                  {data && (
                    <div className="mt-3 text-xs sm:text-sm text-[#abd1c6]/80 space-y-1">
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
                </div>

                <div className="rounded-2xl border border-[#abd1c6]/20 bg-[#001e1d]/40 p-5">
                  <div className="text-sm font-bold text-[#abd1c6]">
                    Установить вручную (целое число ₽)
                  </div>
                  <div className="mt-3 flex gap-3">
                    <input
                      type="number"
                      inputMode="numeric"
                      className="flex-1 px-4 py-3 bg-[#001e1d]/60 border border-[#abd1c6]/30 rounded-xl focus:ring-2 focus:ring-[#f9bc60] focus:border-[#f9bc60] transition-all duration-300 text-[#fffffe] placeholder:text-[#abd1c6]/60"
                      value={desired}
                      onChange={(e) => setDesired(e.target.value)}
                      placeholder="Например, 125000"
                    />
                    <button
                      onClick={applyDesired}
                      disabled={saving || loading}
                      className="px-5 py-3 bg-[#f9bc60] hover:bg-[#e8a545] text-[#001e1d] font-black rounded-xl transition-all duration-300 disabled:opacity-60"
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

                  <div className="mt-4 text-xs text-[#abd1c6]/70 leading-relaxed">
                    Под капотом мы считаем текущий баланс по формуле{" "}
                    <span className="font-mono">SUPPORT - PAYOUT + ADJUST</span>{" "}
                    и создаём новую корректировку на разницу.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
