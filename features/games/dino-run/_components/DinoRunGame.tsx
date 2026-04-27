"use client";

import { Button } from "@/components/ui/button";
import { CANVAS_HEIGHT } from "../_constants/config";
import { DINO_BIOMES, type DinoBiome } from "../_core/biomes";
import { useDinoRunGame } from "./useDinoRunGame";

export function DinoRunGame() {
  const {
    canvasRef,
    isRunning,
    isPaused,
    isGameOver,
    score,
    biomeId,
    setBiomeId,
    canChangeBiome,
    multiplier,
    streak,
    leaderboard,
    submitStatus,
    queueJump,
    togglePause,
    resetGame,
  } = useDinoRunGame();

  const selectedBiomeName = DINO_BIOMES.find((b) => b.id === biomeId)?.name ?? "День";

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-black/30 p-3 sm:p-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full rounded-xl border border-white/10 bg-[#0f1727] touch-none"
          style={{ height: CANVAS_HEIGHT }}
          onPointerDown={queueJump}
          aria-label="Мини-игра Dino Run"
        />
        {canChangeBiome && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-black/55 p-3 sm:p-4">
            <div className="w-full max-w-2xl rounded-xl border border-white/15 bg-black/60 p-4 backdrop-blur-sm">
              <p className="text-center text-sm font-semibold text-white mb-1">Выбери биом</p>
              <p className="text-center text-xs text-white/65 mb-3">
                Биом зафиксируется на весь забег
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {DINO_BIOMES.map((biome) => (
                  <button
                    key={biome.id}
                    type="button"
                    onClick={() => setBiomeId(biome.id)}
                    className={`rounded-lg ${
                      biomeId === biome.id
                        ? "ring-2 ring-[#f9bc60]/70 border-[#f9bc60]/60"
                        : "border-white/15 hover:border-white/30"
                    }`}
                  >
                    <BiomePreviewCard biome={biome} selected={biomeId === biome.id} />
                  </button>
                ))}
              </div>
              <Button
                type="button"
                onClick={queueJump}
                className="mt-3 w-full rounded-xl bg-[#f9bc60] text-[#001e1d] hover:bg-[#efae54] text-base"
              >
                Начать забег
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          onClick={queueJump}
          className="rounded-xl bg-[#f9bc60] text-[#001e1d] hover:bg-[#efae54]"
        >
          Прыжок
        </Button>
        <Button type="button" variant="outline" onClick={togglePause} className="rounded-xl">
          {isPaused ? "Продолжить" : "Пауза"}
        </Button>
        <Button type="button" variant="outline" onClick={resetGame} className="rounded-xl">
          Рестарт
        </Button>
        <span className="ml-auto text-sm text-white/75">
          {isGameOver
            ? "Финал"
            : isPaused
              ? "Пауза"
              : isRunning
                ? "В процессе"
                : "Готов к старту"}{" "}
          • {selectedBiomeName}
        </span>
      </div>
      <div className="mt-2 text-xs text-white/60">Серия: {streak} • x{multiplier} • Очки: {score}</div>
      {submitStatus && <p className="mt-3 text-sm text-[#abd1c6]">{submitStatus}</p>}
      <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3 sm:p-4">
        <p className="text-sm font-semibold text-white">Топ Dino Run (неделя)</p>
        <div className="mt-2 space-y-1.5">
          {leaderboard.length === 0 ? (
            <p className="text-sm text-white/60">Пока нет результатов. Будь первым!</p>
          ) : (
            leaderboard.map((entry) => (
              <div
                key={`${entry.rank}-${entry.displayName}-${entry.score}`}
                className="flex items-center justify-between rounded-lg bg-white/5 px-2.5 py-2 text-sm"
              >
                <span className="text-white/75">
                  #{entry.rank} {entry.displayName}
                </span>
                <span className="font-semibold text-[#f9bc60]">{entry.score}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function BiomePreviewCard({
  biome,
  selected,
}: {
  biome: DinoBiome;
  selected: boolean;
}) {
  const skyTop = `rgb(${biome.skyTop[0]}, ${biome.skyTop[1]}, ${biome.skyTop[2]})`;
  const skyBottom = `rgb(${biome.skyBottom[0]}, ${biome.skyBottom[1]}, ${biome.skyBottom[2]})`;
  const description =
    biome.id === "day"
      ? "Светло и контрастно"
      : biome.id === "sunset"
        ? "Теплая атмосфера"
        : "Спокойная ночь";

  return (
    <div className="rounded-lg border p-2 text-left transition-colors border-inherit">
      <div
        className="relative h-16 rounded-md overflow-hidden"
        style={{ background: `linear-gradient(to bottom, ${skyTop}, ${skyBottom})` }}
      >
        <div className="absolute top-2 right-2 w-3 h-3 rounded-full" style={{ background: biome.celestial }} />
        <div className="absolute left-0 right-0 bottom-0 h-4" style={{ background: biome.mountain }} />
      </div>
      <p className={`mt-2 text-sm font-semibold ${selected ? "text-[#f9bc60]" : "text-white"}`}>{biome.name}</p>
      <p className="text-[11px] text-white/65">{description}</p>
    </div>
  );
}
