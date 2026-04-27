"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BEST_SCORE_STORAGE_KEY,
  CANVAS_HEIGHT,
  createInitialGameState,
  DINO_X,
  GROUND_OFFSET,
  JUMP_VELOCITY,
} from "../_constants/config";
import { getBiomeById, type DinoBiomeId } from "../_core/biomes";
import { renderDinoRunFrame, setCanvasSize } from "../_core/render";
import { stepSimulation } from "../_core/simulation";
import { getDinoRunLeaderboard, submitDinoRunScore } from "../_services/api";
import {
  playDinoCrashSfx,
  playDinoJumpSfx,
  playDinoReviveSfx,
  playDinoSubmitSfx,
} from "../_services/sfx";
import type { LeaderboardEntry } from "../_types";

export function useDinoRunGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);
  const gameStartTimeRef = useRef<number | null>(null);
  const submittedGameOverRef = useRef(false);
  const flashAlphaRef = useRef(0);
  const bonusLabelExpiresAtRef = useRef<number | null>(null);
  const stateRef = useRef(createInitialGameState());

  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [reviveAvailable, setReviveAvailable] = useState(true);
  const [bonusLabel, setBonusLabel] = useState<string | null>(null);
  const [biomeId, setBiomeId] = useState<DinoBiomeId>("day");
  const [canvasWidth, setCanvasWidth] = useState(880);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

  const groundY = useMemo(() => CANVAS_HEIGHT - GROUND_OFFSET, []);

  const queueJump = useCallback(() => {
    if (isPaused) {
      return;
    }
    stateRef.current.jumpQueued = true;
    playDinoJumpSfx();
    if (!isRunning && !isGameOver) {
      gameStartTimeRef.current = Date.now();
      setIsRunning(true);
    }
  }, [isGameOver, isPaused, isRunning]);

  const togglePause = useCallback(() => {
    if (isGameOver) {
      return;
    }
    setIsPaused((prev) => !prev);
  }, [isGameOver]);

  const resetGame = useCallback(() => {
    stateRef.current = createInitialGameState();
    lastFrameTimeRef.current = null;
    gameStartTimeRef.current = null;
    submittedGameOverRef.current = false;
    flashAlphaRef.current = 0;
    bonusLabelExpiresAtRef.current = null;
    setScore(0);
    setReviveAvailable(true);
    setBonusLabel(null);
    setSubmitStatus(null);
    setIsPaused(false);
    setIsGameOver(false);
    setIsRunning(false);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const raw = window.localStorage.getItem(BEST_SCORE_STORAGE_KEY);
    const parsed = raw ? Number(raw) : 0;
    setBestScore(Number.isFinite(parsed) ? parsed : 0);
  }, []);

  const loadLeaderboard = useCallback(async () => {
    const entries = await getDinoRunLeaderboard();
    setLeaderboard(entries.slice(0, 5));
  }, []);

  useEffect(() => {
    void loadLeaderboard();
  }, [loadLeaderboard]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "KeyP") {
        event.preventDefault();
        togglePause();
        return;
      }
      if (event.code !== "Space" && event.code !== "ArrowUp") {
        return;
      }
      event.preventDefault();

      if (isGameOver) {
        resetGame();
        return;
      }
      queueJump();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isGameOver, queueJump, resetGame, togglePause]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const parent = canvas.parentElement;
    if (!parent) {
      return;
    }

    const observer = new ResizeObserver(() => {
      setCanvasWidth(Math.max(320, Math.floor(parent.clientWidth)));
    });
    observer.observe(parent);
    setCanvasWidth(Math.max(320, Math.floor(parent.clientWidth)));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    setCanvasSize(canvas, canvasWidth, CANVAS_HEIGHT);
  }, [canvasWidth]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const tick = (time: number) => {
      if (lastFrameTimeRef.current == null) {
        lastFrameTimeRef.current = time;
      }

      const dt = Math.min((time - (lastFrameTimeRef.current ?? time)) / 1000, 0.033);
      lastFrameTimeRef.current = time;
      flashAlphaRef.current = Math.max(0, flashAlphaRef.current - dt * 1.6);

      if (isRunning && !isGameOver && !isPaused) {
        const state = stateRef.current;
        const { hit, nearMissCount } = stepSimulation(state, dt, canvasWidth, groundY);

        if (nearMissCount > 0) {
          const bonus = nearMissCount * 15 * state.multiplier;
          state.score += bonus;
          setScore(Math.floor(state.score));
          setBonusLabel(`Near miss +${bonus}`);
          bonusLabelExpiresAtRef.current = Date.now() + 900;
          flashAlphaRef.current = Math.max(flashAlphaRef.current, 0.18);
        }

        if (hit) {
          if (reviveAvailable) {
            setReviveAvailable(false);
            playDinoReviveSfx();
            setBonusLabel("Второй шанс!");
            bonusLabelExpiresAtRef.current = Date.now() + 1200;
            flashAlphaRef.current = 0.45;
            state.obstacles = state.obstacles.filter(
              (obstacle) => obstacle.x + obstacle.width < DINO_X - 80 || obstacle.x > DINO_X + 140,
            );
            state.dinoVelocityY = JUMP_VELOCITY * 0.55;
            state.dinoY = Math.max(22, state.dinoY);
          } else {
            const rounded = Math.floor(state.score);
            setScore(rounded);
            setIsRunning(false);
            setIsGameOver(true);
            playDinoCrashSfx();
            if (rounded > bestScore) {
              setBestScore(rounded);
              window.localStorage.setItem(BEST_SCORE_STORAGE_KEY, String(rounded));
            }
          }
        } else {
          setScore(Math.floor(state.score));
        }
      }

      if (bonusLabelExpiresAtRef.current && Date.now() > bonusLabelExpiresAtRef.current) {
        bonusLabelExpiresAtRef.current = null;
        setBonusLabel(null);
      }

      renderDinoRunFrame({
        context,
        canvasWidth,
        groundY,
        state: stateRef.current,
        bestScore,
        isRunning,
        isGameOver,
        isPaused,
        bonusLabel,
        flashAlpha: flashAlphaRef.current,
        biome: getBiomeById(biomeId),
      });
      frameRef.current = window.requestAnimationFrame(tick);
    };

    frameRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (frameRef.current != null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [
    bestScore,
    bonusLabel,
    canvasWidth,
    groundY,
    isGameOver,
    isPaused,
    isRunning,
    biomeId,
    reviveAvailable,
  ]);

  useEffect(() => {
    if (!isGameOver || submittedGameOverRef.current || score <= 0) {
      return;
    }

    submittedGameOverRef.current = true;
    const runDurationMs = Math.max(
      0,
      gameStartTimeRef.current ? Date.now() - gameStartTimeRef.current : 0,
    );

    const submit = async () => {
      const result = await submitDinoRunScore({ score, runDurationMs });
      if (result.ok) {
        setSubmitStatus("Результат отправлен в недельный топ.");
        playDinoSubmitSfx();
        await loadLeaderboard();
        return;
      }
      if (result.status === 401) {
        setSubmitStatus("Войдите в аккаунт, чтобы попасть в топ.");
        return;
      }
      if (result.status === 429) {
        setSubmitStatus("Слишком часто. Попробуйте через пару секунд.");
        return;
      }
      if (result.status === 422) {
        setSubmitStatus("Результат отклонен проверкой честности.");
        return;
      }
      setSubmitStatus("Не удалось отправить результат.");
    };

    void submit();
  }, [isGameOver, loadLeaderboard, score]);

  return {
    canvasRef,
    isRunning,
    isPaused,
    isGameOver,
    score,
    biomeId,
    setBiomeId,
    canChangeBiome: !isRunning && !isPaused && !isGameOver && score === 0,
    multiplier: stateRef.current.multiplier,
    streak: stateRef.current.streak,
    leaderboard,
    submitStatus,
    queueJump,
    togglePause,
    resetGame,
  };
}
