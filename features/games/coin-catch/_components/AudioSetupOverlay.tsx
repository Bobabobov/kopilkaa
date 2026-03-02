"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { GAME_THEME } from "../_constants/theme";
import { cn } from "@/lib/utils";

interface AudioSetupOverlayProps {
  visible: boolean;
  audioVolume: number;
  onVolumeChange: (volume: number) => void;
  onMute: () => void;
  onStart: () => void;
}

export function AudioSetupOverlay({
  visible,
  audioVolume,
  onVolumeChange,
  onMute,
  onStart,
}: AudioSetupOverlayProps) {
  const startRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (visible && startRef.current) {
      startRef.current.focus({ preventScroll: true });
    }
  }, [visible]);

  if (!visible) return null;

  const valuePercent = Math.round(audioVolume * 100);

  return (
    <div
      className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="presentation"
    >
      <Card
        className={cn(
          "w-[min(92vw,360px)] rounded-2xl border-2 overflow-hidden",
          GAME_THEME.border.strong,
          GAME_THEME.bg.card,
          GAME_THEME.shadow.overlay
        )}
        padding="none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="audio-setup-title"
        aria-describedby="audio-setup-desc"
      >
        <CardContent className="p-5">
          <h3 id="audio-setup-title" className={cn("text-lg font-bold text-center", GAME_THEME.text.primary)}>
            Настройка звука
          </h3>
          <p id="audio-setup-desc" className={cn("mt-2 text-sm text-center", GAME_THEME.text.secondary)}>
            Можно отключить звук или выбрать громкость
          </p>
          <div className="mt-4">
            <label htmlFor="coin-catch-volume" className={cn("block text-xs uppercase tracking-wide mb-2", GAME_THEME.text.secondary)}>
              Громкость
            </label>
            <input
              id="coin-catch-volume"
              type="range"
              min={0}
              max={100}
              value={valuePercent}
              onChange={(e) => onVolumeChange(Number(e.target.value) / 100)}
              className="w-full accent-[#f9bc60]"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={valuePercent}
              aria-valuetext={`${valuePercent} процентов`}
            />
            <div className={cn("mt-1 text-xs text-right", GAME_THEME.text.accent)}>
              {valuePercent}%
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              type="button"
              variant="outline"
              className={cn("flex-1 py-2.5 rounded-xl border font-bold", GAME_THEME.border.strong, GAME_THEME.text.accent, "hover:bg-[#f9bc60]/10")}
              onClick={onMute}
            >
              Без звука
            </Button>
            <Button
              ref={startRef}
              type="button"
              className={cn("flex-1 py-2.5 rounded-xl font-bold", GAME_THEME.button.primary)}
              onClick={onStart}
            >
              Начать
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
