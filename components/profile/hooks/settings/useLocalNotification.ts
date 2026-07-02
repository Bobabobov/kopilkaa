'use client';

import { useCallback } from 'react';
import { useBeautifulToast } from '@/components/ui/BeautifulToast';

export type NotificationType = 'success' | 'error' | 'info';

export interface LocalNotificationState {
  show: boolean;
  type: NotificationType;
  title: string;
  message: string;
}

/** Прокси к глобальным тостам — единый стиль на всём сайте */
export function useLocalNotification() {
  const { showToast } = useBeautifulToast();

  const showLocalNotification = useCallback(
    (type: NotificationType, title: string, message: string) => {
      showToast(type, title, message, 4000);
    },
    [showToast],
  );

  const localNotification: LocalNotificationState = {
    show: false,
    type: 'info',
    title: '',
    message: '',
  };

  return { localNotification, showLocalNotification };
}
