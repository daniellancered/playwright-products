'use client';

import { useRouter } from 'next/navigation';
import DashboardPreview from '@/components/login-preview/DashboardPreview';

export default function DashboardClient() {
  const router = useRouter();

  async function handleSignOut() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_70%_8%,#5048dc29,transparent_35%),#080b14] font-sans text-sm leading-6 text-[#f3f5fb]">
      <DashboardPreview onSignOut={handleSignOut} />
    </main>
  );
}
