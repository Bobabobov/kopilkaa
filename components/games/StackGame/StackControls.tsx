"use client";

import React from 'react';

// Интерфейс для состояния игры (из хука useStackGame)
interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  gameOver: boolean;
  score: number;
  bestScore: number;
}

// Интерфейс для пропсов компонента
interface StackControlsProps {
  gameState: GameState;
  onStart: () => void;
  onRestart: () => void;
  onPause: () => void;
  isPlaying: boolean;
  isPaused: boolean;
}

// Компонент с UI контролами для игры Stack
// Содержит кнопки управления и информацию о состоянии игры
const StackControls: React.FC<StackControlsProps> = ({
  gameState,
  onStart,
  onRestart,
  onPause,
  isPlaying,
  isPaused
}) => {
  return (
    <div className="stack-controls">
      <div className="controls-buttons">
        {!isPlaying && !gameState.gameOver && (
          <button 
            className="control-btn control-btn-primary"
            onClick={onStart}
          >
            🎮 Начать игру
          </button>
        )}

        {isPlaying && !gameState.gameOver && (
          <button 
            className="control-btn control-btn-secondary"
            onClick={onPause}
          >
            {isPaused ? '▶️ Продолжить' : '⏸️ Пауза'}
          </button>
        )}

        {gameState.gameOver && (
          <button 
            className="control-btn control-btn-primary"
            onClick={onRestart}
          >
            🔄 Новая игра
          </button>
        )}

        {isPlaying && !gameState.gameOver && (
          <button 
            className="control-btn control-btn-secondary"
            onClick={onRestart}
          >
            🔄 Рестарт
          </button>
        )}
      </div>

      <div className="controls-info">
        <div className="info-section">
          <h4>Статус игры:</h4>
          <div className="status-indicator">
            {gameState.gameOver && (
              <span className="status status-game-over">Игра окончена</span>
            )}
            {isPlaying && !isPaused && !gameState.gameOver && (
              <span className="status status-playing">Играем</span>
            )}
            {isPaused && !gameState.gameOver && (
              <span className="status status-paused">Пауза</span>
            )}
            {!isPlaying && !gameState.gameOver && (
              <span className="status status-ready">Готов к игре</span>
            )}
          </div>
        </div>

        <div className="info-section">
          <h4>Управление:</h4>
          <p className="control-hint">
            {gameState.gameOver 
              ? 'Нажмите "Новая игра" чтобы начать заново'
              : isPlaying && !gameState.gameOver
              ? 'Кликните когда блок пересекается со стопкой'
              : 'Нажмите "Начать игру" чтобы начать'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default StackControls;
