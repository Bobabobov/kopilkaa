import { redirect } from 'next/navigation';
import { getAllowedAdminUser } from '@/lib/adminAccess';
import { AdminDashboardClient } from './_components/AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const admin = await getAllowedAdminUser();
  if (!admin) redirect('/');
  return <AdminDashboardClient />;
}
