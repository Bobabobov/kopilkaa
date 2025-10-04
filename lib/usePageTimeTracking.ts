// lib/usePageTimeTracking.ts
import { useEffect, useRef } from 'react';

interface UsePageTimeTrackingOptions {
  page: string;
  enabled?: boolean;
  sendInterval?: number; // интервал отправки данных в миллисекундах
}

export function usePageTimeTracking({ 
  page, 
  enabled = true, 
  sendInterval = 30000 // отправляем каждые 30 секунд
}: UsePageTimeTrackingOptions) {
  const startTimeRef = useRef<number | null>(null);
  const accumulatedTimeRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isActiveRef = useRef<boolean>(false);

  // Функция для отправки времени на сервер
  const sendTimeToServer = async (timeSpent: number) => {
    try {
      await fetch('/api/page-visits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page,
          timeSpent,
        }),
      });
    } catch (error) {
      console.error('Ошибка отправки времени посещения:', error);
    }
  };

  // Функция для начала отслеживания
  const startTracking = () => {
    if (!enabled || isActiveRef.current) return;
    
    startTimeRef.current = Date.now();
    isActiveRef.current = true;
    
    // Отправляем данные через заданный интервал
    intervalRef.current = setInterval(() => {
      if (startTimeRef.current && isActiveRef.current) {
        const currentTime = Date.now();
        const timeSpent = currentTime - startTimeRef.current;
        accumulatedTimeRef.current += timeSpent;
        
        sendTimeToServer(timeSpent);
        // НЕ сбрасываем таймер - продолжаем отслеживать
      }
    }, sendInterval);
  };

  // Функция для остановки отслеживания
  const stopTracking = () => {
    if (!isActiveRef.current) return;
    
    isActiveRef.current = false;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Отправляем оставшееся время
    if (startTimeRef.current) {
      const finalTime = Date.now() - startTimeRef.current;
      accumulatedTimeRef.current += finalTime;
      sendTimeToServer(finalTime);
      startTimeRef.current = null;
    }
  };

  // Обработчики видимости страницы
  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopTracking();
      } else {
        startTracking();
      }
    };

    const handleBeforeUnload = () => {
      stopTracking();
    };

    // Начинаем отслеживание при загрузке
    startTracking();

    // Слушаем изменения видимости страницы
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      stopTracking();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled, page, sendInterval]);

  return {
    startTracking,
    stopTracking,
    isTracking: isActiveRef.current,
    totalTime: accumulatedTimeRef.current,
  };
}
