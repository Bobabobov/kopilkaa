import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getAllowedAdminUser } from '@/lib/adminAccess';
import AdminApplicationsClient from './AdminApplicationsClient';
import AdminLoading from '../_components/AdminLoading';

export const dynamic = 'force-dynamic';

export default async function AdminApplicationsPage() {
  const admin = await getAllowedAdminUser();
  if (!admin) redirect('/');
  return (
    <Suspense fallback={<AdminLoading />}>
      <AdminApplicationsClient />
    </Suspense>
  );
}
