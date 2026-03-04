"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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

  useEffect(() => {
    if (!visible) return;
    const scrollY = window.scrollY;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyPosition = document.body.style.position;
    const prevBodyTop = document.body.style.top;
    const prevBodyWidth = document.body.style.width;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.position = prevBodyPosition;
      document.body.style.top = prevBodyTop;
      document.body.style.width = prevBodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, [visible]);

  if (!visible) return null;

  const valuePercent = Math.round(audioVolume * 100);

  const overlay = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      role="presentation"
      style={{ touchAction: "none" }}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
      onTouchCancel={(e) => e.stopPropagation()}
    >
      <div
        className="rounded-2xl border-2 border-[#1e4a47] overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.3),0_20px_40px_rgba(0,0,0,0.5)] shrink-0"
        style={{
          backgroundColor: "#0e2422",
          width: "min(360px, 90vw)",
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="audio-setup-title"
        aria-describedby="audio-setup-desc"
      >
        <div className="p-5 sm:p-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#f9bc60]/15 border border-[#f9bc60]/30 flex items-center justify-center text-2xl" aria-hidden>
            🔊
          </div>
          <h3 id="audio-setup-title" className={cn("text-lg sm:text-xl font-bold text-center", GAME_THEME.text.primary)}>
            Настройка звука
          </h3>
          <p id="audio-setup-desc" className={cn("mt-1.5 text-sm text-center text-white/70")}>
            Можно отключить звук или выбрать громкость
          </p>

          <div className="mt-5">
            <div className="flex items-center justify-between gap-3 mb-2">
              <label htmlFor="coin-catch-volume" className={cn("text-xs font-medium uppercase tracking-wider", "text-white/60")}>
                Громкость
              </label>
              <span className="min-w-[3rem] text-right text-sm font-bold text-[#f9bc60] tabular-nums">
                {valuePercent}%
              </span>
            </div>
            <input
              id="coin-catch-volume"
              type="range"
              min={0}
              max={100}
              value={valuePercent}
              onChange={(e) => onVolumeChange(Number(e.target.value) / 100)}
              className="w-full h-2 rounded-full appearance-none bg-white/15 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#f9bc60] [&::-webkit-slider-thumb]:shadow-[0_0_0_2px_rgba(0,0,0,0.3)] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#f9bc60] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
              style={{
                touchAction: "pan-x",
                background: `linear-gradient(to right, #f9bc60 0%, #f9bc60 ${valuePercent}%, rgba(255,255,255,0.15) ${valuePercent}%, rgba(255,255,255,0.15) 100%)`,
              }}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={valuePercent}
              aria-valuetext={`${valuePercent} процентов`}
            />
          </div>

          <div className="mt-5 flex gap-3">
            <Button
              type="button"
              variant="outline"
              className={cn(
                "flex-1 py-3 rounded-xl font-bold border-2 border-[#f9bc60]/50 text-[#f9bc60]",
                "bg-transparent hover:bg-[#f9bc60]/10 active:scale-[0.98]"
              )}
              onClick={onMute}
            >
              Без звука
            </Button>
            <Button
              ref={startRef}
              type="button"
              className={cn("flex-1 py-3 rounded-xl font-bold", GAME_THEME.button.primary)}
              onClick={onStart}
            >
              Начать
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}
