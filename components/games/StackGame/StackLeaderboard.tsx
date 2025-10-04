// Компонент таблицы рекордов для Stack Game
// Шаблон для будущего функционала рейтинга игроков

import React from 'react';

interface LeaderboardEntry {
  id: number;
  name: string;
  score: number;
  date: string;
}

// Моковые данные для демонстрации
const mockLeaderboard: LeaderboardEntry[] = [
  { id: 1, name: "Игрок1", score: 25, date: "2024-01-15" },
  { id: 2, name: "Мастер", score: 22, date: "2024-01-14" },
  { id: 3, name: "Профи", score: 18, date: "2024-01-13" },
  { id: 4, name: "Новичок", score: 15, date: "2024-01-12" },
  { id: 5, name: "Чемпион", score: 12, date: "2024-01-11" },
  { id: 6, name: "Игрок6", score: 10, date: "2024-01-10" },
  { id: 7, name: "Лучший", score: 8, date: "2024-01-09" },
  { id: 8, name: "Стэкер", score: 6, date: "2024-01-08" },
];

const StackLeaderboard: React.FC = () => {
  return (
    <div className="stack-game-leaderboard">
      <div className="leaderboard-header">
        <h3 className="leaderboard-title">🏆 Таблица рекордов</h3>
        <div className="leaderboard-subtitle">Лучшие результаты</div>
      </div>

      <div className="leaderboard-content">
        <div className="leaderboard-list">
          {mockLeaderboard.map((entry, index) => (
            <div key={entry.id} className={`leaderboard-item ${index < 3 ? 'top-three' : ''}`}>
              <div className="rank">
                {index === 0 && "🥇"}
                {index === 1 && "🥈"}
                {index === 2 && "🥉"}
                {index > 2 && `#${index + 1}`}
              </div>
              
              <div className="player-info">
                <div className="player-name">{entry.name}</div>
                <div className="player-date">{entry.date}</div>
              </div>
              
              <div className="player-score">{entry.score}</div>
            </div>
          ))}
        </div>

        <div className="leaderboard-footer">
          <div className="current-user-info">
            <div className="current-rank">Ваш рейтинг: #--</div>
            <div className="current-best">Лучший результат: --</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StackLeaderboard;
