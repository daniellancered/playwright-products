import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { Suspense } from 'react';
import DashboardClient from './DashboardClient';
import { readSessionToken, sessionCookie } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Dashboard | ProductManager',
  description: 'ProductManager demo inventory dashboard.',
};

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <AuthenticatedDashboard />
    </Suspense>
  );
}

async function AuthenticatedDashboard() {
  await connection();
  const cookieStore = await cookies();
  const session = readSessionToken(cookieStore.get(sessionCookie.name)?.value);

  if (!session) redirect('/login');

  return <DashboardClient />;
}
