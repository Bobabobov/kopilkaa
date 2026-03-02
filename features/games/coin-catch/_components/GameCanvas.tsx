"use client";

import { useCoinCatchGame } from "./useCoinCatchGame";
import { LeaderboardPanel } from "./LeaderboardPanel";
import { AudioSetupOverlay } from "./AudioSetupOverlay";
import { playButtonSound } from "../_services/sfx";
import { Button } from "@/components/ui/button";
import { GAME_THEME } from "../_constants/theme";
import { cn } from "@/lib/utils";

interface GameCanvasProps {
  onLeaderboardClick?: () => void;
}

export function GameCanvas({ onLeaderboardClick }: GameCanvasProps) {
  const {
    containerRef,
    leaderboard,
    showLeaderboard,
    setShowLeaderboard,
    showAudioSetup,
    audioVolume,
    initError,
    retryInit,
    handleVolumeChange,
    applyAudioSettings,
    handleShowLeaderboard,
  } = useCoinCatchGame(onLeaderboardClick);

  return (
    <div
      className="relative w-full h-full min-h-0 overflow-hidden"
      style={{ maxWidth: "100vw", maxHeight: "100%", boxSizing: "border-box" }}
    >
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{
          minHeight: 0,
          position: "relative",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      />
      <AudioSetupOverlay
        visible={showAudioSetup}
        audioVolume={audioVolume}
        onVolumeChange={handleVolumeChange}
        onMute={() => applyAudioSettings(true)}
        onStart={() => applyAudioSettings(false)}
      />
      {initError && (
        <div
          className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 p-4 bg-black/60 backdrop-blur-sm"
          role="alert"
        >
          <p className={cn("text-sm sm:text-base text-center max-w-sm", GAME_THEME.text.primary)}>
            {initError}
          </p>
          <Button
            className={cn("rounded-xl", GAME_THEME.button.primary)}
            onClick={retryInit}
          >
            Повторить
          </Button>
        </div>
      )}
      {showLeaderboard && (
        <LeaderboardPanel entries={leaderboard} onClose={() => setShowLeaderboard(false)} />
      )}
      {!showLeaderboard && !initError && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            "absolute top-2 right-2 sm:top-4 sm:right-4 rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-bold z-10 shadow-md backdrop-blur-sm",
            GAME_THEME.button.outline
          )}
          onClick={handleShowLeaderboard}
          onPointerDown={() => playButtonSound()}
          onPointerEnter={() => playButtonSound()}
          onTouchStart={() => playButtonSound()}
          aria-label="Открыть топ недели"
        >
          <span className="hidden sm:inline">Топ недели</span>
          <span className="sm:hidden">Топ</span>
        </Button>
      )}
    </div>
  );
}
