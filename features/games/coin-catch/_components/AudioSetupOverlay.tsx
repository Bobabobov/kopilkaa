"use client";

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
  if (!visible) return null;

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-[min(92vw,360px)] rounded-2xl border-2 border-[#f9bc60]/60 bg-[#001e1d]/95 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
        <h3 className="text-lg font-bold text-[#fffffe] text-center">
          Настройка звука
        </h3>
        <p className="mt-2 text-sm text-[#abd1c6] text-center">
          Можно отключить звук или выбрать громкость
        </p>
        <div className="mt-4">
          <label className="block text-xs uppercase tracking-wide text-[#abd1c6] mb-2">
            Громкость
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(audioVolume * 100)}
            onChange={(e) => {
              const next = Number(e.target.value) / 100;
              onVolumeChange(next);
            }}
            className="w-full accent-[#f9bc60]"
          />
          <div className="mt-1 text-xs text-[#f9bc60] text-right">
            {Math.round(audioVolume * 100)}%
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onMute}
            className="flex-1 py-2.5 rounded-xl border border-[#f9bc60]/60 text-[#f9bc60] text-sm font-bold hover:bg-[#f9bc60]/10 transition"
          >
            Без звука
          </button>
          <button
            type="button"
            onClick={onStart}
            className="flex-1 py-2.5 rounded-xl bg-[#f9bc60] text-[#001e1d] text-sm font-bold hover:bg-[#ffd700] transition"
          >
            Начать
          </button>
        </div>
      </div>
    </div>
  );
}
