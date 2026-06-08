import type { Metadata } from 'next';
import KopiDemoProfile from '@/components/kopi/KopiDemoProfile';

export const metadata: Metadata = {
  title: 'Демо-профиль',
  description:
    'Пример личного кабинета на платформе Копилка для незарегистрированных пользователей.',
  robots: { index: false, follow: false },
};

export default function ProfileDemoPage() {
  return <KopiDemoProfile />;
}
