import { redirect } from 'next/navigation';
import { getAllowedAdminUser } from '@/lib/adminAccess';
import { AdminShell } from './_components/AdminShell';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAllowedAdminUser();
  if (!admin) redirect('/');
  return <AdminShell>{children}</AdminShell>;
}
