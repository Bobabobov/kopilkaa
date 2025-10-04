"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { useStackGame } from './useStackGame';
import StackControls from './StackControls';
import StackLeaderboard from './StackLeaderboard';
import './Stack.styles.css';

// Основной контейнер игры Stack
// Объединяет все компоненты: canvas, контролы, состояние игры
const StackGame: React.FC = () => {
  const gameState = useStackGame();

  return (
    <div className="stack-game">
      <div className="stack-game-container">
      <div className="stack-game-header">
        <h2 className="stack-game-title">🎯 Stack Game</h2>
        <div className="stack-game-stats">
          <div className="stat-item">
            <span className="stat-label">Счёт:</span>
            <span className="stat-value">{gameState.score}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Рекорд:</span>
            <span className="stat-value">{gameState.bestScore}</span>
          </div>
        </div>
      </div>

      <div className="stack-game-content">
        <div className="stack-game-main">
          <div className="stack-canvas-wrapper">
            <canvas
              ref={gameState.canvasRef}
              className="stack-canvas"
              width={600}
              height={800}
            />
            {gameState.gameOver && (
              <div className="game-overlay">
                <div className="game-over-message">
                  <h3>Игра окончена!</h3>
                  <p>Ваш счёт: {gameState.score}</p>
                  <p>Лучший результат: {gameState.bestScore}</p>
                </div>
              </div>
            )}
          </div>

          <StackControls
            gameState={gameState}
            onStart={gameState.startGame}
            onRestart={gameState.restartGame}
            onPause={gameState.pauseGame}
            isPlaying={gameState.isPlaying}
            isPaused={gameState.isPaused}
          />
        </div>

        <StackLeaderboard />
      </div>

      <div className="stack-game-instructions">
        <h4>Как играть:</h4>
        <p>• Блоки движутся горизонтально влево-вправо</p>
        <p>• Кликните когда блок над стопкой - он обрезается по пересечению</p>
        <p>• Если нет пересечения - игра окончена</p>
        <p>• Идеальное попадание (±15px) сохраняет полную ширину блока</p>
      </div>
      </div>
    </div>
  );
};

export default StackGame;
