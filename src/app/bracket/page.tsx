'use client';

import dynamic from 'next/dynamic';

const BracketClient = dynamic(
  () => import('@/components/dashboard/bracket-client'),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-6 p-4 lg:p-6">
        <div className="h-44 animate-pulse rounded-[28px] bg-slate-200 dark:bg-white/[0.04]" />
        <div className="h-14 animate-pulse rounded-2xl bg-slate-200 dark:bg-white/[0.04]" />
        <div className="h-[640px] animate-pulse rounded-2xl bg-slate-200 dark:bg-white/[0.04]" />
      </div>
    ),
  }
);

export default function BracketPage() {
  return <BracketClient />;
}
