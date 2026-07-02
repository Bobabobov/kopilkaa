import { redirect } from 'next/navigation';
import { getAllowedAdminUser } from '@/lib/adminAccess';
import AdminFeedbackClient from './AdminFeedbackClient';

export const dynamic = 'force-dynamic';

export default async function AdminFeedbackPage() {
  const admin = await getAllowedAdminUser();
  if (!admin) redirect('/');
  return <AdminFeedbackClient />;
}
