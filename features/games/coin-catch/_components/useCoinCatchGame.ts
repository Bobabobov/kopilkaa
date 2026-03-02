"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { GameEngine } from "../_core/engine";
import type { LeaderboardEntry } from "../_types";
import { submitScore, getLeaderboard } from "../_services/api";
import { playButtonSound, setAudioSettings } from "../_services/sfx";

export function useCoinCatchGame(onLeaderboardClick?: () => void) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAudioSetup, setShowAudioSetup] = useState(true);
  const [audioMuted, setAudioMuted] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.6);
  const [initError, setInitError] = useState<string | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0);
  const scoreSubmittedRef = useRef(false);
  const onLeaderboardClickRef = useRef(onLeaderboardClick);

  useEffect(() => {
    onLeaderboardClickRef.current = onLeaderboardClick;
  }, [onLeaderboardClick]);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const container = containerRef.current;

    const initGame = () => {
      if (!container || container.clientWidth === 0 || container.clientHeight === 0) {
        setTimeout(initGame, 100);
        return;
      }

      const handleGameOver = async (score: number) => {
        if (!scoreSubmittedRef.current) {
          scoreSubmittedRef.current = true;
          await submitScore(score);
          const updated = await getLeaderboard();
          setLeaderboard(updated);
        }
      };

      const handleLeaderboardClick = () => {
        onLeaderboardClickRef.current?.();
        setShowLeaderboard(true);
      };

      const engine = new GameEngine(container, handleGameOver, handleLeaderboardClick);
      engineRef.current = engine;

      engine
        .init()
        .then(() => setInitError(null))
        .catch((err) => {
          console.error("Error initializing game:", err);
          setInitError("Игру не удалось загрузить. Проверьте соединение и попробуйте ещё раз.");
        });
    };

    const timeoutId = setTimeout(initGame, 50);

    getLeaderboard().then(setLeaderboard).catch(() => {});

    return () => {
      clearTimeout(timeoutId);
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
      scoreSubmittedRef.current = false;
    };
  }, [retryTrigger]);

  const retryInit = useCallback(() => {
    setInitError(null);
    setRetryTrigger((n) => n + 1);
  }, []);

  const handleVolumeChange = useCallback((next: number) => {
    setAudioVolume(next);
    setAudioSettings({ muted: false, volume: next });
    engineRef.current?.applyMusicVolume();
    engineRef.current?.previewMusic();
  }, []);

  const applyAudioSettings = useCallback(
    (nextMuted: boolean) => {
      setAudioMuted(nextMuted);
      setAudioSettings({ muted: nextMuted, volume: audioVolume });
      engineRef.current?.applyMusicVolume();
      playButtonSound();
      setShowAudioSetup(false);
    },
    [audioVolume]
  );

  const handleShowLeaderboard = useCallback(() => {
    playButtonSound();
    setShowLeaderboard(true);
    onLeaderboardClickRef.current?.();
  }, []);

  return {
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
  };
}
