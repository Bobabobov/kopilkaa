'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { LucideIcons } from '@/components/ui/LucideIcons';
import { AdminPage } from '../_components/AdminPage';
import { AdminPanel, AdminTabBar } from '../_components/admin-ui';
import AdsPlacementsSection from './_components/AdsPlacementsSection';
import AdsRequestsSection from './_components/AdsRequestsSection';

type Tab = 'placements' | 'requests';

export default function AdsManagementClient() {
  const searchParams = useSearchParams();
  const initialTab: Tab =
    searchParams.get('tab') === 'requests' ? 'requests' : 'placements';

  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  return (
    <AdminPage
      title="Реклама"
      description="Заявки рекламодателей и активные размещения."
      actions={
        <Link
          href="/standards"
          className="inline-flex items-center gap-2 rounded-lg border border-[#abd1c6]/20 px-3 py-1.5 text-sm text-[#abd1c6] hover:bg-[#004643]/40 transition-colors"
        >
          <LucideIcons.FileText size="sm" />
          Стандарты
        </Link>
      }
    >
      <AdminTabBar
        tabs={[
          { id: 'placements', label: 'Размещения' },
          { id: 'requests', label: 'Заявки' },
        ]}
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as Tab)}
      />

      <AdminPanel
        title={activeTab === 'placements' ? 'Размещения' : 'Заявки'}
        accent="neutral"
      >
        {activeTab === 'placements' ? (
          <AdsPlacementsSection />
        ) : (
          <AdsRequestsSection />
        )}
      </AdminPanel>
    </AdminPage>
  );
}
