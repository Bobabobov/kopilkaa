import type { Metadata } from 'next';
import KopiDemoApplication from '@/components/kopi/KopiDemoApplication';

export const metadata: Metadata = {
  title: 'Демо-заявка',
  description:
    'Пример страницы подачи заявки на платформе Копилка для незарегистрированных пользователей.',
  robots: { index: false, follow: false },
};

export default function ApplicationsDemoPage() {
  return <KopiDemoApplication />;
}
