// app/admin/applications/AdminApplicationsClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ApplicationsGrid from '../_components/ApplicationsGrid';
import ImageLightbox from '../_components/ImageLightbox';
import AdminLoading from '../_components/AdminLoading';
import AdminUnifiedWorkspace from '../_components/AdminUnifiedWorkspace';
import { AdminPage } from '../_components/AdminPage';
import Pagination from '../_components/Pagination';
import { useAdminApplications } from '@/hooks/admin/useAdminApplications';

export default function AdminApplicationsClient() {
  const searchParams = useSearchParams();
  const initialStatusParam = searchParams.get('status');
  const initialStatus =
    initialStatusParam === 'PENDING' ||
    initialStatusParam === 'APPROVED' ||
    initialStatusParam === 'REJECTED'
      ? initialStatusParam
      : undefined;

  const {
    items,
    isSearchPending,
    loading,
    error,
    page,
    total,
    totalPages,
    stats,
    q,
    setQ,
    status,
    setStatus,
    minAmount,
    setMinAmount,
    maxAmount,
    setMaxAmount,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    setPage,
    toggleEmail,
    visibleEmails,
  } = useAdminApplications({ initialStatus });

  const [lightbox, setLightbox] = useState<{
    isOpen: boolean;
    images: string[];
    currentIndex: number;
  }>({
    isOpen: false,
    images: [],
    currentIndex: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (loading) return;
    const saved = sessionStorage.getItem('admin-scroll');
    if (saved) {
      const y = parseInt(saved, 10);
      if (Number.isFinite(y)) {
        window.scrollTo({ top: y, behavior: 'auto' });
      }
      sessionStorage.removeItem('admin-scroll');
    }
  }, [loading]);

  if (loading && items.length === 0) {
    return <AdminLoading />;
  }

  const handleResetFilters = () => {
    setQ('');
    setStatus('ALL');
    setMinAmount('');
    setMaxAmount('');
    setSortBy('date');
    setSortOrder('desc');
  };

  return (
    <AdminPage
      title="Заявки"
      description="Модерация заявок на поддержку"
    >
      <AdminUnifiedWorkspace
        stats={stats}
        items={items}
        q={q}
        status={status}
        minAmount={minAmount}
        maxAmount={maxAmount}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSearchChange={setQ}
        onStatusChange={setStatus}
        onMinAmountChange={setMinAmount}
        onMaxAmountChange={setMaxAmount}
        onSortByChange={setSortBy}
        onSortOrderChange={setSortOrder}
        onReset={handleResetFilters}
      />

      <div className="mt-6">
        {total > 0 ? (
          <p className="mb-4 text-sm text-[#abd1c6]/80">
            Показано {items.length} из {total}
            {totalPages > 1 ? ` · стр. ${page} / ${totalPages}` : ''}
          </p>
        ) : null}

        <ApplicationsGrid
          applications={items}
          loading={loading}
          isSearchPending={isSearchPending}
          error={error}
          visibleEmails={visibleEmails}
          onToggleEmail={toggleEmail}
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      <ImageLightbox
        isOpen={lightbox.isOpen}
        onClose={() =>
          setLightbox({ isOpen: false, images: [], currentIndex: 0 })
        }
        images={lightbox.images}
        currentIndex={lightbox.currentIndex}
        onIndexChange={(index) =>
          setLightbox((prev) => ({ ...prev, currentIndex: index }))
        }
      />
    </AdminPage>
  );
}
