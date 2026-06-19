"use client";

import { SettingsSection } from "./SettingsFields";
import { useBrowserNotificationsPreference } from "@/hooks/notifications/useBrowserNotificationsPreference";

export function SettingsNotificationsSection() {
  const { supported, permission, enabled, loading, error, toggle } =
    useBrowserNotificationsPreference();

  const handleToggle = () => {
    void toggle();
  };

  let description = "При включении браузер запросит разрешение на уведомления от «Копилки».";

  if (!supported) {
    description = "Ваш браузер не поддерживает уведомления.";
  } else if (permission === "denied") {
    description =
      "Браузер заблокировал уведомления. Разрешите их в настройках сайта в адресной строке браузера, затем включите здесь снова.";
  } else if (enabled) {
    description =
      "Вы будете получать уведомления о новых событиях, когда вкладка не активна.";
  }

  return (
    <SettingsSection title="Уведомления">
      <div className="space-y-3 rounded-xl border border-[#abd1c6]/25 bg-[#001e1d]/40 p-4 sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#fffffe]">
              Браузерные уведомления
            </p>
            <p className="text-xs text-[#abd1c6]">{description}</p>
            {error ? (
              <p className="mt-2 text-xs text-[#fca5a5]">{error}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={handleToggle}
            disabled={!supported || loading || permission === "denied"}
            aria-pressed={enabled}
            className={`mt-2 inline-flex h-9 w-full items-center justify-between rounded-full border px-3 text-xs font-semibold transition-colors sm:mt-0 sm:w-auto ${
              enabled
                ? "border-[#f9bc60]/60 bg-[#f9bc60]/15 text-[#f9bc60]"
                : "border-white/15 bg-white/5 text-[#abd1c6]"
            } ${loading ? "opacity-70" : ""}`}
          >
            <span>
              {loading
                ? "Сохранение..."
                : enabled
                  ? "Уведомления включены"
                  : "Уведомления выключены"}
            </span>
            <span
              className={`flex h-5 w-9 items-center rounded-full p-0.5 transition-colors ${
                enabled ? "bg-[#f9bc60]/80" : "bg-white/10"
              }`}
            >
              <span
                className={`h-4 w-4 rounded-full bg-white transition-transform ${
                  enabled ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </span>
          </button>
        </div>
      </div>
    </SettingsSection>
  );
}
