// lib/useBulldog.ts
"use client";

import { useState, useEffect, useCallback } from "react";

export interface BulldogState {
  clickCount: number;
  isHappy: boolean;
  currentImage: string;
  mood: 'normal' | 'happy' | 'excited' | 'sleepy' | 'playful';
  level: number;
  experience: number;
  lastClickTime: number;
  streak: number;
}

export interface BulldogStats {
  totalClicks: number;
  sessionsPlayed: number;
  favoriteMood: string;
  longestStreak: number;
  totalPlayTime: number;
}

const MOODS = {
  normal: '/buldog/buldog1.png',
  happy: '/buldog/buldog2.png',
  excited: '/buldog/buldog3.png',
  sleepy: '/buldog/buldog4.png', // Сонный бульдог - начальное состояние
  playful: '/buldog/buldog5.png',
  surprised: '/buldog/buldog6.png'
};

// Случайные эмоции для кликов
const RANDOM_EMOTIONS = [
  'happy', 'excited', 'playful', 'surprised'
];


export function useBulldog() {
  const [state, setState] = useState<BulldogState>({
    clickCount: 0,
    isHappy: false,
    currentImage: MOODS.sleepy, // Начальное состояние - сонный бульдог
    mood: 'sleepy',
    level: 1,
    experience: 0,
    lastClickTime: 0,
    streak: 0
  });

  // Таймер для сброса серии
  const [streakTimer, setStreakTimer] = useState<NodeJS.Timeout | null>(null);

  const [stats, setStats] = useState<BulldogStats>({
    totalClicks: 0,
    sessionsPlayed: 1,
    favoriteMood: 'normal',
    longestStreak: 0,
    totalPlayTime: 0
  });

  // Загрузка данных из localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('bulldog-state');
    const savedStats = localStorage.getItem('bulldog-stats');
    
    if (savedState) {
      setState(JSON.parse(savedState));
    }
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  // Сохранение данных в localStorage
  useEffect(() => {
    localStorage.setItem('bulldog-state', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    localStorage.setItem('bulldog-stats', JSON.stringify(stats));
  }, [stats]);

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (streakTimer) {
        clearTimeout(streakTimer);
      }
    };
  }, [streakTimer]);


  // Определение настроения
  const getMood = useCallback((clickCount: number, streak: number): BulldogState['mood'] => {
    if (clickCount === 0 || streak === 0) return 'sleepy'; // Начальное состояние или сброшенная серия
    if (streak >= 10) return 'excited';
    if (streak >= 5) return 'playful';
    if (clickCount >= 50) return 'happy';
    if (clickCount >= 20) return 'normal';
    return 'sleepy';
  }, []);

  // Сброс серии кликов
  const resetStreak = useCallback(() => {
    setState(prev => {
      // Если серия уже 0, не меняем изображение
      if (prev.streak === 0) {
        return prev;
      }
      
      return { 
        ...prev, 
        streak: 0,
        mood: 'sleepy',
        currentImage: MOODS.sleepy
      };
    });
  }, []);

  // Функция для запуска таймера сброса серии
  const startStreakTimer = useCallback(() => {
    // Очищаем предыдущий таймер
    if (streakTimer) {
      clearTimeout(streakTimer);
    }

    // Запускаем новый таймер на 1 секунду
    const timer = setTimeout(() => {
      resetStreak();
      setStreakTimer(null);
    }, 1000);

    setStreakTimer(timer);
  }, [streakTimer, resetStreak]);

  // Обработка клика
  const handleClick = useCallback(() => {
    const now = Date.now();
    const timeSinceLastClick = now - state.lastClickTime;
    
    // Определяем серию кликов (если прошло меньше 2 секунд)
    const newStreak = timeSinceLastClick < 2000 ? state.streak + 1 : 1;
    const newClickCount = state.clickCount + 1;
    
    // Выбираем случайную эмоцию для клика
    const randomEmotion = RANDOM_EMOTIONS[Math.floor(Math.random() * RANDOM_EMOTIONS.length)];
    const newMood = getMood(newClickCount, newStreak);
    
    setState(prev => ({
      ...prev,
      clickCount: newClickCount,
      isHappy: true,
      currentImage: MOODS[randomEmotion as keyof typeof MOODS], // Случайная эмоция при клике
      mood: randomEmotion as 'normal' | 'happy' | 'excited' | 'sleepy' | 'playful', // Временно показываем случайную эмоцию
      experience: prev.experience + 1,
      lastClickTime: now,
      streak: newStreak
    }));

    setStats(prev => ({
      ...prev,
      totalClicks: prev.totalClicks + 1,
      longestStreak: Math.max(prev.longestStreak, newStreak),
      favoriteMood: newMood
    }));


    // Запускаем таймер сброса серии
    startStreakTimer();

    // Сброс состояния счастья через 2 секунды
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isHappy: false
      }));
    }, 2000);
  }, [state.clickCount, state.streak, state.lastClickTime, getMood, startStreakTimer]);

  // Получение сообщения
  const getMessage = useCallback(() => {
    const { clickCount, streak, mood } = state;
    
    if (streak >= 10) {
      return { text: "Неудержимый! 🔥", type: "excited" };
    }
    
    if (streak >= 5) {
      return { text: "Горячая серия! ⚡", type: "streak" };
    }
    
    const messages = {
      sleepy: ["Сонный бульдог... 😴", "Время для отдыха 🛌", "Zzz... 💤"],
      normal: ["Хорошо! 🐕", "Мне нравится! 😊", "Не плохо! 👍"],
      happy: ["Отлично! 🎉", "Я счастлив! 😄", "Ура! 🎊"],
      playful: ["Давай играть! 🎾", "Еще! Еще! 🎈", "Весело! 🎪"],
      excited: ["ВОООО! 🚀", "Я в восторге! 🌟", "Невероятно! ⚡"],
      surprised: ["Ого! 😲", "Неожиданно! 😮", "Вау! 🤯"]
    };
    
    const moodMessages = messages[mood];
    const randomMessage = moodMessages[Math.floor(Math.random() * moodMessages.length)];
    
    return { text: randomMessage, type: mood };
  }, [state]);

  // Получение уровня
  const getLevel = useCallback(() => {
    return Math.floor(state.experience / 10) + 1;
  }, [state.experience]);

  // Получение прогресса до следующего уровня
  const getLevelProgress = useCallback(() => {
    const currentLevelExp = (getLevel() - 1) * 10;
    const nextLevelExp = getLevel() * 10;
    const currentExp = state.experience - currentLevelExp;
    const expNeeded = nextLevelExp - currentLevelExp;
    
    return {
      current: currentExp,
      needed: expNeeded,
      percentage: (currentExp / expNeeded) * 100
    };
  }, [state.experience, getLevel]);

  return {
    state,
    stats,
    handleClick,
    resetStreak,
    getMessage,
    getLevel,
    getLevelProgress
  };
}
