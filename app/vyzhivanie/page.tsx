import type { Metadata } from 'next';
import { VyzhivaniePageClient } from './_components/VyzhivaniePageClient';

export const metadata: Metadata = {
  title: 'Кладбище выбывших — Копилка',
  description:
    'Карта могил участников, которые выбыли из текущего раунда.',
};

export default function VyzhivaniePage() {
  return <VyzhivaniePageClient />;
}
