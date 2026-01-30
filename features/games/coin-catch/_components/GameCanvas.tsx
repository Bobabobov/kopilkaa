"use client";

import { useCoinCatchGame } from "./useCoinCatchGame";
import { LeaderboardPanel } from "./LeaderboardPanel";
import { AudioSetupOverlay } from "./AudioSetupOverlay";
import { playButtonSound } from "../_services/sfx";

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
      {showLeaderboard && (
        <LeaderboardPanel
          entries={leaderboard}
          onClose={() => setShowLeaderboard(false)}
        />
      )}
      {!showLeaderboard && (
        <button
          type="button"
          onClick={handleShowLeaderboard}
          onPointerDown={() => playButtonSound()}
          onPointerEnter={() => playButtonSound()}
          onTouchStart={() => playButtonSound()}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-[#001e1d]/95 border-2 border-[#f9bc60]/40 rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-bold text-[#f9bc60] hover:bg-[#001e1d] hover:border-[#f9bc60]/60 transition-colors backdrop-blur-sm z-10 shadow-md"
        >
          <span className="hidden sm:inline">Топ недели</span>
          <span className="sm:hidden">Топ</span>
        </button>
      )}
    </div>
  );
}
