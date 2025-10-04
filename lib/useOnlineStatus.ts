import { useEffect, useState } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Обновляем статус при загрузке страницы
    const updateStatus = async () => {
      try {
        await fetch('/api/profile/me', { cache: 'no-store' });
      } catch (error) {
        console.error('Error updating online status:', error);
      }
    };

    // Обновляем статус сразу
    updateStatus();

    // Обновляем статус каждые 2 минуты
    const interval = setInterval(updateStatus, 2 * 60 * 1000);

    // Обновляем статус при фокусе на окне
    const handleFocus = () => {
      updateStatus();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return isOnline;
}
