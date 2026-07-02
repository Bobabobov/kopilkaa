import type { Metadata } from 'next';
import KopiDemoApplication from '@/components/kopi/KopiDemoApplication';

export const metadata: Metadata = {
  title: 'Демо-публикация',
  description:
    'Пример страницы публикации истории на платформе Копилка для незарегистрированных пользователей.',
  robots: { index: false, follow: false },
};

export default function ApplicationsDemoPage() {
  return <KopiDemoApplication />;
}
